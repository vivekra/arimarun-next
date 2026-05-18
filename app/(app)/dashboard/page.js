
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';

const SESSION_HISTORY = [
  { date: 'May 13, 2026', duration: '2h 14m', from: 'Chrome / macOS', status: 'completed' },
  { date: 'May 11, 2026', duration: '45m', from: 'Firefox / Linux', status: 'completed' },
  { date: 'May 10, 2026', duration: '3h 02m', from: 'Chrome / macOS', status: 'completed' },
  { date: 'May 7, 2026', duration: '1h 18m', from: 'Edge / Windows', status: 'completed' },
  { date: 'May 4, 2026', duration: '58m', from: 'Chrome / macOS', status: 'completed' },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [product, setProduct] = useState(null);   // real product from API
  const [products, setProducts] = useState({});     // full catalog for upgrade modal
  const [deployments, setDeployments] = useState([]);
  const [desktopStatus, setDesktopStatus] = useState('stopped');
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Starting container...');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('');
  const [activeSessionSecs, setActiveSessionSecs] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [activeDeploymentId, setActiveDeploymentId] = useState(null);
  const [consoleOffline, setConsoleOffline] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const router = useRouter();

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const apiFetch = (url, options = {}) => {
    return fetch(url, { cache: 'no-store', ...options, credentials: 'include' });
  };

  const doLogout = async () => {
    await apiFetch(`${CONFIG.API_BASE_URL}/api/v1/auth/logout`, { method: 'POST' });
    router.push('/login');
  };

  // ── Trial banner helpers ────────────────────────────────────────────────
  const trialDaysLeft = () => {
    if (!trialEndsAt) return null;
    const diff = Math.ceil((new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const canLaunch = () => ['active', 'trialing'].includes(subscriptionStatus);

  // ── Fetch user + catalog on mount ───────────────────────────────────────
  useEffect(() => {
    apiFetch(`${CONFIG.API_BASE_URL}/api/v1/auth/me`)
      .then(res => { if (!res.ok) throw new Error('Not logged in'); return res.json(); })
      .then(data => {
        setUser({ email: data.email, name: data.full_name, plan: data.plan || 'starter' });
        setTenantId(data.tenant_id);
        setSubscriptionStatus(data.subscription_status);
        setTrialEndsAt(data.trial_ends_at || null);
        setProduct(data.product || null);   // product details from /me

        if (data.tenant_id) {
          apiFetch(`${CONFIG.API_BASE_URL}/api/v1/deployments/${data.tenant_id}`)
            .then(res => res.json())
            .then(deps => {
              if (deps.length > 0) {
                setDeployments(deps);
                setDesktopStatus(deps[0].status);
                setActiveDeploymentId(deps[0].id);
                if (['pending', 'provisioning'].includes(deps[0].status)) pollStatus(deps[0].id);
              }
            });
        }
      })
      .catch(() => router.push('/login'));

    // Fetch product catalog for upgrade modal
    apiFetch(`${CONFIG.API_BASE_URL}/api/v1/subscriptions/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products || {}))
      .catch(() => { });
  }, [router]);

  const pollStatus = (deploymentId) => {
    const interval = setInterval(() => {
      apiFetch(`${CONFIG.API_BASE_URL}/api/v1/deployments/${tenantId}`)
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(deps => {
          const d = deps.find(dep => dep.id === deploymentId);
          setDeployments(deps);
          if (d) {
            setDesktopStatus(d.status);
            if (d.status === 'running') { 
              clearInterval(interval); 
              setProgressPct(100); 
              setProgressLabel('Ready!'); 
              showToast('Desktop is ready!', 'success'); 
              // Automatically redirect directly to workspace URL
              window.open(`https://${d.subdomain}`, '_blank');
            }
            if (d.status === 'failed') { clearInterval(interval); setProgressLabel('Provisioning failed'); showToast('Failed to start desktop.', 'error'); }
            if (d.status === 'scheduled') { setProgressPct(30); setProgressLabel('Scheduled for worker...'); }
            if (d.status === 'provisioning') { setProgressPct(50); setProgressLabel('Starting container...'); }
          }
        })
        .catch(err => console.error('Polling error:', err));
    }, 3000);
  };

  const fetchLogs = (deploymentId) => {
    if (!deploymentId) return;
    apiFetch(`${CONFIG.API_BASE_URL}/api/v1/deployments/logs/${deploymentId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setConsoleOffline(false); if (data.logs) setConsoleLogs(data.logs); })
      .catch(() => setConsoleOffline(true));
  };

  useEffect(() => {
    let logInterval;
    if (showConsole && activeDeploymentId) {
      fetchLogs(activeDeploymentId);
      logInterval = setInterval(() => fetchLogs(activeDeploymentId), 2000);
    }
    return () => clearInterval(logInterval);
  }, [showConsole, activeDeploymentId]);

  const launchDesktop = () => {
    if (!canLaunch()) {
      showToast('Your trial has ended. Please upgrade to continue.', 'error');
      setUpgradeOpen(true);
      return;
    }
    if (desktopStatus !== 'stopped' && desktopStatus !== 'failed') return;

    setDesktopStatus('starting');
    setProgressPct(10);
    setProgressLabel('Requesting provisioning...');

    apiFetch(`${CONFIG.API_BASE_URL}/api/v1/deployments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant_id: tenantId,
        name: 'Primary Workspace',
        image: 'kasmweb/ubuntu-focal-desktop:1.14.0',
        subdomain: `ws-${tenantId?.substring(0, 8)}.arima.io`,
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Launch failed. Please try again.');
        }
        return res.json();
      })
      .then(data => {
        if (data.id) {
          setDeployments([data]);
          setActiveDeploymentId(data.id);
          pollStatus(data.id);
        } else {
          throw new Error(data.detail || 'Launch failed');
        }
      })
      .catch((err) => { 
        showToast(err.message || 'Network error. Please retry.', 'error'); 
        setDesktopStatus('stopped'); 
      });
  };

  const resetWorkspace = () => {
    if (!activeDeploymentId) { setDesktopStatus('stopped'); return; }
    setDesktopStatus('stopped');
    setProgressPct(0);
    setProgressLabel('Stopped');
    setConsoleLogs([]);
    showToast('Workspace reset initiated...', 'info');

    apiFetch(`${CONFIG.API_BASE_URL}/api/v1/deployments/${activeDeploymentId}`, {
      method: 'DELETE',
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => { setDeployments([]); setActiveDeploymentId(null); showToast('Workspace reset. Launch when ready!', 'success'); })
      .catch(() => showToast('Error resetting workspace', 'error'));
  };

  useEffect(() => {
    let int;
    if (desktopStatus === 'running') int = setInterval(() => setActiveSessionSecs(s => s + 1), 1000);
    return () => clearInterval(int);
  }, [desktopStatus]);

  if (!user) return <div style={{ padding: '50px', color: '#fff', textAlign: 'center' }}>Loading...</div>;

  const m = Math.floor(activeSessionSecs / 60);
  const s = activeSessionSecs % 60;
  const timerText = m > 0 ? `${m}m ${s}s` : `${s}s`;
  const greet = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const daysLeft = trialDaysLeft();

  // Derive specs from real product data (fallback to sensible defaults)
  const specCpu = product?.cpu || '0.5';
  const specMemory = product?.memory || '512m';
  const specStorage = product?.storage_gb != null ? `${product.storage_gb} GB` : '10 GB';
  const specPrice = product?.monthly_price_pence != null
    ? (product.monthly_price_pence === 0 ? 'Free trial' : `£${(product.monthly_price_pence / 100).toFixed(2)}/mo`)
    : 'Trial';
  const planLabel = product?.name || (subscriptionStatus === 'trialing' ? 'Starter Trial' : user.plan);

  return (
    <>
      <div id="dashboard" style={{ display: 'block' }}>
        <nav className="nav">
          <div className="nav-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Arima<span>Run</span>
          </div>
          <div className="nav-right">
            <div className="nav-user">
              <div className="avatar">{user.email[0].toUpperCase()}</div>
              <span className="nav-email">{user.email}</span>
            </div>
            <button className="btn-logout" onClick={doLogout}>Sign out</button>
          </div>
        </nav>

        <div className="main">
          <div className="page-header">
            <div className="page-title">Your <span>Desktop</span></div>
            <div className="page-sub">{greet} — ready to launch your workspace?</div>
          </div>

          {/* ── Trial banner ─────────────────────────────────────────── */}
          {subscriptionStatus === 'trialing' && daysLeft !== null && (
            <div style={{
              background: daysLeft <= 3 ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.10)',
              border: `1px solid ${daysLeft <= 3 ? 'rgba(239,68,68,0.4)' : 'rgba(251,191,36,0.3)'}`,
              borderRadius: '10px', padding: '12px 18px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
              <span style={{ color: daysLeft <= 3 ? '#fca5a5' : '#fde68a', fontSize: '14px' }}>
                {daysLeft > 0
                  ? `⏳ Your free trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`
                  : '⚠️ Your free trial has ended.'}
              </span>
              <button
                onClick={() => setUpgradeOpen(true)}
                style={{
                  background: '#4ade80', color: '#000', border: 'none', borderRadius: '6px',
                  padding: '6px 14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                }}
              >
                Upgrade now
              </button>
            </div>
          )}

          {/* ── Stats row ─────────────────────────────────────────────── */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Plan</div>
              <div className="stat-value green">{planLabel}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Billing</div>
              <div className="stat-value blue">{specPrice}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Status</div>
              <div className="stat-value muted" style={{ textTransform: 'capitalize' }}>{subscriptionStatus}</div>
            </div>
          </div>

          {/* ── Launch card ───────────────────────────────────────────── */}
          <div className="launch-card">
            <div className="launch-header">
              <div>
                <div className="launch-title">Ubuntu Desktop</div>
                <div className="launch-desc">Xfce4 · KasmVNC · Ubuntu 22.04 LTS</div>
              </div>
              <div className={`status-badge ${desktopStatus}`}>
                <div className="status-dot"></div>
                <span>{desktopStatus.charAt(0).toUpperCase() + desktopStatus.slice(1)}</span>
              </div>
            </div>

            {/* Live specs from product catalog */}
            <div className="specs-row">
              <div className="spec-item">
                <div className="spec-key">CPU</div>
                <div className="spec-val">{specCpu} vCPU</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">RAM</div>
                <div className="spec-val">{specMemory}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Storage</div>
                <div className="spec-val">{specStorage}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Region</div>
                <div className="spec-val">EU-West</div>
              </div>
            </div>

            {(desktopStatus === 'stopped' || desktopStatus === 'failed') && (
              <div className="action-row">
                <button className="btn-launch" onClick={launchDesktop}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Launch Desktop
                </button>
                {!canLaunch() && (
                  <span style={{ fontSize: '12px', color: '#f87171', marginLeft: '10px' }}>
                    Trial ended — upgrade to launch
                  </span>
                )}
              </div>
            )}

            {(desktopStatus === 'starting' || desktopStatus === 'pending' || desktopStatus === 'scheduled' || desktopStatus === 'provisioning') && (
              <div style={{ marginTop: '16px' }}>
                <div className="startup-progress" style={{ display: 'block' }}>
                  <div className="progress-label">
                    <span>{progressLabel}</span><span>{progressPct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>
                <div className="action-row" style={{ marginTop: '12px' }}>
                  <button className="btn-stop" onClick={resetWorkspace} style={{ background: '#ff5f57', borderColor: '#ff5f57', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                    Stop & Reset Workspace
                  </button>
                </div>
              </div>
            )}

            {desktopStatus === 'running' && (
              <div className="action-row">
                <a className="btn-open" href={`https://${deployments[0]?.subdomain}`} target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                  Open Desktop
                </a>
                <button className="btn-stop" onClick={resetWorkspace}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                  Stop
                </button>
              </div>
            )}

            <button className="btn-secondary" onClick={() => setShowConsole(!showConsole)} style={{
              marginTop: '16px', fontSize: '12px', padding: '8px 12px', display: 'flex',
              alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', borderRadius: '6px', transition: 'all 0.2s ease',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              {showConsole ? 'Hide Console Logs' : 'Show Console Logs'}
            </button>

            {showConsole && (
              <div className="terminal-panel" style={{
                marginTop: '16px', background: '#090d16', border: '1px solid #1f2937',
                borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '12px',
                color: '#a3b8cc', maxHeight: '220px', overflowY: 'auto', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '6px', marginBottom: '8px', color: consoleOffline ? '#f59e0b' : '#4ade80', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                  <span>{consoleOffline ? '⚠️ CONSOLE OFFLINE (RECONNECTING...)' : '⚡ LIVE SANDBOX PROVISIONING CONSOLE'}</span>
                  <button onClick={() => setShowConsole(false)} style={{ background: 'none', border: 'none', color: '#ff5f57', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {consoleLogs.length === 0 ? (
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>No logs yet. Click 'Launch Desktop' to stream live logs...</span>
                  ) : (
                    consoleLogs.map((log, i) => (
                      <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4', color: log.includes('FAILED') || log.includes('Error') ? '#ff605c' : log.includes('RUNNING') || log.includes('successfully') || log.includes('Ready') ? '#00ca4e' : log.includes('---') ? '#818cf8' : '#e2e8f0' }}>{log}</div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Subscription / Products ───────────────────────────────── */}
          <div className="section-title">
            Available Plans
            <button onClick={() => setUpgradeOpen(true)} style={{ marginLeft: '12px', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
              Upgrade
            </button>
          </div>

          <div className="plan-grid">
            {/* Desktop plans from catalog */}
            {(products.desktop || []).map(p => {
              const isCurrent = product?.name === p.name;
              const isFree = p.monthly_price_pence === 0;
              return (
                <div key={p.id} className={`plan-card ${isCurrent ? 'current' : ''}`}>
                  <div className="plan-name">
                    {p.name}
                    {isCurrent && <span className="current-badge">Current plan</span>}
                  </div>
                  <div className="plan-price">
                    {isFree ? 'Free' : `£${(p.monthly_price_pence / 100).toFixed(0)}`}
                    {!isFree && <span>/month</span>}
                  </div>
                  <ul className="plan-features">
                    <li>{p.cpu} vCPU · {p.memory} RAM</li>
                    <li>{p.storage_gb} GB storage</li>
                    <li>{p.bandwidth_gb} GB bandwidth</li>
                    <li>Up to {p.max_instances} instance{p.max_instances > 1 ? 's' : ''}</li>
                    {isFree && <li>14-day trial</li>}
                  </ul>
                  <button
                    className={`btn-upgrade ${isCurrent ? 'active-plan' : ''}`}
                    onClick={() => !isCurrent && setUpgradeOpen(true)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current plan' : (isFree ? 'Start free' : `Get ${p.name}`)}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Session history ───────────────────────────────────────── */}
          <div className="section-title">
            Session history
            <span className="pill">last 30 days</span>
          </div>
          <div className="session-log">
            <div className="session-row header">
              <div>Date</div><div>Duration</div><div>Launched from</div><div>Status</div>
            </div>
            {desktopStatus === 'running' && (
              <div className="session-row">
                <div>Today</div>
                <div>{timerText}</div>
                <div style={{ color: 'var(--muted2)' }}>Current browser</div>
                <div><span className="session-status active">active</span></div>
              </div>
            )}
            {SESSION_HISTORY.map((s, i) => (
              <div className="session-row" key={i}>
                <div>{s.date}</div>
                <div>{s.duration}</div>
                <div style={{ color: 'var(--muted2)' }}>{s.from}</div>
                <div><span className={`session-status ${s.status}`}>{s.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      <div className={`toast ${toastType} ${toastMsg ? 'show' : ''}`}>
        <div className="toast-dot"></div>
        <span>{toastMsg}</span>
      </div>

      {/* ── Upgrade modal ──────────────────────────────────────────────── */}
      <div className={`modal-overlay ${upgradeOpen ? 'show' : ''}`}>
        <div className="modal" style={{ maxWidth: '480px' }}>
          <button className="modal-close" onClick={() => setUpgradeOpen(false)}>×</button>
          <div className="modal-title">Upgrade your plan</div>
          <div className="modal-sub">
            Choose a plan below. You will be redirected to our billing portal powered by Paymenter.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {Object.entries(products).flatMap(([type, list]) =>
              list
                .filter(p => p.monthly_price_pence > 0)
                .map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '14px' }}>{p.name}</div>
                      <div style={{ color: 'var(--muted2)', fontSize: '12px' }}>
                        {p.cpu} vCPU · {p.memory} · {p.storage_gb} GB · {p.bandwidth_gb} GB BW
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '16px' }}>
                        £{(p.monthly_price_pence / 100).toFixed(0)}<span style={{ color: 'var(--muted2)', fontWeight: 400, fontSize: '12px' }}>/mo</span>
                      </div>
                      <button
                        onClick={() => { setUpgradeOpen(false); showToast('Redirecting to billing portal...', 'info'); }}
                        style={{ marginTop: '6px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '5px', padding: '5px 12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}