import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedModules } from "@/components/home/FeaturedModules";
import { UserExperience } from "@/components/home/UserExperience";
import { LabPreview } from "@/components/home/LabPreview";
import { CommunitySection } from "@/components/home/CommunitySection";
import { Newsletter } from "@/components/home/Newsletter";
import { Countdown } from "@/components/home/Countdown";

export default function Home() {
  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedModules />
        <UserExperience />
        <LabPreview />
        <CommunitySection />
        <Newsletter />
        <Countdown />
      </main>
      <Footer />
    </div>
  );
}
