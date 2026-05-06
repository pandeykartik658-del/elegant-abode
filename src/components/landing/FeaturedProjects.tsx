import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SplitText } from "@/components/motion/SplitText";

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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dialLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const numberY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const i = Math.min(PROJECTS.length - 1, Math.floor(v * PROJECTS.length * 0.999));
      setActive(i);
    });
    return () => unsub();
  }, [scrollYProgress]);

  const p = PROJECTS[active];

  return (
    <section
      id="works"
      ref={ref}
      className="relative bg-ink text-paper"
      style={{ height: `${PROJECTS.length * 120}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* corner ticks */}
        {[
          "top-6 left-6 border-t border-l",
          "top-6 right-6 border-t border-r",
          "bottom-6 left-6 border-b border-l",
          "bottom-6 right-6 border-b border-r",
        ].map((cls, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-none absolute w-5 h-5 border-clay z-20 ${cls}`}
          />
        ))}
        {/* gigantic outline numeral, parallaxes */}
        <motion.div
          style={{ y: numberY }}
          className="absolute inset-x-0 top-[8%] flex justify-center pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={p.no}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 0.08, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
              className="font-display leading-none"
              style={{
                fontSize: "min(56vw, 720px)",
                WebkitTextStroke: "1px var(--paper)",
                color: "transparent",
                letterSpacing: "-0.05em",
              }}
            >
              {p.no}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* image stack with clip reveal */}
        <div className="absolute inset-0">
          {PROJECTS.map((proj, i) => (
            <motion.div
              key={proj.no}
              className="absolute inset-0"
              initial={false}
              animate={{
                clipPath:
                  i === active ? "inset(0% 0% 0% 0%)" : "inset(50% 0% 50% 0%)",
                opacity: i === active ? 1 : 0,
              }}
              transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
            >
              <motion.img
                src={proj.img}
                alt={proj.name}
                className="h-full w-full object-cover"
                animate={i === active ? { scale: [1, 1.1] } : { scale: 1 }}
                transition={i === active ? { duration: 9, ease: "linear" } : { duration: 0.6 }}
                style={{ filter: "grayscale(100%) contrast(1.1) brightness(0.7) sepia(0.15)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-ink/60" />
            </motion.div>
          ))}
        </div>

        {/* meta header */}
        <div className="absolute top-0 left-0 right-0 px-6 md:px-12 pt-28 flex items-center justify-between z-10">
          <div className="label-meta text-paper/60">02 — Selected Works</div>
          {/* circular dial */}
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="rgba(239,236,228,0.18)" strokeWidth="1" fill="none" />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--clay)"
                strokeWidth="1.5"
                fill="none"
                style={{ pathLength: dialLength }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center label-meta text-paper">
              {String(active + 1).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* content */}
        <div className="relative z-10 h-full flex items-end md:items-center px-6 md:px-12 pb-20">
          <div className="grid grid-cols-12 gap-8 w-full max-w-[1600px] mx-auto">
            <div className="col-span-12 md:col-start-7 md:col-span-6 lg:col-start-7 lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.no}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="label-meta text-clay mb-6">Project № {p.no}</div>
                  <h3 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.92] mb-8 tracking-[-0.04em]">
                    <SplitText text={p.name} by="char" stagger={0.025} duration={0.8} once={false} />
                  </h3>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-px bg-paper/40 mb-6 origin-left"
                  />
                  <div className="label-meta text-paper/70 mb-8">
                    {p.typology}&nbsp;&nbsp;·&nbsp;&nbsp;{p.city}&nbsp;&nbsp;·&nbsp;&nbsp;{p.year}
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    className="text-base font-light leading-relaxed text-paper/85 max-w-md mb-6"
                  >
                    {p.desc}
                  </motion.p>
                  <div className="label-meta text-paper/50">{p.stats}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* progress segments */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              className="w-px h-16 bg-paper/15 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-clay origin-top"
                animate={{ scaleY: i <= active ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
