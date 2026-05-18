"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const doLogin = async () => {
    setError('');
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Login failed');
        return;
      }
      
      // Save token to localStorage for cross-origin auth
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      router.push('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

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
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
          </div>
          <button className="btn-primary" onClick={doLogin}>Sign in</button>
          {error && <div className="auth-error" style={{color: '#ff5f57', marginTop: '10px'}}>{error}</div>}
        </div>

        <div className="auth-footer">
          Don't have an account? <a href="/register">Start free trial</a>
        </div>
      </div>
    </div>
  );
}
