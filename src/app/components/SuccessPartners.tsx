"use client";

import LogoLoop from '@/components/LogoLoop';
import SplitText from "@/components/SplitText";
import LiquidEther from '@/components/LiquidEther';
import logo1 from "./logos/logo1.png";
import logo2 from "./logos/logo2.png";
import logo3 from "./logos/logo3.png";
import logo4 from "./logos/logo4.png";
import logo5 from "./logos/logo5.png";
import logo6 from "./logos/logo6.png";
import logo7 from "./logos/logo7.png";
import logo8 from "./logos/logo8.png";
import logo9 from "./logos/logo9.png";
import logo10 from "./logos/logo10.png";
import logo11 from "./logos/logo11.png";
import logo12 from "./logos/logo12.png";
import logo13 from "./logos/logo13.png";
import logo14 from "./logos/logo14.png";
import logo15 from "./logos/logo15.png";
// Logo array
const logos = [
    logo1, logo2, logo3, logo4, logo5,
    logo6, logo7, logo8, logo9, logo10,
    logo11, logo12, logo13, logo14, logo15
];

export default function SuccessPartners() {
    return (
        <section className="relative w-full overflow-hidden flex flex-col items-center justify-center py-20">
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
            <SplitText
                onLetterAnimationComplete={null}
                text="Our Success Partners"
                className="text-4xl font-bold text-center mb-16 text-white"
                delay={0.1}
            />
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                {/* @ts-ignore */}
                <LogoLoop
                    logos={logos}
                    speed={50}
                    gap={60}
                    logoHeight={50}
                    width="100%"
                    direction="left"
                    pauseOnHover
                />
            </div>
        </section>
    );
}