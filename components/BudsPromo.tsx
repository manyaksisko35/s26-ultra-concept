import Image from 'next/image';

const BUDS_SITE = 'https://buds4-pro-concept.vercel.app';

export default function BudsPromo() {
  return (
    <section id="buds" className="sg-ambient amb-violet relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.25fr] gap-8 lg:gap-14 items-center">
        <div>
          <p className="sg-eyebrow mb-3 lg:mb-5">Galaxy ecosystem</p>
          <h2 className="sg-title">
            Pair it with <strong className="sg-ai">Galaxy Buds4 Pro.</strong>
          </h2>
          <p className="sg-lead mt-4 lg:mt-6 max-w-md">
            24-bit Hi-Fi over the Samsung Seamless Codec, Super Clear Call and 360 Audio come together on a Galaxy
            phone. Open the case and hear it for yourself.
          </p>
          <a href={BUDS_SITE} target="_blank" rel="noopener noreferrer" className="sg-btn mt-8">
            Explore Buds4 Pro
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M3 9L9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </a>
        </div>
        <a
          href={BUDS_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-[28px] border border-white/10"
          aria-label="Galaxy Buds4 Pro concept site"
        >
          <Image
            src="/ecosystem-buds4-pro.webp"
            alt="Galaxy Buds4 Pro concept site"
            width={960}
            height={600}
            className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </a>
      </div>
    </section>
  );
}
