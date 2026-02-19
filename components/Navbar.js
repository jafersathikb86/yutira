'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/workshop', label: 'Workshop' },
  { href: '/paper', label: 'Paper' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image
            src="/yutira-logo.jpeg"
            alt="Yutira 2026"
            width={40}
            height={40}
            className="rounded-lg shrink-0"
            priority
          />
          <div className="leading-tight min-w-0">
            <div className="font-semibold truncate">Yutira 2026</div>
            <div className="text-xs text-white/70 truncate">Civil Engineering • PSG Tech</div>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="ml-auto hidden md:flex items-center gap-4">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm ${active ? 'text-white' : 'text-white/75 hover:text-white'} transition`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto md:ml-0 flex items-center gap-2">
          {/* Hamburger (mobile only) */}
          <button
            type="button"
            className="md:hidden px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-sm"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <Link href="/register" className="px-3 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90">
            Register
          </Link>
          <Link href="/login" className="px-3 py-2 rounded-xl border border-white/20 text-sm hover:bg-white/10">
            Login
          </Link>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-2">
            {links.map(l => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-2 rounded-xl text-sm ${
                    active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
