import Link from 'next/link';

export default function EventCard({ item, type }) {
  const href =
    type === 'event'
      ? `/events/${item.eventId}`
      : type === 'workshop'
      ? `/workshop`
      : `/paper`;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-semibold break-words">
            {item.eventName || item.workName}
          </div>
          <div className="text-sm text-white/70">
            {item.one_line_desc || item.desc || ''}
          </div>
        </div>

        {item.category ? (
          <span className="shrink-0 text-xs px-2 py-1 rounded-lg bg-yellow-300/20 border border-yellow-200/30 text-yellow-200">
            {item.category}
          </span>
        ) : null}
      </div>

      <div className="text-sm text-white/70">
        <div>
          <span className="text-white/90">Date:</span> {item.date} {item.month || ''}
        </div>
        <div>
          <span className="text-white/90">Time:</span> {item.timing || item.time || ''}
        </div>
        <div>
          <span className="text-white/90">Venue:</span> {item.hall}
        </div>
      </div>

      <div className="mt-1">
        <Link
          href={href}
          className="text-sm px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 inline-flex"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
