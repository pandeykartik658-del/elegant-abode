import { useEffect, useState } from "react";

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" className="label-meta text-bone mix-blend-difference">
          AXIS&nbsp;NOVA
        </a>
        <nav className="hidden md:flex items-center gap-10 label-meta text-bone mix-blend-difference">
          <a href="#works" className="hover:opacity-60 transition">Works</a>
          <a href="#studio" className="hover:opacity-60 transition">Studio</a>
          <a href="#index" className="hover:opacity-60 transition">Index</a>
          <a href="#contact" className="hover:opacity-60 transition">Contact</a>
        </nav>
        <div className="label-meta text-bone mix-blend-difference hidden md:block">
          MMXXVI
        </div>
      </div>
    </header>
  );
}
