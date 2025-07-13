"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import bgImage from "./gradient.jpg";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Logos (15)
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

// Skills
const skills = [
  { name: "Strategy", level: 90 },
  { name: "Content Creation", level: 100 },
  { name: "Social Media Ads", level: 95 },
  { name: "Branding", level: 70 },
];

export default function OurPartnersAndSkills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      className="w-full py-20 px-4 md:px-8 text-[#fee3d8]"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Partner Logos */}
        <div>
          <h2 className="text-center text-3xl md:text-4xl font-cocogoose mb-10">
            Our Featured Clients
          </h2>
          <div className="rounded-3xl overflow-hidden border border-white/40 bg-white/10 backdrop-blur-lg py-5 shadow-inner">
            <Marquee gradient={true} gradientColor={[255, 255, 255]} speed={40}>
              {logos.map((logo, idx) => (
                <div
                  key={idx}
                  className="mx-6 flex items-center opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <Image
                    src={logo}
                    alt={`Partner logo ${idx + 1}`}
                    className="h-12 w-auto object-contain transition-transform hover:scale-110 duration-300"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-cocogoose leading-tight mb-6">
              What We’re <br />
              <span className="font-black text-[#fee3d8]">Great At</span>
            </h2>
            <p
              className="text-white text-3xl"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              We blend design, strategy, and <br />
              innovation to grow your audience and impact.
            </p>
          </div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="rounded-3xl border border-white/30 bg-black/30 backdrop-blur-md p-8 shadow-xl space-y-6"
          >
            {skills.map((skill, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <div className="text-lg font-semibold mb-1">{skill.name}</div>
                <div className="w-full h-4 bg-[#fee3d8] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#290f4c] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.3 + idx * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease forwards;
        }
      `}</style>
    </section>
  );
}
