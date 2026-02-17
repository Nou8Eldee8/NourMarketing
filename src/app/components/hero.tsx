"use client";


import { Tajawal } from "next/font/google";
import BlurText from "@/components/BlurText";
import ShinyText from '@/components/ShinyText';
import Button from "./Button";
import Link from "next/link";


const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function Hero() {


  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <BlurText
        text="We make your content easier."
        delay={200}
        animateBy="words"
        direction="top"
        onAnimationComplete={() => { }}
        className="text-4xl md:text-6xl font-bold text-white mb-8 text-center justify-center"
      />
      <ShinyText
        text="✨ Nour Marketing Agency cures it all."
        speed={2}
        delay={0}
        color="#b5b5b5"
        shineColor="#ffffff"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
      />
      <Button className="mt-8">
        <Link href="/contact">
          Get Started
        </Link>
      </Button>
    </section>
  );
}