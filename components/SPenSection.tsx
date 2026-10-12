export default function SPenSection() {
  return (
    <section id="s-pen" className="relative w-full h-[200svh] pointer-events-none">
      <div className="sticky top-0 h-svh w-full flex items-end md:items-center justify-end px-6 md:px-[12%] pb-14 md:pb-0">
        <div className="max-w-md">
          <p className="sg-eyebrow mb-3 md:mb-5">S Pen</p>
          <h2 className="sg-title mb-4 md:mb-6 drop-shadow-xl">
            Always in <br />
            <strong className="sg-ai">Your Hand.</strong>
          </h2>
          <p className="sg-lead mb-6 md:mb-10">
            Slide the S Pen out of its slot and start writing, sketching or marking up right away.
            It lives inside the phone, so it&apos;s always with you.
          </p>

          <div className="flex flex-wrap gap-3">
            {['Notes', 'Sketch', 'Mark up'].map((t) => (
              <span key={t} className="sg-eyebrow !text-[0.65rem] px-4 py-2 rounded-full border border-white/15">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}