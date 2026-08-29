const VALUES = [
  { title: "Small runs, on purpose", text: "Most artifacts release in quantities under 20. When it's gone, the listing stays as a record — we don't reprint." },
  { title: "Materials named, not marketed", text: "Every tag lists the mill and the region. If we wouldn't put a supplier's name on it, we don't use the material." },
  { title: "Repair over replace", text: "Every piece qualifies for a free repair for as long as we're open. Boro mending is visible, not hidden." },
  { title: "No seasons, no sales", text: "We release chapters when the work is ready, not on a retail calendar — and never discount to move inventory." },
];

export function ValuesList() {
  return (
    <dl className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
      {VALUES.map((v) => (
        <div key={v.title} className="border-t border-[var(--otaru-line)] pt-5">
          <dt className="font-display text-lg text-[var(--otaru-parchment)]">{v.title}</dt>
          <dd className="mt-2 leading-relaxed text-[var(--otaru-parchment-dim)]">{v.text}</dd>
        </div>
      ))}
    </dl>
  );
}
