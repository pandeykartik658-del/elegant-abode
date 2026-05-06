import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MORPH_WORDS = ["tower.", "ground.", "light.", "silence."];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1545153996-ec5f7b3b1c2c?w=1600&q=85&auto=format&fit=crop", name: "Meridian Tower", city: "Singapore" },
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85&auto=format&fit=crop", name: "Halden Exchange", city: "Oslo" },
  { src: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1600&q=85&auto=format&fit=crop", name: "Kojima Offices", city: "Tokyo" },
  { src: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1600&q=85&auto=format&fit=crop", name: "North Quay", city: "Rotterdam" },
];

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

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.9 });
  const photoX = useTransform(sx, (v) => v * 12);
  const photoY = useTransform(sy, (v) => v * 10);
  const blueY = useTransform(sx, (v) => v * -8);
  const blueX = useTransform(sy, (v) => v * -6);

  // reticle that follows cursor inside photo column
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);
  const rsx = useSpring(rx, { stiffness: 350, damping: 28, mass: 0.4 });
  const rsy = useSpring(ry, { stiffness: 350, damping: 28, mass: 0.4 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0]);
  const blueprintScrollY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  useEffect(() => {
    const a = setInterval(() => setWordIdx((i) => (i + 1) % MORPH_WORDS.length), 3200);
    const b = setInterval(() => setPhotoIdx((i) => (i + 1) % PHOTOS.length), 5800);
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
      if (inside) {
        rx.set(e.clientX - pr.left);
        ry.set(e.clientY - pr.top);
      } else {
        rx.set(-100); ry.set(-100);
      }
    }
  };

  const photo = PHOTOS[photoIdx];

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-[100svh] w-full overflow-hidden bg-paper text-ink grain"
    >
      {/* hairline frame */}
      <div className="pointer-events-none absolute inset-x-6 md:inset-x-12 top-20 bottom-16 border border-[var(--hairline)]" />

      {/* corner ticks */}
      {[
        "top-20 left-6 md:left-12 border-t border-l",
        "top-20 right-6 md:right-12 border-t border-r",
        "bottom-16 left-6 md:left-12 border-b border-l",
        "bottom-16 right-6 md:right-12 border-b border-r",
      ].map((cls, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-none absolute w-6 h-6 border-clay ${cls}`}
        />
      ))}

      {/* TOP RAIL */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 pt-6 flex items-center justify-between label-meta text-ink/70"
      >
        <div className="flex items-center gap-4">
          <span>TYO {tokyo || "—"}</span>
          <span className="text-ink/30">·</span>
          <span>NYC {ny || "—"}</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full bg-clay"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>14 live</span>
        </div>
        <div>N° XVII / 26</div>
      </motion.div>

      {/* blueprint watermark */}
      <motion.div
        style={{ x: blueX, y: blueprintScrollY, opacity: heroOpacity }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none w-[60vw] md:w-[42vw] opacity-[0.10]"
      >
        <Blueprint />
      </motion.div>

      {/* MAIN STAGE */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-[100svh] flex items-center px-6 md:px-12 pt-28 pb-24"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-10 w-full max-w-[1500px] mx-auto items-stretch">
          {/* LEFT — photo */}
          <motion.div
            ref={photoRef}
            style={{ x: photoX, y: photoY }}
            className="relative col-span-12 md:col-span-5 aspect-[3/4] md:aspect-auto md:min-h-[68vh] overflow-hidden cursor-none"
          >
            <motion.div
              initial={{ clipPath: "inset(50% 8% 50% 8%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.83, 0, 0.17, 1] }}
              className="absolute inset-0 overflow-hidden"
            >
              <AnimatePresence mode="sync">
                <motion.img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.name}
                  initial={{ clipPath: "inset(45% 0 45% 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: [1.05, 1.14] }}
                  exit={{ clipPath: "inset(45% 0 45% 0)", opacity: 0 }}
                  transition={{
                    clipPath: { duration: 1.1, ease: [0.83, 0, 0.17, 1] },
                    opacity: { duration: 0.6 },
                    scale: { duration: 6, ease: "linear" },
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "grayscale(35%) contrast(1.05) sepia(0.08) brightness(0.92)" }}
                />
              </AnimatePresence>
              {/* paper tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-paper/20 via-transparent to-ink/15 mix-blend-multiply" />
            </motion.div>

            {/* photo counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="absolute top-4 left-4 label-meta text-paper z-10 mix-blend-difference"
            >
              {String(photoIdx + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
            </motion.div>

            {/* reticle */}
            <motion.div
              style={{ x: rsx, y: rsy }}
              className="pointer-events-none absolute top-0 left-0 z-10"
            >
              <div className="-translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-paper bg-clay/80 mix-blend-difference" />
            </motion.div>
          </motion.div>

          {/* DIVIDER RULE */}
          <div className="hidden md:flex md:col-span-[0.3] relative items-stretch justify-center" style={{ flexBasis: 1 }}>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-px bg-clay/60 origin-top h-full"
            />
          </div>

          {/* RIGHT — type */}
          <div className="col-span-12 md:col-span-7 flex flex-col justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="label-meta text-clay mb-8 md:mb-12"
              >
                01 — Vol. XVII
              </motion.div>

              <h1 className="font-display leading-[0.92] tracking-[-0.05em] text-[14vw] md:text-[8.4vw] lg:text-[7.6vw]">
                <Line text="An" delay={0.7} />
                <Line text="architecture" delay={0.85} />
                <Line text="of" delay={1.0} />
                <span className="block h-[1.05em] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={MORPH_WORDS[wordIdx]}
                      initial={{ y: "75%", opacity: 0, filter: "blur(14px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-75%", opacity: 0, filter: "blur(14px)" }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      className="font-fraunces italic text-clay inline-block"
                      style={{ fontVariationSettings: '"wght" 300, "opsz" 144, "SOFT" 100' }}
                    >
                      {MORPH_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-10 md:mt-16 flex items-end gap-6"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-16 h-px bg-ink/40 origin-left mb-2"
              />
              <p className="font-fraunces text-base md:text-xl text-ink/75 max-w-sm leading-snug">
                Quiet volumes for loud cities.<br />
                <span className="italic text-ink/50">Tokyo · New York · since 2009.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM RAIL */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9 }}
        className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 pb-6 flex items-center justify-between label-meta text-ink/60"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="block w-2 h-2 rounded-full bg-clay" />
            <span className="text-ink/80">{photo.name}</span>
            <span className="text-ink/30">—</span>
            <span>{photo.city}</span>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-3">
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >↓</motion.span>
        </div>
      </motion.div>
    </section>
  );
}

function Line({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        className="block"
      >
        {text}
      </motion.span>
    </span>
  );
}

function Blueprint() {
  const draw: any = {
    initial: { pathLength: 0, opacity: 0 },
    animate: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.08 },
        opacity: { duration: 0.4, delay: 0.2 + i * 0.08 },
      },
    }),
  };
  const ink = "var(--ink)";
  return (
    <motion.svg viewBox="0 0 800 900" className="w-full h-auto" fill="none" stroke={ink} strokeWidth="0.7">
      <motion.g strokeWidth="1">
        <motion.line x1="80" y1="820" x2="720" y2="820" variants={draw} initial="initial" animate="animate" custom={1} />
        <motion.rect x="320" y="160" width="160" height="660" variants={draw} initial="initial" animate="animate" custom={2} />
        <motion.polyline points="320,160 340,140 460,140 480,160" variants={draw} initial="initial" animate="animate" custom={3} />
        <motion.line x1="400" y1="140" x2="400" y2="60" variants={draw} initial="initial" animate="animate" custom={4} />
        <motion.circle cx="400" cy="56" r="3" variants={draw} initial="initial" animate="animate" custom={4.2} />
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.line key={i} x1="320" y1={180 + i * 29} x2="480" y2={180 + i * 29} variants={draw} initial="initial" animate="animate" custom={2 + i * 0.04} strokeWidth="0.4" />
        ))}
        <motion.rect x="385" y="160" width="30" height="660" variants={draw} initial="initial" animate="animate" custom={3.5} />
        <motion.rect x="240" y="720" width="320" height="100" variants={draw} initial="initial" animate="animate" custom={4.5} />
        <motion.line x1="260" y1="160" x2="260" y2="820" variants={draw} initial="initial" animate="animate" custom={5} />
        <motion.line x1="540" y1="60" x2="540" y2="820" variants={draw} initial="initial" animate="animate" custom={5.3} />
      </motion.g>
    </motion.svg>
  );
}
