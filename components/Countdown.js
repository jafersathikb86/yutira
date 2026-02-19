'use client';

import { useEffect, useMemo, useState } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Countdown({ targetISO }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (diff === 0) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
          <span className="text-sm text-white/80">
            YUTIRA 2026 is Live!
          </span>
        </div>
      </div>
    );
  }

  const items = [
    { label: 'Days', value: String(days) },
    { label: 'Hours', value: pad(hours) },
    { label: 'Mins', value: pad(minutes) },
    { label: 'Secs', value: pad(seconds) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto px-2">
      {items.map((i) => (
        <div
          key={i.label}
          className="card h-[90px] sm:h-auto w-full flex flex-col items-center justify-center text-center"
        >
          <div className="text-2xl sm:text-3xl font-semibold leading-none">
            {i.value}
          </div>
          <div className="text-xs sm:text-sm text-white/70 mt-2 leading-none">
            {i.label}
          </div>
        </div>
      ))}
    </div>
  );
}
