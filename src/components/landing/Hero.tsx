import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MORPH_WORDS = ["tower.", "ground.", "light.", "silence."];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1545153996-ec5f7b3b1c2c?w=1600&q=85&auto=format&fit=crop", name: "Meridian Tower", city: "SGP", year: "2023", plate: "03" },
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85&auto=format&fit=crop", name: "Halden Exchange", city: "OSL", year: "2022", plate: "07" },
  { src: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1600&q=85&auto=format&fit=crop", name: "Kojima Offices", city: "TYO", year: "2024", plate: "11" },
];

const EASE_QUINT = [0.16, 1, 0.3, 1] as const;
const EASE_EXPO = [0.83, 0, 0.17, 1] as const;
const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function useClock(tz: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz, hour12: false }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

function useCountUp(target: number, start: boolean, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return v;
}

const stage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_QUINT } },
};
const drawX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: EASE_QUINT } },
};
const drawY: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 1.2, ease: EASE_QUINT } },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.9 });
  const photoX = useTransform(sx, (v) => v * 12);
  const photoY = useTransform(sy, (v) => v * 10);

  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const rsx = useSpring(rx, { stiffness: 350, damping: 28, mass: 0.4 });
  const rsy = useSpring(ry, { stiffness: 350, damping: 28, mass: 0.4 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoParY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const photoParScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const a = setInterval(() => setWordIdx((i) => (i + 1) % MORPH_WORDS.length), 3400);
    const b = setInterval(() => setPhotoIdx((i) => (i + 1) % PHOTOS.length), 8000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const tokyo = useClock("Asia/Tokyo");
  const ny = useClock("America/New_York");
  const counted = useCountUp(17, mounted, 900);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    const pr = photoRef.current?.getBoundingClientRect();
    if (pr) {
      const inside = e.clientX >= pr.left && e.clientX <= pr.right && e.clientY >= pr.top && e.clientY <= pr.bottom;
      if (inside) { rx.set(e.clientX - pr.left); ry.set(e.clientY - pr.top); }
      else { rx.set(-100); ry.set(-100); }
    }
  };

  const photo = PHOTOS[photoIdx];

  return (
    <motion.section
      ref={ref}
      onMouseMove={onMove}
      variants={stage}
      initial="hidden"
      animate="visible"
      className="relative min-h-[100svh] w-full overflow-hidden bg-paper text-ink grain"
    >
      {/* PLANE Z-3 — drafting grid */}
      <motion.div style={{ opacity: gridOpacity }} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="relative h-full w-full max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="absolute inset-0 grid grid-cols-8">
            {COLS.map((c, i) => (
              <div key={c} className="relative h-full">
                <motion.div
                  variants={drawY}
                  className="absolute top-0 bottom-0 left-0 w-px bg-ink/[0.06] origin-top"
                  style={{ transitionDelay: `${i * 60}ms` }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 0.35, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 + i * 0.05, ease: EASE_QUINT }}
                  className="absolute top-2 left-1.5 font-mono-meta text-[9px] text-ink/30"
                >
                  {c}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 0.35, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 + i * 0.05, ease: EASE_QUINT }}
                  className="absolute bottom-2 left-1.5 font-mono-meta text-[9px] text-ink/30"
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.div>
              </div>
            ))}
            <motion.div
              variants={drawY}
              className="absolute top-0 bottom-0 right-0 w-px bg-ink/[0.06] origin-top"
            />
          </div>
        </div>
      </motion.div>

      {/* PLANE Z-2 — atmospheric numeral */}
      <motion.div
        style={{ y: numeralY }}
        variants={fadeUp}
        className="pointer-events-none absolute -right-[6vw] top-[6vh] z-0 select-none"
        aria-hidden
      >
        <span
          className="font-fraunces italic block leading-none text-ink-04"
          style={{ fontSize: "clamp(280px, 58vw, 1100px)", fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
        >
          17
        </span>
      </motion.div>

      {/* asymmetric brackets */}
      <motion.div variants={drawY} className="pointer-events-none absolute top-20 left-6 md:left-12 z-10 origin-top">
        <div className="w-6 h-px bg-ink/30" />
        <div className="w-px h-6 bg-ink/30" />
      </motion.div>
      <motion.div variants={drawY} className="pointer-events-none absolute bottom-20 right-6 md:right-12 z-10 origin-bottom">
        <div className="w-px h-6 bg-ink/30 ml-auto" />
        <div className="w-6 h-px bg-ink/30 ml-auto" />
      </motion.div>

      {/* TOP RAIL */}
      <motion.div
        style={{ opacity: railOpacity }}
        className="absolute top-0 left-0 right-0 z-30 px-6 md:px-12 pt-6 flex items-center justify-between label-meta text-ink/70"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <span>TYO {tokyo || "—"}</span>
          <span className="text-ink/30 hidden sm:inline">·</span>
          <span className="hidden sm:inline">NYC {ny || "—"}</span>
        </motion.div>
        <motion.div variants={fadeUp} className="hidden md:flex items-center gap-3">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full bg-clay"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>14 live commissions</span>
        </motion.div>
        <motion.div variants={fadeUp}>SHEET 01 / 12</motion.div>
      </motion.div>

      {/* STAGE */}
      <motion.div
        style={{ y: headlineY }}
        className="relative z-20 min-h-[100svh] flex items-center px-6 md:px-12 pt-28 pb-28"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-12 w-full max-w-[1500px] mx-auto items-center">
          {/* LEFT — matted plate */}
          <motion.div
            variants={fadeUp}
            style={{ x: photoX, y: photoY }}
            className="relative col-span-12 md:col-span-5 md:col-start-1"
          >
            {/* SECT. label */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.2, ease: EASE_QUINT }}
              className="absolute -top-5 left-0 font-mono-meta text-[10px] text-ink/45"
            >
              SECT. A—A′
            </motion.div>

            <div className="mat-board">
              <motion.div
                ref={photoRef}
                style={{ y: photoParY, scale: photoParScale }}
                className="passe-partout relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-none shadow-plate"
              >
                <motion.div
                  initial={{ clipPath: "inset(50% 6% 50% 6%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 1.4, delay: 1.3, ease: EASE_EXPO }}
                  className="absolute inset-0 overflow-hidden bg-ink/90"
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={photo.src + "-top"}
                      initial={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 1.3, ease: EASE_EXPO }}
                      className="absolute inset-x-0 top-0 h-1/2 overflow-hidden z-10"
                    >
                      <motion.img
                        src={photo.src}
                        alt={photo.name}
                        animate={{ scale: [1.04, 1.10] }}
                        transition={{ duration: 16, ease: "linear" }}
                        className="absolute inset-x-0 top-0 w-full h-[200%] object-cover"
                        style={{ filter: "grayscale(38%) contrast(1.06) sepia(0.06) brightness(0.92)" }}
                      />
                    </motion.div>
                    <motion.div
                      key={photo.src + "-bot"}
                      initial={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 1.3, ease: EASE_EXPO }}
                      className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden z-10"
                    >
                      <motion.img
                        src={photo.src}
                        alt=""
                        aria-hidden
                        animate={{ scale: [1.04, 1.10] }}
                        transition={{ duration: 16, ease: "linear" }}
                        className="absolute inset-x-0 bottom-0 w-full h-[200%] object-cover"
                        style={{ filter: "grayscale(38%) contrast(1.06) sepia(0.06) brightness(0.92)", objectPosition: "bottom" }}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* paper tint */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-tr from-paper/15 via-transparent to-ink/10 mix-blend-multiply pointer-events-none" />

                  {/* SECTION LINE A—A′ */}
                  <div className="absolute inset-x-0 top-[38%] z-25 pointer-events-none" aria-hidden>
                    <div className="relative">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 1.55, ease: EASE_QUINT }}
                        className="h-px bg-clay/80 origin-left"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 2.4 }}
                        className="absolute -top-3 -left-1 font-mono-meta text-[9px] text-clay"
                      >A</motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 2.4 }}
                        className="absolute -top-3 -right-1 font-mono-meta text-[9px] text-clay"
                      >A′</motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* reticle */}
                <motion.div style={{ x: rsx, y: rsy }} className="pointer-events-none absolute top-0 left-0 z-30">
                  <div className="-translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-paper mix-blend-difference flex items-center justify-center">
                    <span className="block w-px h-px bg-clay" />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* PLATE caption beneath */}
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6, ease: EASE_QUINT }}
                className="mt-6 flex items-center justify-between font-mono-meta text-[10px] text-ink/55"
              >
                <span>PL. {photo.plate} / {photo.name.toUpperCase()}</span>
                <span>{photo.city} · {photo.year}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* RIGHT — typographic stack */}
          <div className="relative col-span-12 md:col-span-6 md:col-start-7 flex flex-col gap-8 md:gap-10">
            {/* Numeral anchor */}
            <div className="flex items-baseline justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: EASE_QUINT }}
                className="font-mono-meta text-[10px] text-ink/45"
              >
                N°&nbsp;&nbsp;{String(counted).padStart(2, "0")} / XXVI
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: EASE_QUINT }}
                className="font-mono-meta text-[10px] text-ink/45"
              >
                ELEV. NORTH
              </motion.div>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.85, ease: EASE_EXPO }}
              className="h-px bg-[var(--hairline-strong)] origin-left -mt-6"
            />

            <div className="font-fraunces leading-[0.95] tracking-[-0.025em]" style={{ fontVariationSettings: '"wght" 350, "opsz" 144, "SOFT" 30' }}>
              <Line delay={1.0}>
                <span className="block text-[9vw] md:text-[5.6vw] lg:text-[5vw] uppercase text-ink whitespace-nowrap">
                  Architecture
                </span>
              </Line>
              <Line delay={1.14}>
                <span
                  className="block text-[7vw] md:text-[3.8vw] lg:text-[3.4vw] italic text-ink/35 pl-[3ch] -mt-2"
                  style={{ fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
                >
                  of
                </span>
              </Line>

              {/* morph word */}
              <span className="block h-[0.95em] relative overflow-hidden text-[13vw] md:text-[7.6vw] lg:text-[6.8vw] -mt-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={MORPH_WORDS[wordIdx]}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.95, ease: EASE_EXPO }}
                    className="italic text-clay block"
                    style={{ fontVariationSettings: '"wght" 400, "opsz" 144, "SOFT" 100' }}
                  >
                    {MORPH_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2.25, ease: EASE_QUINT }}
              className="flex items-start gap-5 mt-2"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 2.25, ease: EASE_QUINT }}
                className="w-16 h-px bg-clay origin-left mt-3 shrink-0"
              />
              <div className="max-w-sm">
                <p className="font-fraunces italic text-base md:text-lg text-ink-warm leading-snug">
                  Quiet volumes for loud cities.
                </p>
                <p className="font-mono-meta text-[10px] text-ink/45 mt-2">
                  TYO · NYC · since MMIX
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* COMPASS ROSE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.4, ease: EASE_QUINT }}
        style={{ opacity: railOpacity }}
        className="absolute bottom-20 right-6 md:right-24 z-30 pointer-events-none"
        aria-hidden
      >
        <CompassRose />
      </motion.div>

      {/* BOTTOM RAIL */}
      <motion.div
        style={{ opacity: railOpacity }}
        className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-12 pb-6 flex items-end justify-between label-meta text-ink/55"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <span className="text-ink/30">+</span>
          <span>Selected Works · MMXVIII — MMXXIV</span>
        </motion.div>
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >↓</motion.span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE_QUINT }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function CompassRose() {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="text-ink/40"
    >
      <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
      {/* N E S W ticks */}
      <line x1="28" y1="2" x2="28" y2="10" stroke="currentColor" strokeWidth="0.75" />
      <line x1="28" y1="46" x2="28" y2="54" stroke="currentColor" strokeWidth="0.5" />
      <line x1="2" y1="28" x2="10" y2="28" stroke="currentColor" strokeWidth="0.5" />
      <line x1="46" y1="28" x2="54" y2="28" stroke="currentColor" strokeWidth="0.5" />
      {/* needle */}
      <path d="M28 8 L31 28 L28 26 L25 28 Z" fill="currentColor" opacity="0.7" />
      <path d="M28 48 L31 28 L28 30 L25 28 Z" fill="currentColor" opacity="0.25" />
      <text x="28" y="6" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="monospace" letterSpacing="0.1em">N</text>
    </motion.svg>
  );
}
