"use client";

import SplitText from "@/components/SplitText";
import LiquidEther from '@/components/LiquidEther';
import MagicBento from '@/components/MagicBento'


export default function Services() {

    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center mt-12 mb-12">
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
                text="Wonder what we can do?"
                className="text-4xl font-semibold text-center text-white mt-12"
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
            />

            <MagicBento
                textAutoHide={true}
                enableStars
                enableSpotlight
                enableBorderGlow={true}
                enableTilt
                enableMagnetism
                clickEffect
                spotlightRadius={400}
                particleCount={12}
                glowColor="132, 0, 255"
                disableAnimations={false}
            />

        </section>
    );
}