import JsonLd from "@/components/JsonLd";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import DisciplineMarquee from "@/components/sections/DisciplineMarquee";
import TheShift from "@/components/sections/TheShift";
import TheGap from "@/components/sections/TheGap";
import WhyNextudy from "@/components/sections/WhyNextudy";
import Programs from "@/components/sections/Programs";
import LearningJourney from "@/components/sections/LearningJourney";
import Mentors from "@/components/sections/Mentors";
import Outcomes from "@/components/sections/Outcomes";
import Testimonials from "@/components/sections/Testimonials";
import LeadCapture from "@/components/sections/LeadCapture";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <DisciplineMarquee />
        <TheShift />
        <TheGap />
        <WhyNextudy />
        <Programs />
        <LearningJourney />
        <Mentors />
        <Outcomes />
        <Testimonials />
        <LeadCapture />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
