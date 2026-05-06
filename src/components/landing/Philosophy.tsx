import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SplitText } from "@/components/motion/SplitText";

export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ruleScale = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section ref={ref} id="studio" className="relative bg-paper text-ink grain overflow-hidden">
      <div className="px-6 md:px-12 py-32 md:py-56 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-8 relative">
          <motion.div
            style={{ scaleY: ruleScale, transformOrigin: "top" }}
            className="absolute left-0 top-0 bottom-0 w-px bg-clay/70"
          />
          <div className="col-span-12 md:col-span-3 pl-6">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9 }}
              className="label-meta text-clay"
            >
              01 — Approach
            </motion.div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-3xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-[-0.02em]">
              <SplitText
                text="We design buildings that hold their breath —"
                by="word"
                stagger={0.045}
                duration={1.1}
                className="font-fraunces"
              />
              <span className="text-ink/35 font-fraunces">
                {" "}
                <SplitText
                  text="quiet volumes for loud cities, where light, mass, and silence do the talking."
                  by="word"
                  stagger={0.025}
                  delay={0.6}
                  duration={1}
                  className="font-fraunces italic"
                />
              </span>
            </h2>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl">
              {[
                { l: "Practice", t: "Forty-two architects, planners and engineers operating from studios in Tokyo and New York." },
                { l: "Discipline", t: "High-rise, civic, masterplanning. Buildings as instruments for the slow life of a city." },
                { l: "Awards", t: "RIBA International 2023 · Mies Crown Hall Americas 2022 · AR Future Project 2021." },
              ].map((c, i) => (
                <motion.div
                  key={c.l}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 1.2 + i * 0.15 }}
                  whileHover={{ y: -4 }}
                  className="group relative pb-3"
                >
                  <div className="label-meta text-ink/50 mb-3">{c.l}</div>
                  <p className="text-sm font-light leading-relaxed text-ink/80">{c.t}</p>
                  <motion.span
                    className="absolute left-0 bottom-0 h-px bg-clay origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: "100%" }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-24 flex items-center gap-6"
            >
              <div className="font-fraunces italic text-3xl text-ink">— H. Arai</div>
              <div className="label-meta text-ink/50">Founding Principal</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
