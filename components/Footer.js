import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/yutira-logo.jpeg" alt="Yutira 2026" width={125} height={100} className="rounded-xl" />
            <div>
              <div className="font-semibold">Yutira 2026</div>
              <div className="text-sm text-white/70">Department of Civil Engineering,<br/>
              PSG College of Technology</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-white/70">
            March 27 & March 28, 2026
          </div>
        </div>

        <div className="text-sm text-white/70">
          <div className="font-semibold text-white mb-2">Quick Links</div>
          <ul className="space-y-1">
            <li><a className="hover:text-white" href="/events">Events</a></li>
            <li><a className="hover:text-white" href="/workshop">Workshop</a></li>
            <li><a className="hover:text-white" href="/paper">Paper Presentation</a></li>
            <li><a className="hover:text-white" href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="text-sm text-white/70">
          <div className="font-semibold text-white mb-2">Secretaries</div>
          <div>Rahul G V</div>
          <div>93448 13153</div><br/>
          <div>Vinoth Kumar S</div>
          <div>80728 99952</div>          
        </div>
      </div>

      <div className="py-4 text-center text-xs text-white/50 border-t border-white/10">
        © {new Date().getFullYear()} Yutira 2026
      </div>
    </footer>
  );
}
