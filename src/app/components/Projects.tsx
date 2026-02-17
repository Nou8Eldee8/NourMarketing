import SplitText from "@/components/SplitText";
import LiquidEther from '@/components/LiquidEther';
import InstagramEmbed from "@/components/InstagramEmbed";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function Projects() {

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center ">
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
      <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <SplitText
            text="Listen to what our clients say!"
            className="text-4xl md:text-5xl font-bold text-white mb-8 relative z-10"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
          />
          <p className="text-white text-lg md:text-xl max-w-md mt-4 relative z-10">
            Discover how we help brands grow and engage with their audience effectively.
          </p>
        </div>

        {/* Right Column: Carousel */}
        <div className="w-full flex justify-center lg:justify-end">
          <Carousel />
        </div>
      </div>
    </section>
  );
}

function Carousel() {
  const reels = [
    "https://www.instagram.com/reel/DMOSOYloS_r/?utm_source=ig_embed&amp;utm_campaign=loading",
    "https://www.instagram.com/reel/DKLEsShPG2O/",
    "https://www.instagram.com/reel/DO9dsjOgMlp/",
    "https://www.instagram.com/reel/DSVPqBkjAUd/"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-0 md:-left-12 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all pointer-events-auto"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Carousel Viewport */}
      <div className="w-full max-w-[320px] md:max-w-[480px] overflow-hidden rounded-3xl relative aspect-[9/16] bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <InstagramEmbed url={reels[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-0 md:-right-12 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all pointer-events-auto"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute -bottom-10 flex gap-2">
        {reels.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${currentIndex === index ? "bg-white w-6" : "bg-white/30"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
