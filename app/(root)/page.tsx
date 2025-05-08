import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";
import AboveFooter from "@/components/AboveFooter";

export default function Home() {
  return (
    <>
      <div>
        <HeroSection />
        <Features />
        <Testimonial />
      </div>
      <AboveFooter />
    </>
  );
}
