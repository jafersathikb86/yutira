import Link from 'next/link';
import Section from '@/components/Section';
import { workshop, fees, PAYMENT_LINK } from '@/lib/data';

export const metadata = { title: 'Workshop | Yutira 2026' };

export default function WorkshopPage() {
  return (
    <Section
      title="Workshop"
      subtitle="Workshop registration fee is separate from general registration."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="text-xl font-semibold">{workshop.workName}</div>
            <div className="mt-2 text-sm text-white/80 leading-7">{workshop.desc}</div>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-2">Sessions</div>
            <ul className="space-y-2 text-sm text-white/80">
              {workshop.sessions.map((s) => (
                <li key={s.title} className="flex justify-between gap-3">
                  <span>• {s.title}</span>
                  <span className="text-white/60">{s.duration}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-2">Learning outcome</div>
            <div className="text-sm text-white/80 leading-7">{workshop.learningOutcome}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="font-semibold">Schedule</div>
            <div className="mt-2 text-sm text-white/80">
              <div>
                <span className="text-white/90">Date:</span> {workshop.date} {workshop.month}
              </div>
              <div>
                <span className="text-white/90">Time:</span> {workshop.time}
              </div>
              <div>
                <span className="text-white/90">Venue:</span> {workshop.hall}
              </div>
              <div className="mt-2">
                <span className="text-white/90">Fee:</span> ₹{fees.workshop}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Link
                href="/register"
                className="w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold text-center hover:bg-white/90"
              >
                Register for Workshop
              </Link>
              <Link
                href="/login"
                className="w-full px-4 py-3 rounded-2xl border border-white/20 text-center hover:bg-white/10"
              >
                Already registered? Login
              </Link>
              <a
                href={PAYMENT_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full px-4 py-3 rounded-2xl border border-white/20 text-center hover:bg-white/10"
              >
                Open Payment Link
              </a>
              <div className="text-xs text-white/60">
                Note: If you select Workshop during registration, payment must be done separately.
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Presented by</div>
            <div className="mt-2 text-sm text-white/80">{workshop.presentedBy}</div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Contacts</div>
            <div className="mt-2 text-sm text-white/80">
              <div>
                {workshop.c1Name} — {workshop.c1Num}
              </div>
              <div>
                {workshop.c2Name} — {workshop.c2Num}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}