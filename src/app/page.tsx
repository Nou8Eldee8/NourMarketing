import Hero from "./components/hero";
import Footer from "./components/Footer";
import OurPartners from "./components/ourpartners";
import ClientShowcase from "./components/ClientShowcase";
import PhotoShowCase from "./components/photoShowCase";
import Achievements from "./components/achievement";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-raisin">
      <Hero />
 
            <OurPartners />
            <Achievements />
      <Footer />
    </main>
  );
}
