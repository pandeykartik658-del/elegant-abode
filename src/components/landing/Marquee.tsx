import { MarqueeScroll } from "@/components/motion/MarqueeScroll";

const ITEMS = [
  "TOKYO", "NEW YORK", "EST. 2009", "42 ARCHITECTS",
  "14 LIVE COMMISSIONS", "RIBA 2023", "MIES AMERICAS 2022", "MONOGRAPH 2025",
];

export function Marquee() {
  return (
    <section className="bg-paper text-ink hairline-t hairline-b py-2.5">
      <MarqueeScroll baseVelocity={0.8}>
        <span className="label-meta inline-flex items-center gap-6 text-ink/70">
          {ITEMS.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-6">
              <span>{t}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-clay" />
            </span>
          ))}
        </span>
      </MarqueeScroll>
    </section>
  );
}
