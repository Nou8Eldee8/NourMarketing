import Hero from "./components/hero";
import Footer from "./components/Footer";
import OurPartners from "./components/ourpartners";
import Achievements from "./components/achievement";
import Testimonials from "./components/testi";
import CustomVsPackages from "./components/CustomVsPackages";
import GetYourCustomStrategy from "./components/CTA";
export default function Home() {
  return (
<main className="min-h-screen flex flex-col bg-[#0f0215] text-raisin">
      <Hero />
 
            <OurPartners />
            <Achievements />
            <Testimonials />
            <CustomVsPackages />
            <GetYourCustomStrategy />
      <Footer />
    </main>
  );
}
