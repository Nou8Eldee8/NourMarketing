"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import bgImage from "./gradient.jpg";
import customer from "./pngs/customer.png";
import medal from "./pngs/medal.png";
import marketing from "./pngs/marketing.png";
import eye from "./pngs/eye.png";

export default function Achievements() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      className="w-full py-20 px-4 md:px-8 text-[#fee3d8]"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto flex flex-col items-center gap-16"
      >
        {/* Header Box */}
        <div
          className="flex flex-col md:flex-row items-center gap-6 md:gap-10 px-8 py-8 rounded-3xl border border-white/40 backdrop-blur-lg shadow-inner"
          style={{
            background: "linear-gradient(to right, rgba(255,255,255,0.6), rgba(0,0,0,0.4))",
          }}
        >
          <img
            src={medal.src}
            className="w-28 md:w-32 flex-shrink-0"
            alt="Medal Icon"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-cocogoose leading-tight text-[#fee3d8]">
              What we've achieved
            </h2>
            <p
              className="mt-2 text-xl md:text-7xl text-[#fee3d8]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              in just 2 years of work.
            </p>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {[
            {
              img: eye,
              label: "109M",
              subtext: "Views that made an impact.",
            },
            {
              img: marketing,
              label: "73",
              subtext: "Campaigns. Every One a Win.",
            },
            {
              img: customer,
              label: "22",
              subtext: "Clients Growing With Us",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-36 aspect-square flex flex-col justify-center items-center text-center rounded-3xl border border-white/40 bg-black/60 backdrop-blur-lg shadow-inner"
            >
              <img src={item.img.src} alt="Icon" className="h-12 w-auto mb-2" />
              <p
                className="text-xl font-bold text-[#fee3d8]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {item.label}
              </p>
              <p className="text-xs text-[#fee3d8]">{item.subtext}</p>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-center text-xl font-bold text-[#fee3d8] max-w-2xl">
          Numbers that reflect our commitment to results — not just promises.
        </p>
      </motion.div>
    </section>
  );
}
