
"use client";

import { useState, useEffect } from 'react';

const DEMO_USERS = {
  'demo@arimarun.io': { password: 'demo1234', plan: 'pro', name: 'Demo User' },
  'basic@arimarun.io': { password: 'basic123', plan: 'basic', name: 'Basic User' },
};

const SESSION_HISTORY = [
  { date: 'May 13, 2026', duration: '2h 14m', from: 'Chrome / macOS', status: 'completed' },
  { date: 'May 11, 2026', duration: '45m', from: 'Firefox / Linux', status: 'completed' },
  { date: 'May 10, 2026', duration: '3h 02m', from: 'Chrome / macOS', status: 'completed' },
  { date: 'May 7, 2026', duration: '1h 18m', from: 'Edge / Windows', status: 'completed' },
  { date: 'May 4, 2026', duration: '58m', from: 'Chrome / macOS', status: 'completed' },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('demo@arimarun.io');
  const [loginPassword, setLoginPassword] = useState('demo1234');
  const [authError, setAuthError] = useState('');
  
  const [desktopStatus, setDesktopStatus] = useState('stopped');
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Starting container...');
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSub, setModalSub] = useState('');
  
  const [activeSessionSecs, setActiveSessionSecs] = useState(0);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const doLogin = () => {
    const u = DEMO_USERS[loginEmail];
    if (!u || u.password !== loginPassword) {
      setAuthError('Invalid email or password.');
      return;
    }
    setUser({ email: loginEmail, ...u });
    setAuthError('');
  };

  const doLogout = () => {
    if (desktopStatus === 'running') stopDesktop();
    setUser(null);
  };

  const launchDesktop = () => {
    if (desktopStatus !== 'stopped') return;
    setDesktopStatus('starting');
    
    const steps = [
      { pct: 15, label: 'Allocating container...' },
      { pct: 35, label: 'Pulling image layers...' },
      { pct: 55, label: 'Starting KasmVNC...' },
      { pct: 75, label: 'Mounting profile volume...' },
      { pct: 90, label: 'Starting Xfce desktop...' },
      { pct: 100, label: 'Ready!' },
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval);
        setDesktopStatus('running');
        showToast('Desktop is ready! Click "Open Desktop" to connect.', 'success');
        return;
      }
      setProgressPct(steps[step].pct);
      setProgressLabel(steps[step].label);
      step++;
    }, 700);
  };

  const stopDesktop = () => {
    if (desktopStatus !== 'running') return;
    setDesktopStatus('stopped');
    showToast('Desktop stopped. Your files are saved.', 'success');
    setActiveSessionSecs(0);
  };

  const selectPlan = (plan) => {
    if (user?.plan === plan) return;
    if (plan === 'pro') {
      setModalTitle('Upgrade to Pro');
      setModalSub('Get unlimited hours, 2 GB RAM, and priority support for $19/mo.');
    } else {
      setModalTitle('Switch to Basic');
      setModalSub('Downgrade to Basic plan at $9/mo. Takes effect next billing cycle.');
    }
    setModalOpen(true);
  };

  useEffect(() => {
    let int;
    if (desktopStatus === 'running') {
      int = setInterval(() => setActiveSessionSecs(s => s + 1), 1000);
    }
    return () => clearInterval(int);
  }, [desktopStatus]);

  if (!user) {
    return (
      <div id="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="auth-logo-text">Arima<span>Run</span></div>
          </div>
          <div className="auth-title">Sign in to your workspace</div>
          <div className="auth-sub">Access your cloud desktop from any browser, anywhere.</div>

          <div id="login-form">
            <div className="field">
              <label>Email address</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <button className="btn-primary" onClick={doLogin}>Sign in</button>
            <div className="auth-error">{authError}</div>
          </div>

          <div className="auth-footer">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); showToast('Signup coming soon!', 'success'); }}>Start free trial</a>
          </div>
        </div>
      </div>
    );
  }

  const m = Math.floor(activeSessionSecs / 60);
  const s = activeSessionSecs % 60;
  const timerText = m > 0 ? `${m}m ${s}s` : `${s}s`;
  
  const greet = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <div id="dashboard" style={{ display: 'block' }}>
        <nav className="nav">
          <div className="nav-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <circle cx="12" cy="10" r="3"/>
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

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Plan</div>
              <div className="stat-value green">{user.plan === 'pro' ? 'Pro' : 'Basic'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Sessions this month</div>
              <div className="stat-value blue">7</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Hours used</div>
              <div className="stat-value muted">12.4h</div>
            </div>
          </div>

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

            <div className="specs-row">
              <div className="spec-item">
                <div className="spec-key">CPU</div>
                <div className="spec-val">{user.plan === 'pro' ? '2 vCPU' : '1 vCPU'}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">RAM</div>
                <div className="spec-val">{user.plan === 'pro' ? '2 GB' : '1 GB'}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Storage</div>
                <div className="spec-val">{user.plan === 'pro' ? '10 GB' : '5 GB'}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Region</div>
                <div className="spec-val">EU-West</div>
              </div>
            </div>

            {desktopStatus === 'stopped' && (
              <div className="action-row">
                <button className="btn-launch" onClick={launchDesktop}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Launch Desktop
                </button>
              </div>
            )}
            
            {desktopStatus === 'starting' && (
              <div className="startup-progress" style={{ display: 'block' }}>
                <div className="progress-label">
                  <span>{progressLabel}</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            )}
            
            {desktopStatus === 'running' && (
              <div className="action-row">
                <a className="btn-open" href="#" onClick={(e) => { e.preventDefault(); showToast('In production this opens your desktop at your-id.yourdomain.com', 'success'); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                  Open Desktop
                </a>
                <button className="btn-stop" onClick={stopDesktop}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                  Stop
                </button>
              </div>
            )}
          </div>

          <div className="section-title">Subscription</div>
          <div className="plan-grid">
            <div className={`plan-card ${user.plan === 'basic' ? 'current' : ''}`}>
              <div className="plan-name">Basic {user.plan === 'basic' && <span className="current-badge">Current plan</span>}</div>
              <div className="plan-price">$9<span>/month</span></div>
              <ul className="plan-features">
                <li>1 vCPU · 1 GB RAM</li>
                <li>5 GB persistent storage</li>
                <li>Ubuntu Xfce desktop</li>
                <li>Browser access</li>
                <li>Up to 40h/month</li>
              </ul>
              <button className={`btn-upgrade ${user.plan === 'basic' ? 'active-plan' : ''}`} onClick={() => selectPlan('basic')}>
                {user.plan === 'basic' ? 'Current plan' : 'Select Basic'}
              </button>
            </div>
            
            <div className={`plan-card ${user.plan === 'pro' ? 'current' : ''}`}>
              <div className="plan-name">Pro {user.plan === 'pro' && <span className="current-badge">Current plan</span>}</div>
              <div className="plan-price">$19<span>/month</span></div>
              <ul className="plan-features">
                <li>2 vCPU · 2 GB RAM</li>
                <li>10 GB persistent storage</li>
                <li>Ubuntu Xfce desktop</li>
                <li>Browser access</li>
                <li>Unlimited hours</li>
                <li>Priority support</li>
              </ul>
              <button className={`btn-upgrade ${user.plan === 'pro' ? 'active-plan' : ''}`} onClick={() => selectPlan('pro')}>
                {user.plan === 'pro' ? 'Current plan' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>

          <div className="section-title">
            Session history
            <span className="pill">last 30 days</span>
          </div>
          <div className="session-log">
            <div className="session-row header">
              <div>Date</div>
              <div>Duration</div>
              <div>Launched from</div>
              <div>Status</div>
            </div>
            
            {desktopStatus === 'running' && (
              <div className="session-row">
                <div>Today</div>
                <div>{timerText}</div>
                <div style={{color:'var(--muted2)'}}>Current browser</div>
                <div><span className="session-status active">active</span></div>
              </div>
            )}
            
            {SESSION_HISTORY.map((s, i) => (
              <div className="session-row" key={i}>
                <div>{s.date}</div>
                <div>{s.duration}</div>
                <div style={{color:'var(--muted2)'}}>{s.from}</div>
                <div><span className={`session-status ${s.status}`}>{s.status}</span></div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className={`toast ${toastType} ${toastMsg ? 'show' : ''}`}>
        <div className="toast-dot"></div>
        <span>{toastMsg}</span>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'show' : ''}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
          <div className="modal-title">{modalTitle}</div>
          <div className="modal-sub">{modalSub}</div>
          <div className="field">
            <label>Card number</label>
            <input type="text" placeholder="4242 4242 4242 4242" maxLength="19" />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div className="field">
              <label>Expiry</label>
              <input type="text" placeholder="MM / YY" maxLength="7" />
            </div>
            <div className="field">
              <label>CVC</label>
              <input type="text" placeholder="123" maxLength="3" />
            </div>
          </div>
          <button className="btn-modal-action" onClick={() => { setModalOpen(false); showToast('Plan updated! Stripe integration handles billing in production.', 'success'); }}>
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
}
  