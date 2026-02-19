'use client';

import { useState } from 'react';
import Section from '@/components/Section';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section title="Login" subtitle="PSG students can login using their college mail. Others can login using registered email.">
      <div className="card p-6 max-w-xl">
        {status.message ? (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-400/30 text-sm text-red-100">
            {status.message}
          </div>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-white/80">Password</label>
            <input
              type="password"
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <div className="text-sm text-white/70">
            Forgot password? <a className="link" href="/forgot-password">Reset here</a>
          </div>
        </form>
      </div>
    </Section>
  );
}
