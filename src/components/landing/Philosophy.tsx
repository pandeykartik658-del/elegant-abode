export function Philosophy() {
  return (
    <section id="studio" className="bg-bone text-ink">
      <div className="px-6 md:px-12 py-32 md:py-56 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <div className="label-meta text-ink/50">01 — Approach</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <p className="font-serif-display text-3xl md:text-5xl lg:text-6xl leading-[1.15] text-ink">
              We design buildings that hold their breath
              <span className="text-ink/40"> — quiet volumes for loud cities, where light, mass, and silence do the talking.</span>
            </p>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl">
              <div>
                <div className="label-meta text-ink/50 mb-3">Practice</div>
                <p className="text-sm font-light leading-relaxed text-ink/80">
                  Forty-two architects, planners and engineers operating from
                  studios in Tokyo and New York.
                </p>
              </div>
              <div>
                <div className="label-meta text-ink/50 mb-3">Discipline</div>
                <p className="text-sm font-light leading-relaxed text-ink/80">
                  High-rise, civic, masterplanning. Buildings as instruments
                  for the slow life of a city.
                </p>
              </div>
              <div>
                <div className="label-meta text-ink/50 mb-3">Awards</div>
                <p className="text-sm font-light leading-relaxed text-ink/80">
                  RIBA International 2023 · Mies Crown Hall Americas 2022 ·
                  AR Future Project 2021.
                </p>
              </div>
            </div>

            <div className="mt-24 flex items-center gap-6">
              <div className="font-serif-display italic text-2xl text-ink">— H. Arai</div>
              <div className="label-meta text-ink/50">Founding Principal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
