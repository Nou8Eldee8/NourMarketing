"use client";

import React from "react";

export default function ClientShowcase() {
  const showControls = true; // Set to false if you want to hide controls

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

      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-xl p-6 transition-all duration-300"
          style={{
            WebkitBackdropFilter: "blur(16px)",
            backdropFilter: "blur(16px)",
          }}
        >
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10">
            See what we did with our partners
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-white/20 bg-white/10 shadow-md"
              >
                <video
                  className="w-full h-auto object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={`/videos/thumb${i}.jpg`}
                  src={`/videos/client${i}.mp4`}
                  {...(showControls && { controls: true })}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
        <div>
                    <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10 mt-10">
You have seen our work one time before, that's 100% granted.          </h2>
        </div>
      </div>
    </section>
  );
}
