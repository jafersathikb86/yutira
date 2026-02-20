'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';

export default function AdminPage() {
  const [me, setMe] = useState(null);

  // Overview + Papers
  const [overview, setOverview] = useState(null);
  const [papers, setPapers] = useState([]);
  const [paperStatus, setPaperStatus] = useState('');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');

  // NEW: quick filter state
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (res.ok && data.role === 'admin') {
        setMe(data);
        loadOverview();
        loadPapers();
      } else {
        window.location.href = '/login';
      }
    })();
  }, []);

  async function loadOverview() {
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (res.ok) setOverview(data);
    } catch {
      // ignore
    }
  }

  async function loadPapers() {
    setPaperStatus('Loading papers…');
    try {
      const res = await fetch('/api/admin/papers-list');
      const data = await res.json();
      if (res.ok) {
        setPapers(data.papers || []);
        setPaperStatus(`Loaded ${data.papers?.length || 0} submissions`);
      } else {
        setPaperStatus(data?.error || 'Failed to load papers');
      }
    } catch {
      setPaperStatus('Failed to load papers');
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  // NEW: run quick filter
  async function runFilter(filterKey) {
    setActiveFilter(filterKey);
    setStatus('Filtering…');

    const res = await fetch(
      `/api/admin/search?filter=${encodeURIComponent(filterKey)}&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (res.ok) {
      setResults(data.results || []);
      setStatus(`Found ${data.results?.length || 0}`);
    } else {
      setStatus(data?.error || 'Filter failed');
    }
  }

  // Modified: search respects active filter (if any)
  async function search() {
    setStatus(activeFilter ? 'Searching in filter…' : 'Searching…');

    const url = activeFilter
      ? `/api/admin/search?filter=${encodeURIComponent(activeFilter)}&q=${encodeURIComponent(query)}`
      : `/api/admin/search?q=${encodeURIComponent(query)}`;

    const res = await fetch(url);
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
    await loadOverview();
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
    await loadPapers();
    await loadOverview();
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
      subtitle="Search participants, verify payments, mark attendance. Paper decisions are managed in the Paper Submissions section."
    >
      {/* Overview counters */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="card p-4">
            <div className="text-xs text-white/70">Total Registrations</div>
            <div className="text-2xl font-semibold mt-1">{overview.totalUsers}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-white/70">General Paid</div>
            <div className="text-2xl font-semibold mt-1">{overview.generalPaid}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-white/70">Workshop Paid</div>
            <div className="text-2xl font-semibold mt-1">{overview.workshopPaid}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-white/70">Paper Submissions</div>
            <div className="text-2xl font-semibold mt-1">{overview.totalPapers}</div>
          </div>
        </div>
      )}

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

        {/* NEW: Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => runFilter('general_pending')}
            className={`px-3 py-1 rounded-lg text-xs border ${
              activeFilter === 'general_pending'
                ? 'bg-yellow-500/25 border-yellow-300/40'
                : 'bg-yellow-500/15 border-yellow-300/30 hover:bg-yellow-500/20'
            }`}
          >
            General Pending
          </button>

          <button
            onClick={() => runFilter('workshop_pending')}
            className={`px-3 py-1 rounded-lg text-xs border ${
              activeFilter === 'workshop_pending'
                ? 'bg-yellow-500/25 border-yellow-300/40'
                : 'bg-yellow-500/15 border-yellow-300/30 hover:bg-yellow-500/20'
            }`}
          >
            Workshop Pending
          </button>

          <button
            onClick={() => runFilter('day1_not_marked')}
            className={`px-3 py-1 rounded-lg text-xs border ${
              activeFilter === 'day1_not_marked'
                ? 'bg-red-500/25 border-red-400/40'
                : 'bg-red-500/15 border-red-400/30 hover:bg-red-500/20'
            }`}
          >
            Day 1 Not Marked
          </button>

          <button
            onClick={() => runFilter('day2_not_marked')}
            className={`px-3 py-1 rounded-lg text-xs border ${
              activeFilter === 'day2_not_marked'
                ? 'bg-red-500/25 border-red-400/40'
                : 'bg-red-500/15 border-red-400/30 hover:bg-red-500/20'
            }`}
          >
            Day 2 Not Marked
          </button>

          {/* Clear filter */}
          {activeFilter ? (
            <button
              onClick={() => {
                setActiveFilter('');
                setResults([]);
                setStatus('Filter cleared');
              }}
              className="px-3 py-1 rounded-lg text-xs border border-white/20 bg-white/5 hover:bg-white/10"
            >
              Clear Filter
            </button>
          ) : null}
        </div>

        {/* Search */}
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
        </div>

        <div className="mt-2 text-xs text-white/60">{status}</div>

        <div className="mt-6 space-y-4">
          {results.map((u) => (
            <div key={u._id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {u.name}{' '}
                    <span className="text-white/60 text-sm">({u.yutiraId})</span>
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

                {/* Paper info */}
                <div className="card p-4">
                  <div className="font-semibold">Paper</div>
                  <div className="mt-2 text-xs text-white/70">
                    Paper decisions are managed in the <b>Paper Submissions</b> section below.
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

      {/* Paper Submissions */}
      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Paper Submissions</div>
            <div className="text-xs text-white/60">{paperStatus}</div>
          </div>
          <button
            onClick={loadPapers}
            className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/70">
              <tr className="text-left">
                <th className="py-2 pr-4">Yutira ID</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">PDF</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="py-2 pr-4">{p.yutiraId}</td>
                  <td className="py-2 pr-4">{p.title}</td>
                  <td className="py-2 pr-4 capitalize">{p.status}</td>
                  <td className="py-2 pr-4">
                    {p.pdfUrl ? (
                      <a className="link" href={p.pdfUrl} target="_blank" rel="noreferrer">
                        View PDF
                      </a>
                    ) : (
                      <span className="text-white/50">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => decidePaper(p.yutiraId, 'accepted')}
                        className="px-2 py-1 rounded-lg bg-green-500/15 border border-green-400/30"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => decidePaper(p.yutiraId, 'rejected')}
                        className="px-2 py-1 rounded-lg bg-red-500/15 border border-red-400/30"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => decidePaper(p.yutiraId, 'submitted')}
                        className="px-2 py-1 rounded-lg bg-white/5 border border-white/15"
                      >
                        Reset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {papers.length === 0 ? (
                <tr>
                  <td className="py-3 text-white/60" colSpan={5}>
                    No paper submissions found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}