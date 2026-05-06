import { useEffect, useState } from "react";

const WORDS = ["STRUCTURE.", "SILENCE.", "SCALE."];
const IMAGES = [
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=2400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=2400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=2400&q=80&auto=format&fit=crop",
];

const COMMISSIONS = [
  "MERIDIAN TOWER  ·  SINGAPORE",
  "HALDEN EXCHANGE  ·  OSLO",
  "NORTH QUAY  ·  ROTTERDAM",
  "KOJIMA OFFICES  ·  TOKYO",
  "ATLAS PAVILION  ·  LISBON",
  "VESTRE LINE  ·  COPENHAGEN",
];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink text-bone">
      {/* image stack */}
      <div className="absolute inset-0">
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
            style={{ opacity: i === idx ? 0.55 : 0 }}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover animate-slow-pan"
              style={{ filter: "grayscale(100%) contrast(1.05)" }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/80" />
      </div>

      {/* top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-bone/15" />

      {/* center content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-center px-6 md:px-12">
          <div className="w-full">
            <div className="label-meta text-bone/60 mb-8">
              N 35.6762°&nbsp;&nbsp;·&nbsp;&nbsp;E 139.6503°
            </div>
            <div className="relative h-[18vw] min-h-[140px] md:h-[14vw]">
              {WORDS.map((w, i) => (
                <h1
                  key={w}
                  className="font-display absolute inset-0 leading-[0.9] text-[18vw] md:text-[14vw] transition-all duration-[1400ms] ease-out"
                  style={{
                    opacity: i === idx ? 1 : 0,
                    transform: i === idx ? "translateY(0)" : "translateY(2rem)",
                  }}
                >
                  {w}
                </h1>
              ))}
            </div>
            <div className="mt-10 max-w-xl text-bone/80 text-base md:text-lg font-light leading-relaxed">
              An architecture &amp; urban practice working between Tokyo and New York.
              Quiet volumes for loud cities — since 2009.
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="px-6 md:px-12 pb-8 md:pb-10 flex items-end justify-between gap-8">
          <div className="label-meta text-bone/70 flex items-center gap-4">
            <span className="text-warm">●</span>
            <span>04 / Scroll</span>
          </div>

          <div className="hidden md:block h-32 overflow-hidden w-72 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            <div className="animate-marquee-y space-y-3">
              {[...COMMISSIONS, ...COMMISSIONS].map((c, i) => (
                <div key={i} className="label-meta text-bone/70">
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="label-meta text-bone/70 text-right">
            Currently
            <br />
            <span className="text-bone">14 commissions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
