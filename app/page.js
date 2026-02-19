import Image from 'next/image';
import Countdown from '@/components/Countdown';
import Section from '@/components/Section';
import { EVENT_COUNTDOWN_TARGET_ISO } from '@/lib/data';

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-12">
        <div className="card p-6 md:p-10">
          <div className="text-center">
            <Countdown targetISO={EVENT_COUNTDOWN_TARGET_ISO} />
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
            <Image
              src="/yutira-logo-2.jpg"
              alt="Yutira 2026"
              width={460}
              height={260}
              className="rounded-3xl border border-white/15"
              priority
            />

            <div className="text-center md:text-left">
              <div className="text-sm text-white/70">March 27 &</div>
              <div className="text-sm text-white/70">March 28, 2026</div>
              <div className="mt-2 text-2xl md:text-4xl font-semibold tracking-wide">
                BRIDGING IDEAS ,
              </div>
              <div className="text-2xl md:text-4xl font-semibold tracking-wide">
                BUILDING REALITIES
              </div>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="/register" className="px-4 py-3 rounded-2xl bg-white text-black font-semibold">
                  Register Now
                </a>
                <a href="/events" className="px-4 py-3 rounded-2xl border border-white/20 hover:bg-white/10">
                  View Events
                </a>
              </div>
              <div className="mt-3 text-sm text-white/70">
                National level technical symposium by the Department of Civil Engineering, <br/>PSG College of Technology.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Quick Schedule" subtitle="Tentative plan (confirmed for 2026)">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="font-semibold">Day 1 (27.03.2026)</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>• Inauguration — 09:00 AM - 10:00 PM</li>
              <li>• Survey Smarts — 10:00 AM - 12:00 PM</li>
              <li>• Build Bound Challenge — 01:00 PM - 04:00 PM</li>
              <li>• Paper Presentation — 10:00 AM - 04:00 PM</li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="font-semibold">Day 2 (28.03.2026)</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>• Cipher Craft — 09:00 AM - 12:00 PM</li>
              <li>• Build Battle — 01:00 PM - 03:00 PM</li>
              <li>• Workshop — 09:00 AM - 01:00 PM</li>
              <li>• Felicitation — 03:00 PM - 04:00 PM</li>  
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
