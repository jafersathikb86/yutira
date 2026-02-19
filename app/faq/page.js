import Section from '@/components/Section';

export const metadata = { title: 'FAQ | Yutira 2026' };

const faqs = [
  {
    q: 'What is Yutira ?',
    a: 'Yutira 2026 is a National level Technical Symposium conducted by the Department of Civil Engineering, PSG College of Technology. It encompasses 4 events, a workshop and a paper presentation.'
  },
  {
    q: 'Who can participate in Yutira?',
    a: 'The contest is open for all Undergraduate and Postgraduate students from AICTE approved Technical Higher Educational Institutions of India.'
  },
  {
    q: 'What is the fee to participate in Yutira?',
    a: 'The general registration fee is Rs. 100 for PSG Tech students and Rs. 150 for students from other colleges. No separate registration fee is required to participate in each event and paper presentations. However, participants have to pay separately to participate in workshops.'
  },
  {
    q: 'Do we have to pay separately for attending workshops?',
    a: 'Yes, we have to pay separately for each workshop. The general registration fee doesn\'t cover workshop participation.'
  },
  {
    q: 'Will registration fees be refunded?',
    a: 'No, we follow a non refund policy at any cost *'
  }
];

export default function FAQPage() {
  return (
    <Section title="Frequently Asked Questions">
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="card p-6">
            <div className="font-semibold">{f.q}</div>
            <div className="mt-2 text-sm text-white/80 leading-7">{f.a}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
