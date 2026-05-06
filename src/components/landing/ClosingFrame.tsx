import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitText } from "@/components/motion/SplitText";

export function ClosingFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section ref={ref} id="contact" className="relative bg-ink text-paper overflow-hidden">
      {/* circular wipe */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.83, 0, 0.17, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax] rounded-full bg-ink"
        style={{ transformOrigin: "center" }}
      />
      <div className="relative px-6 md:px-12 py-32 md:py-56 max-w-[1600px] mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="label-meta text-clay mb-10"
          >
            04 — Commission
          </motion.div>
          <h2 className="font-fraunces italic text-4xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl mx-auto tracking-[-0.02em]">
            <SplitText text="Build quietly." by="word" stagger={0.08} delay={1} duration={1.2} />
            <br />
            <SplitText text="Build to last." by="word" stagger={0.08} delay={1.4} duration={1.2} />
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.2, duration: 0.9 }}
            className="mt-16 inline-block"
          >
            <MagneticButton
              href="mailto:studio@axisnova.com"
              className="group inline-flex items-center gap-4 label-meta border border-paper/30 px-10 py-6 hover:bg-paper hover:text-ink transition-colors duration-500"
            >
              <span>Begin a commission</span>
              <motion.span aria-hidden className="inline-block transition-transform group-hover:translate-x-2">
                →
              </motion.span>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.6, duration: 1 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-10 pt-12"
          style={{ borderTop: "1px solid rgba(239,236,228,0.15)" }}
        >
          {[
            { l: "Tokyo", t: "4-2-8 Aoyama\nMinato-ku, 107-0062\n+81 3 6406 0214" },
            { l: "New York", t: "122 Greenwich Ave\nNY 10011\n+1 212 388 0044" },
            { l: "Press", t: "press@axisnova.com\nMonograph, 2025\nLars Müller Publishers" },
            { l: "Follow", t: "Instagram\nAre.na\nJournal" },
          ].map((c) => (
            <div key={c.l}>
              <div className="label-meta text-paper/50 mb-3">{c.l}</div>
              <p className="text-sm font-light text-paper/80 leading-relaxed whitespace-pre-line">{c.t}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-20 flex items-center justify-between label-meta text-paper/40">
          <div>© AXIS NOVA · MMXXVI</div>
          <div>All works archived</div>
        </div>
      </div>
    </section>
  );
}
