import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  {
    no: "014",
    name: "MERIDIAN TOWER",
    typology: "Office",
    city: "Singapore",
    year: "2024",
    stats: "42 floors  ·  78,000 m²  ·  Hesse Capital",
    desc: "A vertical district carved by light. Triple-skin façade reduces solar load by 38% while opening every floor plate to the South China Sea.",
    img: "https://images.unsplash.com/photo-1545153996-ec5f7b3b1c2c?w=2400&q=80&auto=format&fit=crop",
  },
  {
    no: "013",
    name: "HALDEN EXCHANGE",
    typology: "Civic",
    city: "Oslo",
    year: "2024",
    stats: "21,400 m²  ·  Oslo Municipality",
    desc: "A new courthouse rendered as a single quiet stone — a public room held inside a colonnade of weathered oak.",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=80&auto=format&fit=crop",
  },
  {
    no: "012",
    name: "NORTH QUAY",
    typology: "Masterplan",
    city: "Rotterdam",
    year: "2023",
    stats: "62 ha  ·  Port of Rotterdam",
    desc: "A working harbour reimagined as a continuous civic ground. Twelve blocks, one promenade, a city that meets the water without raising its voice.",
    img: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=2400&q=80&auto=format&fit=crop",
  },
];

export function FeaturedProjects() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      setProgress(p);
      const i = Math.min(PROJECTS.length - 1, Math.floor(p * PROJECTS.length));
      setActive(i);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="works" ref={ref} className="relative bg-ink text-bone" style={{ height: `${PROJECTS.length * 110}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* image stack */}
        <div className="absolute inset-0">
          {PROJECTS.map((p, i) => (
            <div
              key={p.no}
              className="absolute inset-0 transition-opacity duration-1000 ease-out"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(100%) contrast(1.05) brightness(0.85)" }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-ink/70" />
        </div>

        {/* meta header */}
        <div className="absolute top-0 left-0 right-0 px-6 md:px-12 pt-28 flex items-center justify-between z-10">
          <div className="label-meta text-bone/60">02 — Selected Works</div>
          <div className="label-meta text-bone/60">
            {String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
          </div>
        </div>

        {/* content */}
        <div className="relative z-10 h-full flex items-end md:items-center px-6 md:px-12 pb-16">
          <div className="grid grid-cols-12 gap-8 w-full">
            <div className="col-span-12 md:col-start-7 md:col-span-6 lg:col-start-8 lg:col-span-5">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.no}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "translateY(0)" : "translateY(2.5rem)",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  <div className="label-meta text-warm mb-6">Project № {p.no}</div>
                  <h3 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">{p.name}</h3>
                  <div className="label-meta text-bone/70 mb-8">
                    {p.typology}&nbsp;&nbsp;·&nbsp;&nbsp;{p.city}&nbsp;&nbsp;·&nbsp;&nbsp;{p.year}
                  </div>
                  <div className="text-sm font-light leading-relaxed text-bone/80 max-w-md mb-6">
                    {p.desc}
                  </div>
                  <div className="label-meta text-bone/50">{p.stats}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 h-64 w-px bg-bone/15">
          <div
            className="absolute top-0 left-0 w-px bg-bone transition-[height] duration-300"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
