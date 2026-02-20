'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';

export default function AdminPage() {
  const [me, setMe] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (res.ok && data.role === 'admin') {
        setMe(data);
      } else {
        window.location.href = '/login';
      }
    })();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  async function search() {
    setStatus('Searching…');
    const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (res.ok) {
      setResults(data.results || []);
      setStatus(`Found ${data.results?.length || 0}`);
    } else {
      setStatus(data?.error || 'Search failed');
    }
  }

  async function setPayment(userId, kind, paid) {
    const res = await fetch('/api/admin/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, kind, paid })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || 'Failed');
      return;
    }
    await search();
  }

  async function setAttendance(userId, day, value) {
    const res = await fetch('/api/admin/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, day, value })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || 'Failed');
      return;
    }
    await search();
  }

  async function decidePaper(yutiraId, status) {
    const remarks = prompt('Remarks (optional):') || '';
    const res = await fetch('/api/admin/paper-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ yutiraId, status, remarks })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || 'Failed');
      return;
    }
    alert('Updated.');
  }

  if (!me) {
    return (
      <Section title="Admin">
        <div className="card p-6">Loading…</div>
      </Section>
    );
  }

  return (
    <Section
      title="Admin Dashboard"
      subtitle="Search participants, verify payments, mark attendance, manage paper decisions."
    >
      <div className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-white/70">Logged in as admin</div>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Search + Export */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input
            className="flex-1 px-3 py-3 rounded-xl bg-white/5 border border-white/15"
            placeholder="Search by YUTIRA ID / name / email / phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={search}
            className="px-4 py-3 rounded-2xl bg-white text-black font-semibold"
          >
            Search
          </button>

          {/* Existing CSV Export */}
          <a
            href="/api/admin/export"
            className="px-4 py-3 rounded-2xl border border-white/20 hover:bg-white/10 text-center"
            target="_blank"
          >
            Export CSV
          </a>

          {/* NEW Excel Export */}
          <a
            href="/api/admin/export-excel"
            className="px-4 py-3 rounded-2xl bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 text-center"
            target="_blank"
          >
            Download Excel
          </a>
        </div>

        <div className="mt-2 text-xs text-white/60">{status}</div>

        <div className="mt-6 space-y-4">
          {results.map((u) => (
            <div key={u._id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {u.name}{' '}
                    <span className="text-white/60 text-sm">
                      ({u.yutiraId})
                    </span>
                  </div>
                  <div className="text-sm text-white/70">
                    {u.email} • {u.phone}
                  </div>
                  <div className="text-sm text-white/70">{u.college}</div>
                  <div className="text-sm text-white/70">
                    {u.department} • Year {u.year}
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  Created: {new Date(u.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
                {/* Payment */}
                <div className="card p-4">
                  <div className="font-semibold">Payment</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>General</span>
                    <div className="flex gap-2">
                      <button onClick={() => setPayment(u._id, 'general', true)} className="px-2 py-1 rounded-lg bg-green-500/15 border border-green-400/30">Paid</button>
                      <button onClick={() => setPayment(u._id, 'general', false)} className="px-2 py-1 rounded-lg bg-yellow-500/15 border border-yellow-300/30">Pending</button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Workshop</span>
                    <div className="flex gap-2">
                      <button onClick={() => setPayment(u._id, 'workshop', true)} className="px-2 py-1 rounded-lg bg-green-500/15 border border-green-400/30">Paid</button>
                      <button onClick={() => setPayment(u._id, 'workshop', false)} className="px-2 py-1 rounded-lg bg-yellow-500/15 border border-yellow-300/30">Pending</button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-white/70">
                    Current: General {u.general.paymentStatus} • Workshop {u.workshop.paymentStatus}
                  </div>
                </div>

                {/* Attendance */}
                <div className="card p-4">
                  <div className="font-semibold">Attendance</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Day 1</span>
                    <div className="flex gap-2">
                      <button onClick={() => setAttendance(u._id, 'day1', true)} className="px-2 py-1 rounded-lg bg-green-500/15 border border-green-400/30">Mark</button>
                      <button onClick={() => setAttendance(u._id, 'day1', false)} className="px-2 py-1 rounded-lg bg-white/5 border border-white/15">Unmark</button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Day 2</span>
                    <div className="flex gap-2">
                      <button onClick={() => setAttendance(u._id, 'day2', true)} className="px-2 py-1 rounded-lg bg-green-500/15 border border-green-400/30">Mark</button>
                      <button onClick={() => setAttendance(u._id, 'day2', false)} className="px-2 py-1 rounded-lg bg-white/5 border border-white/15">Unmark</button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-white/70">
                    Current: Day1 {u.attendance.day1 ? 'Yes' : 'No'} • Day2 {u.attendance.day2 ? 'Yes' : 'No'}
                  </div>
                </div>

                {/* Paper */}
                <div className="card p-4">
                  <div className="font-semibold">Paper</div>
                  <div className="mt-2 text-xs text-white/70">
                    Decision works if submission exists.
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => decidePaper(u.yutiraId, 'accepted')} className="px-2 py-1 rounded-lg bg-green-500/15 border border-green-400/30">Accept</button>
                    <button onClick={() => decidePaper(u.yutiraId, 'rejected')} className="px-2 py-1 rounded-lg bg-red-500/15 border border-red-400/30">Reject</button>
                    <button onClick={() => decidePaper(u.yutiraId, 'submitted')} className="px-2 py-1 rounded-lg bg-white/5 border border-white/15">Reset</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 ? (
            <div className="text-sm text-white/60">No results.</div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}