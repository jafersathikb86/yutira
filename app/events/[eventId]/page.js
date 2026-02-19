import Section from '@/components/Section';
import { events } from '@/lib/data';

export default function EventDetailPage({ params }) {
  const event = events.find(e => e.eventId === params.eventId);

  if (!event) {
    return (
      <Section title="Event not found">
        <div className="card p-5">No event found for this ID.</div>
      </Section>
    );
  }

  return (
    <Section title={event.eventName} subtitle={event.one_line_desc}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="font-semibold mb-2">About</div>
            <div className="text-white/80 text-sm leading-7">{event.description}</div>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-3">Rounds</div>
            <div className="space-y-3 text-sm text-white/80 leading-7">
              <div>
                <div className="font-semibold text-white">{event.round_title_1}</div>
                <div>{event.round_desc_1}</div>
              </div>
              <div>
                <div className="font-semibold text-white">{event.round_title_2}</div>
                <div>{event.round_desc_2}</div>
              </div>
              {event.round_title_3 ? (
                <div>
                  <div className="font-semibold text-white">{event.round_title_3}</div>
                  <div>{event.round_desc_3}</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="card p-5">
            <div className="font-semibold mb-2">Rules</div>
            <pre className="whitespace-pre-wrap text-sm text-white/80 leading-7">{event.eventRules}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="font-semibold">Schedule</div>
            <div className="mt-2 text-sm text-white/80">
              <div><span className="text-white/90">Date:</span> {event.date} {event.month}</div>
              <div><span className="text-white/90">Time:</span> {event.timing}</div>
              <div><span className="text-white/90">Venue:</span> {event.hall}</div>
              <div><span className="text-white/90">Team size:</span> {event.teamSize}</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Contacts</div>
            <div className="mt-2 text-sm text-white/80">
              <div>{event.contact_name_1} — {event.contact_mobile_1}</div>
              <div>{event.contact_name_2} — {event.contact_mobile_2}</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="font-semibold">Prizes</div>
            <div className="mt-2 text-sm text-white/80">
              <div>Winner: ₹{event.prizes.winner}</div>
              <div>1st Runner-up: ₹{event.prizes.first_runner_up}</div>
              <div>2nd Runner-up: ₹{event.prizes.second_runner_up}</div>
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
