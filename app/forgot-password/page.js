'use client';

import { useState } from 'react';
import Section from '@/components/Section';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setStatus({ type: 'success', message: 'If the email exists, a reset link has been sent.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section title="Forgot Password">
      <div className="card p-6 max-w-xl">
        {status.message ? (
          <div
            className={`mb-4 p-3 rounded-xl text-sm border ${
              status.type === 'success'
                ? 'bg-green-500/15 border-green-400/30 text-green-100'
                : 'bg-red-500/15 border-red-400/30 text-red-100'
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Registered email</label>
            <input
              type="email"
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </Section>
  );
}
