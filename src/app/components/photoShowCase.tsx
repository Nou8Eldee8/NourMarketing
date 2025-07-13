"use client";

import React, { useState, useEffect } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoShowCase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    drag: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 1 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 1 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      // Autoplay every 5 seconds
      const interval = setInterval(() => {
        slider.next();
      }, 2000);

      slider.on("destroyed", () => clearInterval(interval));
    },
  });

  const images = [
    "/photos/pic1.jpg",
    "/photos/pic2.jpg",
    "/photos/pic3.jpg",
    "/photos/pic4.jpg",
    "/photos/pic5.jpg",
  ];

  return (
    <section
      className="relative w-full py-20 px-6"
      style={{
        backgroundImage: "url('/clients.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-xl p-6 md:p-10 transition-all duration-300"
          style={{
            WebkitBackdropFilter: "blur(16px)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10">
            Our Photography
          </h2>

          {/* Carousel */}
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="keen-slider__slide flex items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Photo ${idx + 1}`}
                    className="rounded-xl shadow-lg border border-white/20 object-contain max-h-[500px] w-full"
                  />
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md backdrop-blur-lg"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow-md backdrop-blur-lg"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
