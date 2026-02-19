import Section from '@/components/Section';
import { workshop, fees, PAYMENT_LINK } from '@/lib/data';

export const metadata = { title: 'Workshop | Yutira 2026' };

export default function WorkshopPage() {
  return (
    <Section title="Workshop" subtitle="Workshop registration fee is separate from general registration.">
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
              <div><span className="text-white/90">Date:</span> {workshop.date} {workshop.month}</div>
              <div><span className="text-white/90">Time:</span> {workshop.time}</div>
              <div><span className="text-white/90">Venue:</span> {workshop.hall}</div>
              <div className="mt-2"><span className="text-white/90">Fee:</span> ₹{fees.workshop}</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Presented by</div>
            <div className="mt-2 text-sm text-white/80">{workshop.presentedBy}</div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Contacts</div>
            <div className="mt-2 text-sm text-white/80">
              <div>{workshop.c1Name} — {workshop.c1Num}</div>
              <div>{workshop.c2Name} — {workshop.c2Num}</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
