import Section from '@/components/Section';
import { paperPresentation } from '@/lib/data';

export const metadata = { title: 'Paper Presentation | Yutira 2026' };

export default function PaperPage() {
  return (
    <Section title="Paper Presentation" subtitle="Submit your abstract PDF and track the status in your dashboard.">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="font-semibold mb-2">Topics</div>
            <pre className="whitespace-pre-wrap text-sm text-white/80 leading-7">{paperPresentation.topic}</pre>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-2">Rules</div>
            <pre className="whitespace-pre-wrap text-sm text-white/80 leading-7">{paperPresentation.rules}</pre>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-2">Submission</div>
            <div className="text-sm text-white/80 leading-7">
              Submit your abstract as a PDF from your <a className="link" href="/dashboard">dashboard</a>.
              <div className="mt-2">Deadline: <span className="text-white">22.03.2026</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="font-semibold">Schedule</div>
            <div className="mt-2 text-sm text-white/80">
              <div><span className="text-white/90">Date:</span> {paperPresentation.date} {paperPresentation.month}</div>
              <div><span className="text-white/90">Time:</span> {paperPresentation.time}</div>
              <div><span className="text-white/90">Venue:</span> {paperPresentation.hall}</div>
              <div><span className="text-white/90">Team size:</span> {paperPresentation.teamSize}</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Contacts</div>
            <div className="mt-2 text-sm text-white/80">
              <div>{paperPresentation.contact1[0]} — {paperPresentation.contact1[1]}</div>
              <div>{paperPresentation.contact2[0]} — {paperPresentation.contact2[1]}</div>
              <div className="mt-2">Email: {paperPresentation.eventMail}</div>
            </div>
          </div>

          <a href="/register" className="block text-center px-4 py-3 rounded-2xl bg-white text-black font-semibold">
            Register
          </a>
        </div>
      </div>
    </Section>
  );
}
