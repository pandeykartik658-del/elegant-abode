import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SplitText({
  text,
  by = "char",
  className,
  childClassName,
  stagger = 0.04,
  delay = 0,
  duration = 1,
  y = "100%",
  once = true,
}: {
  text: string;
  by?: "char" | "word";
  className?: string;
  childClassName?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  y?: string | number;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const parts = by === "char" ? Array.from(text) : text.split(/(\s+)/);
  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {parts.map((p, i) => {
        if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          >
            <motion.span
              style={{ display: "inline-block", whiteSpace: "pre" }}
              className={childClassName}
              initial={{ y, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * stagger,
              }}
            >
              {p === " " ? "\u00A0" : p}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
