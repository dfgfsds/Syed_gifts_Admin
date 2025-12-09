import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/sections/HeroSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";

function LandingPageMain() {


  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <HowItWorksSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default LandingPageMain;