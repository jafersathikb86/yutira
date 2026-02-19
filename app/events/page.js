import Section from '@/components/Section';
import EventCard from '@/components/EventCard';
import { events } from '@/lib/data';

export const metadata = { title: 'Events | Yutira 2026' };

export default function EventsPage() {
  return (
    <Section title="Events" subtitle="General registration covers all events and paper presentation.">
      <div className="grid md:grid-cols-2 gap-4">
        {events.map(e => (
          <EventCard key={e.eventId} item={e} type="event" />
        ))}
      </div>
    </Section>
  );
}
