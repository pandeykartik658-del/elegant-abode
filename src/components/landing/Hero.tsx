import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MORPH_WORDS = ["tower.", "ground.", "light.", "silence."];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1545153996-ec5f7b3b1c2c?w=1900&q=90&auto=format&fit=crop", name: "Meridian Tower", city: "SGP", year: "2023", plate: "03" },
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1900&q=90&auto=format&fit=crop", name: "Halden Exchange", city: "OSL", year: "2022", plate: "07" },
  { src: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1900&q=90&auto=format&fit=crop", name: "Kojima Offices", city: "TYO", year: "2024", plate: "11" },
];

const EASE_QUINT = [0.16, 1, 0.3, 1] as const;
const EASE_EXPO = [0.83, 0, 0.17, 1] as const;

function useClock(tz: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz, hour12: false }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

function useCountUp(target: number, start: boolean, duration = 1200) {
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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE_QUINT } },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hoverPhoto, setHoverPhoto] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.9 });
  const imgX = useTransform(sx, (v) => v * 18);
  const imgY = useTransform(sy, (v) => v * 14);

  const rx = useMotionValue(-200);
  const ry = useMotionValue(-200);
  const rsx = useSpring(rx, { stiffness: 350, damping: 28, mass: 0.4 });
  const rsy = useSpring(ry, { stiffness: 350, damping: 28, mass: 0.4 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgParY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const imgParScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const hudY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const hudOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const shaftOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const a = setInterval(() => setWordIdx((i) => (i + 1) % MORPH_WORDS.length), 4000);
    const b = setInterval(() => setPhotoIdx((i) => (i + 1) % PHOTOS.length), 9000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const tokyo = useClock("Asia/Tokyo");
  const ny = useClock("America/New_York");
  const counted = useCountUp(17, mounted, 1200);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    const pr = photoRef.current?.getBoundingClientRect();
    if (pr) {
      const inside = e.clientX >= pr.left && e.clientX <= pr.right && e.clientY >= pr.top && e.clientY <= pr.bottom;
      if (inside) { rx.set(e.clientX - pr.left); ry.set(e.clientY - pr.top); setHoverPhoto(true); }
      else { rx.set(-200); ry.set(-200); setHoverPhoto(false); }
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
      className="relative min-h-[100svh] w-full overflow-hidden bg-ink-deep text-paper-warm"
      style={{ ['--ink' as any]: 'var(--paper-warm)' }}
    >
      {/* PLANE Z-3 — faint drafting grid on dark */}
      <motion.div style={{ opacity: hudOpacity }} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="relative h-full w-full max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="absolute inset-0 grid grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative h-full">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.4, delay: 0.1 + i * 0.05, ease: EASE_QUINT }}
                  className="absolute top-0 bottom-0 left-0 w-px origin-top"
                  style={{ background: 'rgba(255,235,200,0.05)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* PLANE Z-2 — atmospheric numeral ghost */}
      <motion.div
        style={{ y: numeralY }}
        variants={fadeUp}
        className="pointer-events-none absolute -right-[8vw] top-[2vh] z-0 select-none"
        aria-hidden
      >
        <span
          className="font-fraunces italic block leading-none"
          style={{ fontSize: "clamp(280px, 62vw, 1200px)", color: 'rgba(255,235,200,0.035)', fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
        >
          17
        </span>
      </motion.div>

      {/* PLANE Z-1 — full-bleed cinematic cover */}
      <motion.div
        ref={photoRef}
        variants={fadeUp}
        className="absolute z-10 overflow-hidden shadow-plate"
        style={{
          top: '14vh',
          bottom: '14vh',
          left: '4vw',
          right: 'clamp(220px, 22vw, 380px)',
        }}
      >
        {/* clip reveal */}
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE_EXPO }}
          className="absolute inset-0"
        >
          <AnimatePresence mode="popLayout">
            <motion.img
              key={photo.src}
              src={photo.src}
              alt={photo.name}
              initial={{ scale: 1.18, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 1 }}
              exit={{ scale: 1.10, opacity: 0 }}
              transition={{ opacity: { duration: 1.2, ease: EASE_EXPO }, scale: { duration: 18, ease: 'linear' } }}
              style={{ x: imgX, y: imgY }}
              className="absolute inset-0 w-full h-full object-cover duotone-warm"
            />
          </AnimatePresence>

          {/* warm multiply tint */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(40,22,12,0.45), rgba(10,8,6,0.65))', mixBlendMode: 'multiply' }} />
          {/* dusk vignette */}
          <div className="absolute inset-0 vignette-dusk" />
          {/* parallax inner zoom */}
          <motion.div style={{ y: imgParY, scale: imgParScale }} className="absolute inset-0 pointer-events-none" />

          {/* drifting light shaft */}
          <motion.div style={{ opacity: shaftOpacity }} className="absolute inset-0 overflow-hidden">
            <div className="shaft-light" />
          </motion.div>

          {/* dust */}
          <div className="dust-layer" />

          {/* reticle */}
          <motion.div
            style={{ x: rsx, y: rsy, opacity: hoverPhoto ? 1 : 0 }}
            className="pointer-events-none absolute top-0 left-0 z-30 transition-opacity duration-300"
          >
            <div className="-translate-x-1/2 -translate-y-1/2 relative">
              <div className="w-10 h-10 rounded-full border border-brass/70 flex items-center justify-center">
                <span className="block w-1 h-1 rounded-full bg-brass" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-mono-meta text-[9px] text-brass whitespace-nowrap">VIEW · {photo.plate}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* hairline frame */}
        <div className="absolute inset-0 pointer-events-none border" style={{ borderColor: 'rgba(255,235,200,0.10)' }} />
      </motion.div>

      {/* TOP RAIL */}
      <motion.div
        style={{ opacity: hudOpacity }}
        className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 pt-6 flex items-center justify-between label-meta"
      >
        <motion.div variants={fadeUp} className="text-paper-warm/60">AXIS NOVA · ATELIER MMXXVI</motion.div>
        <motion.div variants={fadeUp} className="hidden md:flex items-center gap-4 text-paper-warm/60">
          <span>TYO {tokyo || "—"}</span>
          <span className="text-paper-warm/25">·</span>
          <span>NYC {ny || "—"}</span>
        </motion.div>
        <motion.div variants={fadeUp} className="text-brass">SHEET 01 / 12</motion.div>
      </motion.div>

      {/* HEADLINE — carved over the cover */}
      <motion.div
        style={{ y: headlineY }}
        className="relative z-30 min-h-[100svh] flex items-end pointer-events-none px-6 md:px-12 pb-[16vh]"
      >
        <div className="w-full max-w-[1500px] mx-auto">
          <div className="font-fraunces leading-[0.92] tracking-[-0.035em]" style={{ mixBlendMode: 'difference', color: 'var(--paper-warm)' }}>
            <Reveal delay={0.85}>
              <span
                className="block uppercase text-shadow-deep"
                style={{ fontSize: 'clamp(64px, 11vw, 200px)', fontVariationSettings: '"wght" 380, "opsz" 144, "SOFT" 30' }}
              >
                Architecture
              </span>
            </Reveal>
            <Reveal delay={0.97}>
              <span
                className="block italic pl-[4ch] -mt-[0.12em]"
                style={{ fontSize: 'clamp(20px, 2.6vw, 44px)', opacity: 0.55, fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
              >
                of
              </span>
            </Reveal>
          </div>

          {/* morph word — clay glow, not blended (so the color reads pure) */}
          <div className="relative mt-[-0.05em]">
            <span className="block relative overflow-hidden font-fraunces" style={{ fontSize: 'clamp(56px, 9.5vw, 170px)', lineHeight: 0.95 }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={MORPH_WORDS[wordIdx]}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 1.0, ease: EASE_EXPO }}
                  className="italic block text-clay-glow"
                  style={{ fontVariationSettings: '"wght" 420, "opsz" 144, "SOFT" 100', textShadow: '0 0 40px rgba(214, 120, 60, 0.35), 0 8px 30px rgba(0,0,0,0.5)' }}
                >
                  {MORPH_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            {/* drawing underline */}
            <motion.div
              key={`u-${wordIdx}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE_EXPO }}
              className="origin-left h-[2px] bg-clay-glow mt-2 max-w-[60%]"
              style={{ boxShadow: '0 0 18px rgba(214,120,60,0.45)' }}
            />
          </div>

          {/* tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 2.1, ease: EASE_QUINT }}
            className="mt-8 flex flex-col gap-2"
            style={{ mixBlendMode: 'difference' }}
          >
            <p className="font-fraunces italic text-paper-warm/85" style={{ fontSize: 'clamp(15px, 1.25vw, 22px)', fontVariationSettings: '"wght" 350, "opsz" 60' }}>
              Quiet volumes for loud cities.
            </p>
            <p className="font-mono-meta text-[10.5px] text-brass/80">
              TOKYO · NEW YORK · SINCE MMIX
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* HUD COLUMN — right gutter */}
      <motion.aside
        style={{ y: hudY, opacity: hudOpacity }}
        className="absolute z-40 right-6 md:right-12 top-[14vh] bottom-[14vh] hidden md:flex flex-col gap-5"
        aria-hidden
      >
        <div className="w-px self-stretch" style={{ background: 'linear-gradient(to bottom, transparent, rgba(220,180,120,0.35), transparent)' }} />
      </motion.aside>

      <motion.div
        style={{ y: hudY, opacity: hudOpacity }}
        className="absolute z-40 hidden md:flex flex-col gap-6 text-right"
        // anchored inside the right gutter
        // gutter starts at right: clamp(220, 22vw, 380); so HUD lives within
        // right margin of 6/12px and width ~ gutter - margin
        // we use right offset and a width
      >
        <div />
      </motion.div>

      {/* HUD content (positioned right column) */}
      <motion.div
        style={{ y: hudY, opacity: hudOpacity }}
        className="absolute z-40 hidden md:block top-[14vh] bottom-[14vh] right-6 md:right-12"
      >
        <div className="flex flex-col h-full justify-between" style={{ width: 'clamp(170px, 16vw, 260px)' }}>
          {/* TOP block */}
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono-meta text-[10px] text-paper-warm/45">N°</span>
              <span className="font-fraunces text-brass" style={{ fontSize: 'clamp(40px, 4.6vw, 78px)', lineHeight: 1, fontVariationSettings: '"wght" 350, "opsz" 144' }}>
                {String(counted).padStart(2, "0")}
              </span>
              <span className="font-mono-meta text-[10px] text-paper-warm/45">/ XXVI</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.7, ease: EASE_EXPO }}
              className="h-px bg-brass/50 origin-right"
            />
            <div className="flex flex-col gap-1 text-right">
              <span className="font-mono-meta text-[10px] text-paper-warm/55">PROJECTS IN MOTION</span>
              <span className="font-mono-meta text-[10px] text-paper-warm/35">EST. MMIX · TYO · NYC</span>
            </div>
          </div>

          {/* MID block */}
          <div className="flex flex-col gap-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <motion.span
                className="block w-1.5 h-1.5 rounded-full bg-clay-glow"
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.4, 1], boxShadow: ['0 0 0 rgba(214,120,60,0.6)', '0 0 16px rgba(214,120,60,0.6)', '0 0 0 rgba(214,120,60,0.6)'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono-meta text-[10px] text-paper-warm/75">14 LIVE COMMISSIONS</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6, ease: EASE_QUINT }}
                className="font-mono-meta text-[10px] text-paper-warm/55 flex flex-col gap-1"
              >
                <span>PL. {photo.plate} / {photo.name.toUpperCase()}</span>
                <span className="text-paper-warm/35">{photo.city} · {photo.year}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM block */}
          <div className="flex flex-col gap-3 text-right">
            <div className="flex items-center justify-end gap-3">
              <span className="font-mono-meta text-[10px] text-brass/70">ELEV. NORTH</span>
              <CompassRose />
            </div>
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="font-mono-meta text-[10px] text-paper-warm/60"
            >
              SCROLL ↓
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM RAIL */}
      <motion.div
        style={{ opacity: hudOpacity }}
        className="absolute bottom-0 left-0 right-0 z-40 px-6 md:px-12 pb-6 flex items-center justify-between label-meta text-paper-warm/45"
      >
        <motion.div variants={fadeUp}>SECT. A—A′</motion.div>
        <motion.div variants={fadeUp} className="hidden sm:block">© AXIS NOVA — ALL PLATES RESERVED</motion.div>
      </motion.div>
    </motion.section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.05, delay, ease: EASE_EXPO }}
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
      width="32" height="32" viewBox="0 0 32 32"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="text-brass/70"
    >
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
      <line x1="16" y1="2" x2="16" y2="7" stroke="currentColor" strokeWidth="0.6" />
      <line x1="16" y1="25" x2="16" y2="30" stroke="currentColor" strokeWidth="0.6" />
      <line x1="2" y1="16" x2="7" y2="16" stroke="currentColor" strokeWidth="0.6" />
      <line x1="25" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="0.6" />
      <polygon points="16,4 14.5,9 16,8 17.5,9" fill="currentColor" />
    </motion.svg>
  );
}
