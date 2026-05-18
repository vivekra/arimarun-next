"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONFIG } from '@/lib/config';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('');

  useEffect(() => {
    setPlan(searchParams.get('plan') || '');
  }, [searchParams]);

  const doRegister = async () => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, full_name: name })
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Registration failed');
        setIsLoading(false);
        return;
      }
      
      // Auto login after registration
      const loginRes = await fetch(`${CONFIG.API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (loginRes.ok) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
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
        <div className="auth-title">Create your workspace</div>
        <div className="auth-sub">
          {plan ? `Starting with the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.` : 'Start deploying in seconds.'}
        </div>

        <div id="login-form">
          <div className="field">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && doRegister()} />
          </div>
          <button 
            className="btn-primary" 
            onClick={doRegister}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>
          {error && <div className="auth-error" style={{color: '#ff5f57', marginTop: '10px'}}>{error}</div>}
        </div>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{padding: '50px', color: '#fff', textAlign: 'center'}}>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
