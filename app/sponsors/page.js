import Image from 'next/image';
import Section from '@/components/Section';
import { titleSponsors } from '@/lib/data';

export const metadata = { title: 'Sponsors | Yutira 2026' };

export default function SponsorsPage() {
  return (
    <Section title="Title Sponsors" subtitle="We thank our sponsors for supporting Yutira 2026.">
      <div className="grid md:grid-cols-2 gap-4">
        {titleSponsors.map((s) => (
          <div key={s.name} className="card p-6 flex flex-col items-center justify-center gap-4">
            <Image
              src={s.logo}
              alt={s.name}
              width={520}
              height={280}
              className="w-full h-auto max-w-[520px] rounded-2xl border border-white/10"
            />
            <div className="text-sm text-white/80 text-center">{s.name}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
