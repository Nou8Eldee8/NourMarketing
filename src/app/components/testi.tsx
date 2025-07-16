"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// لوجوهات العملاء
import logo1 from "./logos/logo1.png"; // عم بقالي (Uncle Ba'ali)
import logo2 from "./logos/logo2.png"; // Nano Stores
import logo3 from "./logos/logo7.png"; // SkyGate Innovations

const testimonials = [
  {
    name: "Hossam Youssef",
    title: "Owner, Uncle Ba'ali",
    text: "We did halal magic, thanks to Nour and his team.",
    logo: logo1,
  },
  {
    name: "Yasser Haiba",
    title: "CEO, Nano Stores",
    text: "They always offer us the best service, it's worth more than we pay really.",
    logo: logo2,
  },
  {
    name: "Mohamed Afifi",
    title: "CEO, SkyGate Innovations",
    text: "We saw the difference once we started working on our ads.",
    logo: logo3,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0f0215] py-20 px-4 text-[#fee3d8]">
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-cocogoose font-bold">
          What Our Clients Say
        </h2>
        <p className="text-lg md:text-xl text-[#fee3d8]/80">
          We take pride in delivering real value – here’s what our clients think.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 px-2">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="w-[300px] md:w-[350px] rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg p-6 shadow-inner text-left space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 relative rounded-full overflow-hidden bg-[#290f4c]">
                <Image
                  src={item.logo}
                  alt={`${item.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-[#fee3d8]">{item.name}</p>
                <p className="text-sm text-[#fee3d8]/80">{item.title}</p>
              </div>
            </div>
            <p className="text-md text-[#fee3d8]">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
