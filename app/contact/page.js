import Section from '@/components/Section';

export const metadata = { title: 'Contact | Yutira 2026' };

export default function ContactPage() {
  return (
    <Section title="Contact Us" subtitle="Reach us through Instagram or Email">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="font-semibold">Instagram</div>
          <div className="mt-2 text-sm text-white/80">
            <a className="link" href="https://www.instagram.com/cea_ici_psgtech/" target="_blank">
              https://www.instagram.com/cea_ici_psgtech/
            </a>
          </div>

          <div className="mt-5 font-semibold">Gmail</div>
          <div className="mt-2 text-sm text-white/80">cea.civil@psgtech.ac.in</div>
        </div>

        <div className="card p-6">
          <div className="font-semibold">Secretaries</div>
          <div className="mt-3 text-sm text-white/80 space-y-2">
            <div>
              <div className="text-white/90 font-semibold">Rahul G V</div>
              <div>93448 13153</div>
            </div>
            <div>
              <div className="text-white/90 font-semibold">Vinoth Kumar S</div>
              <div>80728 99952</div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="font-semibold">Developer</div>
            <div className="mt-2 text-sm text-white/80">
              <div className="text-white/90 font-semibold">Jafer Sathik B</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
