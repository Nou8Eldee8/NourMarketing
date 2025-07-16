"use client";

import { motion } from "framer-motion";

export default function CustomVsPackages() {
  return (
    <section className="w-full py-24 px-6 bg-[#0f0215] text-[#fee3d8]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-cocogoose font-bold">
            Why Custom Beats Packages
          </h2>
          <p
            className="text-xl text-[#fee3d8]/80"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Tailored strategies. Real impact. No fluff.
          </p>
        </div>

        {/* Comparison Box */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Packages */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-inner"
          >
            <h3 className="text-2xl font-bold text-[#fee3d8] mb-4">Generic Packages</h3>
            <ul className="space-y-3 text-[#fee3d8]/90 list-disc list-inside">
              <li>One-size-fits-all approach</li>
              <li>Often includes things you don’t need</li>
              <li>Misses key brand nuances</li>
              <li>Easy to sell. Hard to make work.</li>
            </ul>
          </motion.div>

          {/* Custom Strategy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#290f4c]/60 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-inner"
          >
            <h3 className="text-2xl font-bold text-[#fee3d8] mb-4">Tailored Strategy</h3>
            <ul className="space-y-3 text-[#fee3d8]/90 list-disc list-inside">
              <li>We build it around your goals & audience</li>
              <li>Focuses budget where it really matters</li>
              <li>Driven by insights, not templates</li>
              <li>Results that actually make sense</li>
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg font-semibold">
            Every business is different — so why should the marketing be the same?
          </p>
          <p
            className="text-3xl mt-4 text-[#fee3d8]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Let’s build something that works for you.
          </p>
        </div>
      </div>
    </section>
  );
}
