import { useRef, useState } from "react";

const WORKS = [
  { no: "014", name: "MERIDIAN TOWER", city: "Singapore", year: "2024", type: "Office", img: "https://images.unsplash.com/photo-1545153996-ec5f7b3b1c2c?w=900&q=80&auto=format&fit=crop" },
  { no: "013", name: "HALDEN EXCHANGE", city: "Oslo", year: "2024", type: "Civic", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80&auto=format&fit=crop" },
  { no: "012", name: "NORTH QUAY", city: "Rotterdam", year: "2023", type: "Masterplan", img: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=900&q=80&auto=format&fit=crop" },
  { no: "011", name: "KOJIMA OFFICES", city: "Tokyo", year: "2023", type: "Office", img: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=900&q=80&auto=format&fit=crop" },
  { no: "010", name: "ATLAS PAVILION", city: "Lisbon", year: "2022", type: "Cultural", img: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900&q=80&auto=format&fit=crop" },
  { no: "009", name: "VESTRE LINE", city: "Copenhagen", year: "2022", type: "Transit", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop" },
  { no: "008", name: "SAINT-PAUL HALL", city: "Lyon", year: "2021", type: "Civic", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=crop" },
  { no: "007", name: "HARBOUR ANNEX", city: "Hamburg", year: "2021", type: "Office", img: "https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=900&q=80&auto=format&fit=crop" },
  { no: "006", name: "OSAKA HOUSE", city: "Osaka", year: "2020", type: "Residential", img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&q=80&auto=format&fit=crop" },
  { no: "005", name: "BLACK CHAPEL", city: "Reykjavík", year: "2020", type: "Cultural", img: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=900&q=80&auto=format&fit=crop" },
  { no: "004", name: "GRID NINE", city: "Mexico City", year: "2019", type: "Masterplan", img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=900&q=80&auto=format&fit=crop" },
  { no: "003", name: "STILLWATER LIBRARY", city: "Minneapolis", year: "2018", type: "Civic", img: "https://images.unsplash.com/photo-1481253127861-534498168948?w=900&q=80&auto=format&fit=crop" },
];

export function WorksIndex() {
  const [hover, setHover] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <section
      id="index"
      ref={wrap}
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className="relative bg-bone text-ink overflow-hidden"
    >
      <div className="px-6 md:px-12 py-32 md:py-48 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-20 hairline-b pb-6">
          <div>
            <div className="label-meta text-ink/50 mb-4">03 — Index</div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">Selected works,<br/>2018 — 2024.</h2>
          </div>
          <div className="label-meta text-ink/50 hidden md:block">{WORKS.length} projects</div>
        </div>

        <ul>
          {WORKS.map((w, i) => (
            <li
              key={w.no}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              className="group relative grid grid-cols-12 gap-4 items-center py-6 hairline-b cursor-pointer transition-colors"
            >
              <div className="col-span-2 md:col-span-1 label-meta text-ink/40 group-hover:text-warm transition">{w.no}</div>
              <div className="col-span-10 md:col-span-5 font-display text-2xl md:text-4xl tracking-tight">
                <span className="relative inline-block">
                  {w.name}
                  <span className="absolute left-0 -bottom-1 h-px bg-ink w-0 group-hover:w-full transition-all duration-700 ease-out" />
                </span>
              </div>
              <div className="hidden md:block col-span-3 label-meta text-ink/70">{w.city}</div>
              <div className="hidden md:block col-span-2 label-meta text-ink/70">{w.type}</div>
              <div className="hidden md:block col-span-1 label-meta text-ink/70 text-right">{w.year}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* floating preview */}
      <div
        className="pointer-events-none absolute z-30 w-64 h-80 overflow-hidden transition-opacity duration-500"
        style={{
          left: pos.x + 24,
          top: pos.y - 160,
          opacity: hover !== null ? 1 : 0,
          transform: `translate3d(0,0,0)`,
        }}
      >
        {hover !== null && (
          <img
            src={WORKS[hover].img}
            alt={WORKS[hover].name}
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(100%) contrast(1.05)" }}
          />
        )}
      </div>
    </section>
  );
}
