import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MORPH_WORDS = ["tower.", "ground.", "light.", "silence."];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1545153996-ec5f7b3b1c2c?w=1600&q=85&auto=format&fit=crop", name: "Meridian Tower", city: "SGP", year: "2023" },
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85&auto=format&fit=crop", name: "Halden Exchange", city: "OSL", year: "2022" },
  { src: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1600&q=85&auto=format&fit=crop", name: "Kojima Offices", city: "TYO", year: "2024" },
];

const EASE_QUINT = [0.16, 1, 0.3, 1] as const;
const EASE_EXPO = [0.83, 0, 0.17, 1] as const;

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

// orchestration
const stage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_QUINT } },
};
const drawY: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 1.4, ease: EASE_QUINT } },
};
const drawX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: EASE_QUINT } },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.9 });
  const photoX = useTransform(sx, (v) => v * 14);
  const photoY = useTransform(sy, (v) => v * 12);

  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const rsx = useSpring(rx, { stiffness: 350, damping: 28, mass: 0.4 });
  const rsy = useSpring(ry, { stiffness: 350, damping: 28, mass: 0.4 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoParY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const photoParScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.4, 0]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const a = setInterval(() => setWordIdx((i) => (i + 1) % MORPH_WORDS.length), 3400);
    const b = setInterval(() => setPhotoIdx((i) => (i + 1) % PHOTOS.length), 8000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const tokyo = useClock("Asia/Tokyo");
  const ny = useClock("America/New_York");

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

      {/* PLANE Z-2 — asymmetric brackets */}
      <motion.div variants={drawY} className="pointer-events-none absolute top-20 left-6 md:left-12 z-10 origin-top">
        <div className="w-6 h-px bg-ink/30" />
        <div className="w-px h-6 bg-ink/30" />
      </motion.div>
      <motion.div variants={drawY} className="pointer-events-none absolute bottom-16 right-6 md:right-12 z-10 origin-bottom">
        <div className="w-px h-6 bg-ink/30 ml-auto" />
        <div className="w-6 h-px bg-ink/30 ml-auto" />
      </motion.div>

      {/* PLANE Z-0 — TOP RAIL */}
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
        <motion.div variants={fadeUp}>N° XVII / 26</motion.div>
      </motion.div>

      {/* PLANE Z-1 — STAGE */}
      <motion.div
        style={{ y: headlineY }}
        className="relative z-20 min-h-[100svh] flex items-center px-6 md:px-12 pt-28 pb-24"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-12 w-full max-w-[1500px] mx-auto items-center">
          {/* LEFT — passe-partout photo */}
          <motion.div
            variants={fadeUp}
            style={{ x: photoX, y: photoY }}
            className="relative col-span-12 md:col-span-5 md:col-start-1"
          >
            <motion.div
              ref={photoRef}
              style={{ y: photoParY, scale: photoParScale }}
              className="passe-partout relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-none shadow-print"
            >
              <motion.div
                initial={{ clipPath: "inset(50% 6% 50% 6%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.4, delay: 0.5, ease: EASE_EXPO }}
                className="absolute inset-0 overflow-hidden"
              >
                <AnimatePresence initial={false}>
                  {/* split-curtain wipe */}
                  <motion.div
                    key={photo.src + "-top"}
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 1.1, ease: EASE_EXPO }}
                    className="absolute inset-x-0 top-0 h-1/2 overflow-hidden z-10"
                  >
                    <motion.img
                      src={photo.src}
                      alt={photo.name}
                      animate={{ scale: [1.04, 1.10] }}
                      transition={{ duration: 14, ease: "linear" }}
                      className="absolute inset-x-0 top-0 w-full h-[200%] object-cover"
                      style={{ filter: "grayscale(35%) contrast(1.05) sepia(0.06) brightness(0.93)" }}
                    />
                  </motion.div>
                  <motion.div
                    key={photo.src + "-bot"}
                    initial={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 1.1, ease: EASE_EXPO }}
                    className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden z-10"
                  >
                    <motion.img
                      src={photo.src}
                      alt=""
                      aria-hidden
                      animate={{ scale: [1.04, 1.10] }}
                      transition={{ duration: 14, ease: "linear" }}
                      className="absolute inset-x-0 bottom-0 w-full h-[200%] object-cover"
                      style={{ filter: "grayscale(35%) contrast(1.05) sepia(0.06) brightness(0.93)", objectPosition: "bottom" }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* paper tint */}
                <div className="absolute inset-0 z-20 bg-gradient-to-tr from-paper/15 via-transparent to-ink/10 mix-blend-multiply pointer-events-none" />
              </motion.div>

              {/* counter */}
              <div className="absolute top-3 left-3 label-meta text-paper z-30 mix-blend-difference">
                {String(photoIdx + 1).padStart(2, "0")} — {String(PHOTOS.length).padStart(2, "0")}
              </div>

              {/* reticle */}
              <motion.div style={{ x: rsx, y: rsy }} className="pointer-events-none absolute top-0 left-0 z-30">
                <div className="-translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-paper mix-blend-difference flex items-center justify-center">
                  <span className="block w-px h-px bg-clay" />
                </div>
              </motion.div>
            </motion.div>

            {/* gallery wall label — vertical */}
            <div className="hidden md:block absolute top-0 -right-8 h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={photo.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: EASE_QUINT }}
                  className="vertical-rl label-meta text-ink/45 h-full flex items-center"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {photo.name} · {photo.city} · {photo.year}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT — typographic stack */}
          <div className="relative col-span-12 md:col-span-6 md:col-start-7 flex flex-col gap-10 md:gap-14">
            <motion.div
              variants={drawY}
              className="hidden md:block absolute -left-6 top-2 bottom-2 w-px bg-[var(--hairline)] origin-top"
            />

            <div className="font-display leading-[0.9] tracking-[-0.05em]">
              <Line delay={0.9}>
                <span className="block text-[14vw] md:text-[8vw] lg:text-[7.2vw] uppercase">Architecture</span>
              </Line>
              <Line delay={1.02}>
                <span
                  className="block text-[8vw] md:text-[4.6vw] lg:text-[4vw] font-fraunces italic text-ink/40 pl-[2ch]"
                  style={{ fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
                >
                  of
                </span>
              </Line>

              {/* morph word */}
              <span className="block h-[0.95em] relative overflow-hidden text-[14vw] md:text-[8vw] lg:text-[7.2vw]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={MORPH_WORDS[wordIdx]}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.9, ease: EASE_EXPO }}
                    className="font-fraunces italic text-clay block"
                    style={{
                      fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100',
                      WebkitMaskImage: "linear-gradient(to bottom, black 0, black 100%)",
                    }}
                  >
                    {MORPH_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <motion.div variants={fadeUp} className="flex items-start gap-5">
              <motion.div
                variants={drawX}
                className="w-16 h-px bg-clay origin-left mt-3 shrink-0"
              />
              <p className="font-fraunces text-base md:text-lg text-ink/70 leading-snug max-w-xs">
                Quiet volumes for loud cities — Tokyo &amp; New York, since 2009.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* PLANE Z-0 — BOTTOM RAIL */}
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
