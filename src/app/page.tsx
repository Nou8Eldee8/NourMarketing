"use client";

import Hero from "./components/hero";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import Achievements from "./components/achievement";
import Testimonials from "./components/testi";
import CustomVsPackages from "./components/CustomVsPackages";
import GetYourCustomStrategy from "./components/CTA";
import LiquidEther from '@/components/LiquidEther';
import SuccessPartners from "./components/SuccessPartners";
import Services from "./components/Services";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col text-raisin">
      <div className="absolute inset-0 w-full h-full z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <Hero />

      <Projects />
      <SuccessPartners />
      <Services />
    </main>
  );
}
