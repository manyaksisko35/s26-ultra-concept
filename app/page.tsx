'use client';

import Scene from '@/components/Scene';
import HeroGlow from '@/components/HeroGlow';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import SectionDots from '@/components/SectionDots';
import SoundToggle from '@/components/SoundToggle';
import HeadlineReveal from '@/components/HeadlineReveal';
import AmbientPause from '@/components/AmbientPause';
import FilmTour from '@/components/FilmTour';
import Hero from '@/components/Hero';
import Teardown from '@/components/Teardown';
import Features from '@/components/Features';
import CameraSection from '@/components/CameraSection';
import SPenSection from '@/components/SPenSection';
import ColorSection from '@/components/ColorSection';
import GalaxyAI from '@/components/GalaxyAI';
import ZoomSection from '@/components/ZoomSection';
import NightographySection from '@/components/NightographySection';
import SteadySection from '@/components/SteadySection';
import DesignSection from '@/components/DesignSection';
import SecuritySection from '@/components/SecuritySection';
import InsideSection from '@/components/InsideSection';
import BuildSection from '@/components/BuildSection';
import PrivacySection from '@/components/PrivacySection';
import ChargeSection from '@/components/ChargeSection';
import CompareSection from '@/components/CompareSection';
import SectionCanvas from '@/components/SectionCanvas';
import Specs from '@/components/Specs';

export default function Home() {
  return (
    <>
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-black focus:font-semibold"
      >
        Skip to content
      </a>
      <Loader />
      <Navbar />
      <ScrollProgress />
      <SectionDots />
      <SoundToggle />
      <HeadlineReveal />
      <AmbientPause />
      <FilmTour />

      <main id="main-scroll-container" className="relative w-full h-auto bg-[#030303]">
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <HeroGlow />
          <Scene />
        </div>

        <div className="relative z-10 w-full flex flex-col pointer-events-auto">
          <Hero />
          <Teardown />
          <Features />
          <CameraSection />
          <SPenSection />
          <ColorSection />
        </div>
      </main>

      <GalaxyAI />
      <ZoomSection />
      <NightographySection />
      <SteadySection />
      <PrivacySection />
      <ChargeSection />
      <DesignSection />
      <InsideSection />
      <CompareSection />
      <SecuritySection />
      <BuildSection />
      <Specs />

      <SectionCanvas />
    </>
  );
}