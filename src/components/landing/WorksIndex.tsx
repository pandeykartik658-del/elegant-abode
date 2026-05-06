import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef, useState } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";

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
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 30, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 280, damping: 30, mass: 0.5 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1500, 0, 1500], [-8, 0, 8], { clamp: true });

  return (
    <section
      id="index"
      ref={wrap}
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative bg-paper text-ink overflow-hidden grain"
    >
      <div className="px-6 md:px-12 py-32 md:py-48 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-20 hairline-b pb-6">
            <div>
              <div className="label-meta text-clay mb-4">03 — Index</div>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-[-0.04em]">
                <SplitText text="Selected works," by="char" stagger={0.02} duration={0.8} />
                <br />
                <span className="font-fraunces italic">
                  <SplitText text="2018 — 2024." by="char" stagger={0.02} delay={0.3} />
                </span>
              </h2>
            </div>
            <div className="label-meta text-ink/50 hidden md:block">{WORKS.length} projects</div>
          </div>
        </Reveal>

        <ul onMouseLeave={() => setHover(null)}>
          {WORKS.map((w, i) => (
            <motion.li
              key={w.no}
              onMouseEnter={() => setHover(i)}
              className="group relative grid grid-cols-12 gap-4 items-center py-7 hairline-b cursor-pointer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] } }}
              viewport={{ once: true, margin: "-5% 0px" }}
              animate={{
                opacity: hover === null ? 1 : hover === i ? 1 : 0.28,
                x: hover === null ? 0 : hover === i ? 0 : 12,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="absolute inset-0 -mx-6 md:-mx-12 bg-mist/60 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hover === i ? 1 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="relative col-span-2 md:col-span-1 label-meta text-ink/40 group-hover:text-clay transition-colors">
                {w.no}
              </div>
              <div className="relative col-span-10 md:col-span-5 font-display text-2xl md:text-5xl tracking-[-0.03em]">
                <Letters text={w.name} hovered={hover === i} />
              </div>
              <div className="relative hidden md:block col-span-3 label-meta text-ink/70">{w.city}</div>
              <div className="relative hidden md:block col-span-2 label-meta text-ink/70">{w.type}</div>
              <div className="relative hidden md:block col-span-1 label-meta text-ink/70 text-right">{w.year}</div>
              <motion.span
                className="relative col-span-1 hidden md:flex items-center justify-end text-clay"
                animate={{ x: hover === i ? 0 : -10, opacity: hover === i ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                →
              </motion.span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* floating preview card */}
      <motion.div
        style={{ x: sx, y: sy, rotate, translateX: "-50%", translateY: "-110%" }}
        className="pointer-events-none fixed md:absolute z-30 w-[260px] h-[340px] left-0 top-0 origin-center"
      >
        <AnimatePresence mode="wait">
          {hover !== null && (
            <motion.div
              key={WORKS[hover].no}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full overflow-hidden shadow-2xl"
            >
              <img
                src={WORKS[hover].img}
                alt={WORKS[hover].name}
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(70%) contrast(1.05) sepia(0.1)" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink/80 to-transparent">
                <div className="label-meta text-paper">{WORKS[hover].name}</div>
                <div className="label-meta text-paper/60 mt-1">{WORKS[hover].city} · {WORKS[hover].year}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Letters({ text, hovered }: { text: string; hovered: boolean }) {
  return (
    <span className="inline-block">
      {Array.from(text).map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={hovered ? { y: [-0, -6, 0] } : { y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
      <motion.span
        className="block h-px bg-clay origin-left mt-1"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
