export default function Section({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-2 text-white/70">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
