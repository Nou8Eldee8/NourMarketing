import bgImage from "../components/bg.jpg"; // Make sure this path is correct

export default function ThankYouPage() {
  return (
    <section className="relative min-h-screen bg-[#0f0215] text-[#fee3d8] px-6 py-24 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Blurry background image */}
      <img
        src={bgImage.src}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl z-0"
      />

      {/* Content on top */}
      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-cocogoose font-bold mb-6">
          Thank You!
        </h1>
        <p className="text-xl md:text-2xl text-[#fee3d8]/90 mb-10 max-w-xl">
          We’ve received your message and will get back to you shortly with your custom strategy.
        </p>
        <a
          href="/"
          className="bg-[#290f4c] hover:bg-[#3a1b63] text-[#fee3d8] px-6 py-3 rounded-full font-semibold transition"
        >
          Back to Homepage
        </a>
      </div>
    </section>
  );
}
