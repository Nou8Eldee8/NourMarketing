"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GetYourCustomStrategy() {
  return (
    <section className="w-full py-24 px-6 bg-[#0f0215] text-[#fee3d8] rounded-t-3xl">
      <div className="max-w-5xl mx-auto text-center space-y-10">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-cocogoose font-bold"
        >
          Ready to Ditch the Templates?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-[#fee3d8]/90"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Let’s build a strategy tailored just for you — and nothing less.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            href="/contact"
            className="inline-block bg-[#250d3f] text-raisin text-lg font-bold py-4 px-8 rounded-full transition hover:bg-[#8C93A8] hover:text-white"
          >
            Get Your Custom Strategy
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
