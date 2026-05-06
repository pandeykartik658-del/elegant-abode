import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function TopBar() {
  const [dark, setDark] = useState(false);
  const { scrollY } = useScroll();
  const padY = useTransform(scrollY, [0, 200], [24, 14]);

  useEffect(() => {
    const onScroll = () => {
      // detect if we're over a dark section (.bg-ink)
      const sections = document.querySelectorAll<HTMLElement>("section");
      const probeY = 40;
      let found = false;
      sections.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          const bg = window.getComputedStyle(s).backgroundColor;
          // ink is very dark
          const m = bg.match(/\d+(\.\d+)?/g);
          if (m) {
            const [r1, g1, b1] = m.map(Number);
            const lum = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
            if (lum < 80) found = true;
          }
        }
      });
      setDark(found);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const color = dark ? "text-paper" : "text-ink";

  return (
    <motion.header
      style={{ paddingTop: padY, paddingBottom: padY }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" className={`label-meta ${color} transition-colors duration-500 flex items-center gap-3`}>
          <span className="block w-2 h-2 bg-clay rounded-full" />
          AXIS&nbsp;NOVA
        </a>
        <nav className={`hidden md:flex items-center gap-10 label-meta ${color} transition-colors duration-500`}>
          <a href="#works" className="hover:text-clay transition">Works</a>
          <a href="#studio" className="hover:text-clay transition">Studio</a>
          <a href="#index" className="hover:text-clay transition">Index</a>
          <a href="#contact" className="hover:text-clay transition">Contact</a>
        </nav>
        <div className={`label-meta ${color} transition-colors duration-500 hidden md:block`}>MMXXVI</div>
      </div>
    </motion.header>
  );
}
