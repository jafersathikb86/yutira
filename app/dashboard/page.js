'use client';

import { useEffect, useMemo, useState } from 'react';
import Section from '@/components/Section';
import { externalParticipantNotice, fees, PAYMENT_LINK, psgEmailSuffix } from '@/lib/data';

export default function DashboardPage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [paper, setPaper] = useState(null);
  const [paperForm, setPaperForm] = useState({
    title: '',
    degree: 'B.E Civil Engineering',
    yearOfStudy: '1',
    otherAuthors: 'NA',
    pdfUrl: ''
  });
  const [paperStatus, setPaperStatus] = useState({ type: '', message: '' });

  const isPSG = useMemo(() => (me?.email || '').toLowerCase().endsWith(psgEmailSuffix), [me?.email]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Not logged in');
        setMe(data);

        const pres = await fetch('/api/papers/mine');
        const pdata = await pres.json();
        if (pres.ok) setPaper(pdata);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  async function submitPaper(e) {
    e.preventDefault();
    setPaperStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/papers/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paperForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Submission failed');
      setPaper(data);
      setPaperStatus({ type: 'success', message: 'Abstract submitted successfully.' });
    } catch (e) {
      setPaperStatus({ type: 'error', message: e.message });
    }
  }

  if (loading) {
    return (
      <Section title="Dashboard">
        <div className="card p-6">Loading…</div>
      </Section>
    );
  }

  if (err) {
    return (
      <Section title="Dashboard">
        <div className="card p-6">
          <div className="text-sm text-red-100">{err}</div>
          <div className="mt-3">
            <a className="link" href="/login">Go to login</a>
          </div>
        </div>
      </Section>
    );
  }

  const generalFee = isPSG ? fees.general_psg : fees.general_other;

  return (
    <Section title="Dashboard" subtitle="Your registration, payment, paper submission, and attendance.">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="text-xl font-semibold">Welcome, {me.name}</div>
                <div className="text-sm text-white/70">YUTIRA ID: <span className="text-white">{me.yutiraId}</span></div>
                <div className="text-sm text-white/70">Email: {me.email}</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80">
              {externalParticipantNotice}
            </div>
          </div>

          <div className="card p-6">
            <div className="font-semibold">Payments Status</div>
            <div className="mt-3 text-sm text-white/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-white/90 font-semibold">General Registration</div>
                  <div className="text-white/70">Fee: ₹{generalFee}</div>
                </div>
                <div className={`shrink-0 self-start sm:self-auto px-3 py-1 rounded-xl border ${me.general.paymentStatus === 'paid' ? 'border-green-400/30 bg-green-500/15 text-green-100' : 'border-yellow-300/30 bg-yellow-500/15 text-yellow-100'}`}>
                  {me.general.paymentStatus}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-white/90 font-semibold">Workshop</div>
                  <div className="text-white/70">Fee: ₹{fees.workshop}</div>
                </div>
                <div className={`shrink-0 self-start sm:self-auto px-3 py-1 rounded-xl border ${me.workshop.paymentStatus === 'paid' ? 'border-green-400/30 bg-green-500/15 text-green-100' : 'border-yellow-300/30 bg-yellow-500/15 text-yellow-100'}`}>
                  {me.workshop.paymentStatus}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-white/60">
              Payment link: <a className="link break-all" href={PAYMENT_LINK} target="_blank">{PAYMENT_LINK}</a>
            </div>
          </div>

          <div className="card p-6">
            <div className="font-semibold">Paper Presentation Abstract Submission</div>

            {paper ? (
              <div className="mt-3 text-sm text-white/80">
                <div><span className="text-white/90">Title:</span> {paper.title}</div>
                <div><span className="text-white/90">Status:</span> {paper.status}</div>
                {paper.remarks ? <div><span className="text-white/90">Remarks:</span> {paper.remarks}</div> : null}
                <div className="mt-2">
                  <a className="link" href={paper.pdfUrl} target="_blank">View uploaded PDF</a>
                </div>
              </div>
            ) : (
              <>
                {paperStatus.message ? (
                  <div
                    className={`mt-3 p-3 rounded-xl text-sm border ${
                      paperStatus.type === 'success'
                        ? 'bg-green-500/15 border-green-400/30 text-green-100'
                        : 'bg-red-500/15 border-red-400/30 text-red-100'
                    }`}
                  >
                    {paperStatus.message}
                  </div>
                ) : null}

                <form onSubmit={submitPaper} className="mt-3 grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm text-white/80">Title of the Paper</label>
                    <input
                      className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                      value={paperForm.title}
                      onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/80">Degree</label>
                    <select
                      className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                      value={paperForm.degree}
                      onChange={(e) => setPaperForm({ ...paperForm, degree: e.target.value })}
                    >
                      <option>B.E Civil Engineering</option>
                      <option>M.E Structural Engineering</option>
                      <option>M.E Infrastructural Engineering</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white/80">Year of Study</label>
                    <select
                      className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                      value={paperForm.yearOfStudy}
                      onChange={(e) => setPaperForm({ ...paperForm, yearOfStudy: e.target.value })}
                    >
                      {['1','2','3','4','PG'].map((y) => <option key={y}>{y}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-white/80">Details of other Authors</label>
                    <textarea
                      rows={3}
                      className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                      value={paperForm.otherAuthors}
                      onChange={(e) => setPaperForm({ ...paperForm, otherAuthors: e.target.value })}
                      required
                    />
                  </div>

                    <div className="card p-5">
                      <div className="font-semibold">Sample abstract</div>
                      <div className="mt-2 text-sm text-white/80">
                      <a className="link" href="/docs/Sample abstract.pdf" target="_blank">Open PDF</a>
                      </div>
                      </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-white/80">Abstract PDF URL</label>
                    <input
                      className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                      placeholder="Upload PDF in Google Drive and paste the share link"
                      value={paperForm.pdfUrl}
                      onChange={(e) => setPaperForm({ ...paperForm, pdfUrl: e.target.value })}
                      required
                    />
                    <div className="mt-1 text-xs text-white/60">
                      Note: Make sure the Google Drive File link is set to 'Anyone with the link can view'.
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <button className="w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold">
                      Submit Abstract
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <div className="font-semibold">Attendance</div>
            <div className="mt-3 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span>Day 1</span>
                <span className={me.attendance.day1 ? 'text-green-200' : 'text-white/60'}>{me.attendance.day1 ? 'Marked' : 'Not marked'}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Day 2</span>
                <span className={me.attendance.day2 ? 'text-green-200' : 'text-white/60'}>{me.attendance.day2 ? 'Marked' : 'Not marked'}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="font-semibold">Note</div>
            <div className="mt-2 text-sm text-white/80 leading-7">
              If you are paying, please fill the <span className="text-white">same name</span> and <span className="text-white">mobile number</span>
              that you used for registration.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
