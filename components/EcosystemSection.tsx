import Image from 'next/image';

const SITES = [
  {
    href: 'https://buds4-pro-concept.vercel.app',
    img: '/ecosystem-buds4-pro.webp',
    name: 'Galaxy Buds4 Pro',
    text: 'Open the case, hear the ANC and 360 Audio.',
  },
  {
    href: 'https://watch-ultra-concept.vercel.app',
    img: '/ecosystem-watch-ultra2.webp',
    name: 'Galaxy Watch Ultra2',
    text: 'Thinner titanium, 5,000 nits and an 800 mAh battery.',
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
              className="group relative block overflow-hidden rounded-[28px] border border-white/10 aspect-[8/5]"
            >
              <Image
                src={s.img}
                alt={`${s.name} concept site`}
                width={960}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between gap-4">
                <div>
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
