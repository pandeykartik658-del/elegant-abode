export function ClosingFrame() {
  return (
    <section id="contact" className="relative bg-ink text-bone">
      <div className="px-6 md:px-12 py-32 md:py-56 max-w-[1600px] mx-auto">
        <div className="text-center">
          <div className="label-meta text-bone/50 mb-10">04 — Commission</div>
          <h2 className="font-serif-display italic text-4xl md:text-7xl leading-[1.05] max-w-4xl mx-auto">
            Build quietly.<br/>Build to last.
          </h2>
          <a
            href="mailto:studio@axisnova.com"
            className="inline-flex items-center gap-3 mt-16 label-meta border border-bone/30 px-8 py-5 hover:bg-bone hover:text-ink transition-colors duration-500"
          >
            Begin a commission
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-4 gap-10 hairline-t pt-12" style={{ borderColor: 'rgba(247,245,240,0.15)' }}>
          <div>
            <div className="label-meta text-bone/50 mb-3">Tokyo</div>
            <p className="text-sm font-light text-bone/80 leading-relaxed">
              4-2-8 Aoyama<br/>Minato-ku, 107-0062<br/>+81 3 6406 0214
            </p>
          </div>
          <div>
            <div className="label-meta text-bone/50 mb-3">New York</div>
            <p className="text-sm font-light text-bone/80 leading-relaxed">
              122 Greenwich Ave<br/>NY 10011<br/>+1 212 388 0044
            </p>
          </div>
          <div>
            <div className="label-meta text-bone/50 mb-3">Press</div>
            <p className="text-sm font-light text-bone/80 leading-relaxed">
              press@axisnova.com<br/>Monograph, 2025<br/>Lars Müller Publishers
            </p>
          </div>
          <div>
            <div className="label-meta text-bone/50 mb-3">Follow</div>
            <p className="text-sm font-light text-bone/80 leading-relaxed">
              Instagram<br/>Are.na<br/>Journal
            </p>
          </div>
        </div>

        <div className="mt-20 flex items-center justify-between label-meta text-bone/40">
          <div>© AXIS NOVA · MMXXVI</div>
          <div>All works archived</div>
        </div>
      </div>
    </section>
  );
}
