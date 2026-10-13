import Image from 'next/image';

const SITES = [
  {
    href: 'https://buds4-pro-concept.vercel.app',
    img: '/buds4-pro-product.webp',
    name: 'Galaxy Buds4 Pro',
    text: 'Open the case, hear the ANC and 360 Audio.',
    glow: 'radial-gradient(55% 60% at 50% 55%, rgba(210, 222, 240, 0.18), transparent 72%)',
  },
  {
    href: 'https://watch-ultra2-concept.vercel.app',
    img: '/watch-ultra2-product.webp',
    name: 'Galaxy Watch Ultra2',
    text: 'Thinner titanium, 5,000 nits and an 800 mAh battery.',
    glow: 'radial-gradient(55% 60% at 50% 55%, rgba(164, 185, 140, 0.24), transparent 72%)',
  },
];

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="sg-ambient amb-violet relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <p className="sg-eyebrow mb-3 lg:mb-5">Galaxy ecosystem</p>
        <h2 className="sg-title max-w-3xl">
          Better <strong className="sg-ai">together.</strong>
        </h2>
        <p className="sg-lead mt-4 lg:mt-6 max-w-xl">
          Pair your Galaxy S26 Ultra with earbuds and a watch built to match. Each one has its own concept site.
        </p>
        <div className="mt-10 lg:mt-14 grid md:grid-cols-2 gap-4 lg:gap-6">
          {SITES.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0d] transition-colors duration-300 hover:border-white/25"
            >
              <div className="relative aspect-[16/10]" style={{ background: s.glow }}>
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="object-contain p-6 lg:p-10 transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-end justify-between gap-4 px-5 pb-5 lg:px-7 lg:pb-7">
                <div>
                  <p className="sg-eyebrow !text-[0.6rem] mb-1">Concept</p>
                  <p className="text-xl lg:text-2xl font-semibold">{s.name}</p>
                  <p className="text-sm text-white/60 font-light mt-1">{s.text}</p>
                </div>
                <span className="sg-btn !py-2.5 !px-5 text-sm shrink-0">
                  Explore
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 9L9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
