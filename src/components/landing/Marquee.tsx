import { MarqueeScroll } from "@/components/motion/MarqueeScroll";

const ITEMS = [
  "TOKYO",
  "NEW YORK",
  "EST. 2009",
  "42 ARCHITECTS",
  "14 LIVE COMMISSIONS",
  "RIBA 2023",
  "MIES AMERICAS 2022",
  "MONOGRAPH 2025",
];

export function Marquee() {
  return (
    <section className="bg-paper text-ink hairline-t hairline-b py-6">
      <MarqueeScroll baseVelocity={1.4}>
        <span className="font-display text-3xl md:text-5xl tracking-[-0.03em] inline-flex items-center gap-10">
          {ITEMS.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-10">
              {t}
              <span className="inline-block w-2 h-2 rounded-full bg-clay" />
            </span>
          ))}
        </span>
      </MarqueeScroll>
    </section>
  );
}
