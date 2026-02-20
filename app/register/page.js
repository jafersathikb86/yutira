'use client';

import { useMemo, useState } from 'react';
import Section from '@/components/Section';
import colleges from '@/lib/colleges';
import departments from '@/lib/departments';
import years from '@/lib/years';
import { fees, psgEmailSuffix, REGISTRATION_CLOSE_ISO } from '@/lib/data';

function isClosed() {
  return Date.now() > new Date(REGISTRATION_CLOSE_ISO).getTime();
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    otherCollege: '',
    department: '',
    year: '',
    password: '',
    general: true,
    workshop: false
  });

  // NEW: toggle for manual college entry (moves "not listed" outside)
  const [useOtherCollege, setUseOtherCollege] = useState(false);

  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const isPSG = useMemo(
    () => form.email.toLowerCase().endsWith(psgEmailSuffix),
    [form.email]
  );

  const feePreview = useMemo(() => {
    let total = 0;
    if (form.general) total += isPSG ? fees.general_psg : fees.general_other;
    if (form.workshop) total += fees.workshop;
    return total;
  }, [form.general, form.workshop, isPSG]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (isClosed()) {
      setStatus({ type: 'error', message: 'Registrations are closed (after 26 March 2026).' });
      return;
    }

    // NEW: ensure college is correctly picked from either field
    const finalCollege = (useOtherCollege ? form.otherCollege : form.college).trim();
    if (!finalCollege) {
      setStatus({ type: 'error', message: 'Please enter your college/university.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        college: finalCollege
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Registration failed');

      setStatus({
        type: 'success',
        message:
          'Registration initiated! Please check your email for verification link to complete registration.'
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section
      title="Register for Yutira 2026"
      subtitle={`Event registration last date: 26 March 2026. General registration covers all events + paper presentation. Workshop is separate.`}
    >
      <div className="card p-6">
        {isClosed() ? (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-400/30 text-sm text-red-100">
            Registrations are closed.
          </div>
        ) : null}

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

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/80">
              Name <span className="text-red-300">*</span> (as per your college ID)
            </label>
            <input
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/80">
              Email <span className="text-red-300">*</span>
            </label>
            <input
              type="email"
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            {isPSG ? (
              <div className="mt-1 text-xs text-green-200">
                PSG email detected — PSG general fee will apply.
              </div>
            ) : (
              <div className="mt-1 text-xs text-white/60">
                External participants can use any email.
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-white/80">
              Phone number <span className="text-red-300">*</span>
            </label>
            <input
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          {/* ✅ UPDATED: Searchable college + "not listed" outside */}
          <div>
            <label className="text-sm text-white/80">
              College/University <span className="text-red-300">*</span>
            </label>

            {!useOtherCollege ? (
              <>
                <input
                  className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                  placeholder="Type to search your college…"
                  list="college-list"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  required
                />
                <datalist id="college-list">
                  {colleges.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </>
            ) : (
              <input
                className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
                placeholder="Enter your college name"
                value={form.otherCollege}
                onChange={(e) => setForm({ ...form, otherCollege: e.target.value })}
                required
              />
            )}

            <label className="mt-2 flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={useOtherCollege}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUseOtherCollege(checked);
                  if (checked) setForm((prev) => ({ ...prev, college: '' }));
                  else setForm((prev) => ({ ...prev, otherCollege: '' }));
                }}
              />
              My college is not listed above (enter manually)
            </label>
          </div>

          <div>
            <label className="text-sm text-white/80">
              Branch <span className="text-red-300">*</span>
            </label>
            <select
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="" disabled>
                Select…
              </option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/80">
              Year <span className="text-red-300">*</span>
            </label>
            <select
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a year
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/80">
              Password <span className="text-red-300">*</span>
            </label>
            <input
              type="password"
              className="mt-2 w-full px-3 py-3 rounded-xl bg-white/5 border border-white/15"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="md:col-span-2">
            <div className="card p-4">
              <div className="font-semibold">Choose registration</div>
              <div className="mt-3 flex flex-col md:flex-row md:items-center gap-4 text-sm text-white/80">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.general}
                    onChange={(e) => setForm({ ...form, general: e.target.checked })}
                  />
                  General Registration (Events + Paper Presentation)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.workshop}
                    onChange={(e) => setForm({ ...form, workshop: e.target.checked })}
                  />
                  Workshop
                </label>
              </div>
              <div className="mt-2 text-xs text-white/60">
                Note: If you select both, payment must be done separately (as per instructions).
              </div>
              <div className="mt-3 text-sm">
                Fee preview: <span className="font-semibold">₹{feePreview}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              disabled={submitting || isClosed()}
              className="w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold disabled:opacity-60"
              type="submit"
            >
              {submitting ? 'Submitting…' : 'Register'}
            </button>
            <div className="mt-2 text-xs text-white/60">
              After email verification, you will receive your YUTIRA ID and payment link in email.
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}