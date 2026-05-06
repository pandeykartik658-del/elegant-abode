import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "@/components/motion/SplitText";

const MORPH_WORDS = ["tower.", "ground.", "light.", "silence."];

function useClock(tz: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz,
        hour12: false,
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000 * 15);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  // cursor parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.8 });
  const tx = useTransform(sx, (v) => v * 14);
  const ty = useTransform(sy, (v) => v * 10);
  const tx2 = useTransform(sx, (v) => v * -8);
  const ty2 = useTransform(sy, (v) => v * -6);

  // scroll dolly
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0]);
  const blueprintY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MORPH_WORDS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const tokyo = useClock("Asia/Tokyo");
  const ny = useClock("America/New_York");

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-[100svh] w-full overflow-hidden bg-paper text-ink grain"
    >
      {/* hairline frame */}
      <div className="pointer-events-none absolute inset-x-6 md:inset-x-12 top-24 bottom-10 border border-[var(--hairline)]" />

      {/* top rail */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 pt-6 flex items-center justify-between label-meta text-ink/70">
        <div className="flex items-center gap-6">
          <span>35.6762° N&nbsp;·&nbsp;139.6503° E</span>
          <span className="hidden md:inline text-ink/40">/</span>
          <span className="hidden md:inline">TYO {tokyo}</span>
          <span className="hidden md:inline text-ink/40">·</span>
          <span className="hidden md:inline">NYC {ny}</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full bg-clay"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>14 live commissions</span>
        </div>
      </div>

      {/* blueprint canvas — center stage */}
      <motion.div
        style={{ x: tx, y: ty, opacity: heroOpacity }}
        className="absolute inset-0 z-0 flex items-center justify-center"
      >
        <Blueprint progress={blueprintY} />
      </motion.div>

      {/* center title */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-[100svh] flex flex-col justify-center px-6 md:px-12"
      >
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div
            style={{ x: tx2, y: ty2 }}
            className="font-display text-[14vw] md:text-[10vw] leading-[0.92] tracking-[-0.05em]"
          >
            <div className="block">
              <SplitText text="An architecture of" by="char" stagger={0.025} duration={0.9} />
            </div>
            <div className="block h-[1.05em] relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={MORPH_WORDS[idx]}
                  initial={{ y: "60%", opacity: 0, filter: "blur(12px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-60%", opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-fraunces italic text-clay inline-block"
                  style={{ fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
                >
                  {MORPH_WORDS[idx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="mt-12 max-w-md text-base md:text-lg font-light leading-relaxed text-ink/70"
          >
            AXIS NOVA is an architecture &amp; urban practice working between
            Tokyo and New York. Quiet volumes for loud cities — since 2009.
          </motion.p>
        </div>
      </motion.div>

      {/* bottom meta */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 pb-8 flex items-end justify-between label-meta text-ink/60">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="flex items-center gap-3"
        >
          <span className="block w-6 h-px bg-ink/40" />
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.div>
        <div className="text-right">
          Est. 2009<br />
          <span className="text-ink/40">— Vol. XVII</span>
        </div>
      </div>
    </section>
  );
}

function Blueprint({ progress }: { progress: any }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.12 },
        opacity: { duration: 0.4, delay: 0.2 + i * 0.12 },
      },
    }),
  };
  const ink = "var(--ink)";

  return (
    <motion.svg
      style={{ y: progress }}
      viewBox="0 0 800 900"
      className="w-[120vw] md:w-[80vw] max-w-[1100px] h-auto opacity-[0.55]"
      fill="none"
      stroke={ink}
      strokeWidth="0.6"
    >
      {/* axis grid */}
      <motion.g variants={draw} initial="initial" animate="animate" custom={0} opacity={0.18}>
        {Array.from({ length: 17 }).map((_, i) => (
          <motion.line
            key={`v${i}`}
            x1={50 + i * 43.75}
            y1={50}
            x2={50 + i * 43.75}
            y2={850}
            variants={draw}
            custom={i * 0.05}
          />
        ))}
        {Array.from({ length: 19 }).map((_, i) => (
          <motion.line
            key={`h${i}`}
            x1={50}
            y1={50 + i * 44.4}
            x2={750}
            y2={50 + i * 44.4}
            variants={draw}
            custom={i * 0.05}
          />
        ))}
      </motion.g>

      {/* tower elevation — centered */}
      <motion.g strokeWidth="0.9">
        {/* base ground line */}
        <motion.line x1="80" y1="820" x2="720" y2="820" variants={draw} custom={1} />
        {/* tower outer */}
        <motion.rect x="320" y="160" width="160" height="660" variants={draw} custom={2} />
        {/* tower stepback top */}
        <motion.polyline points="320,160 340,140 460,140 480,160" variants={draw} custom={3} />
        {/* spire */}
        <motion.line x1="400" y1="140" x2="400" y2="60" variants={draw} custom={4} />
        <motion.circle cx="400" cy="56" r="3" variants={draw} custom={4.2} />

        {/* floor plates */}
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.line
            key={`f${i}`}
            x1="320"
            y1={180 + i * 29}
            x2="480"
            y2={180 + i * 29}
            variants={draw}
            custom={2 + i * 0.04}
            strokeWidth="0.4"
            opacity={0.55}
          />
        ))}

        {/* core */}
        <motion.rect x="385" y="160" width="30" height="660" variants={draw} custom={3.5} opacity={0.6} />

        {/* podium */}
        <motion.rect x="240" y="720" width="320" height="100" variants={draw} custom={4.5} />
        <motion.line x1="240" y1="760" x2="560" y2="760" variants={draw} custom={4.7} opacity={0.5} />

        {/* dimension lines left */}
        <motion.line x1="260" y1="160" x2="260" y2="820" variants={draw} custom={5} opacity={0.7} />
        <motion.line x1="252" y1="160" x2="268" y2="160" variants={draw} custom={5.1} />
        <motion.line x1="252" y1="820" x2="268" y2="820" variants={draw} custom={5.1} />

        {/* dimension lines right */}
        <motion.line x1="540" y1="60" x2="540" y2="820" variants={draw} custom={5.3} opacity={0.7} />
        <motion.line x1="532" y1="60" x2="548" y2="60" variants={draw} custom={5.4} />
        <motion.line x1="532" y1="820" x2="548" y2="820" variants={draw} custom={5.4} />

        {/* callouts */}
        <motion.line x1="480" y1="280" x2="640" y2="240" variants={draw} custom={6} />
        <motion.line x1="640" y1="240" x2="720" y2="240" variants={draw} custom={6.1} />
        <motion.circle cx="480" cy="280" r="2" fill={ink} variants={draw} custom={6.2} />

        <motion.line x1="320" y1="540" x2="160" y2="580" variants={draw} custom={6.4} />
        <motion.line x1="160" y1="580" x2="80" y2="580" variants={draw} custom={6.5} />
        <motion.circle cx="320" cy="540" r="2" fill={ink} variants={draw} custom={6.6} />
      </motion.g>

      {/* labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        fill={ink}
        stroke="none"
        style={{ fontFamily: "Inter, sans-serif", fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase" }}
      >
        <text x="725" y="243" opacity="0.8">Crown · 240m</text>
        <text x="78" y="575" opacity="0.8" textAnchor="end" transform="translate(160,0)">Sky lobby</text>
        <text x="252" y="155" opacity="0.6">A</text>
        <text x="252" y="835" opacity="0.6">A'</text>
        <text x="80" y="845" opacity="0.5">N° 014 — Meridian Tower / Elevation, North</text>
        <text x="720" y="845" textAnchor="end" opacity="0.5">Scale 1 : 400</text>
      </motion.g>
    </motion.svg>
  );
}
