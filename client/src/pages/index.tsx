import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedModules } from "@/components/home/FeaturedModules";
import { UserExperience } from "@/components/home/UserExperience";
import { LabPreview } from "@/components/home/LabPreview";
import { CommunitySection } from "@/components/home/CommunitySection";
import { Newsletter } from "@/components/home/Newsletter";
import { Countdown } from "@/components/home/Countdown";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <main>
        <Hero />
        
        <Container>
          <FeaturedModules />
          <UserExperience />
          <LabPreview />
          <CommunitySection />
          
          <div className="grid grid-cols-1 gap-12 my-12">
            <Newsletter />
            <Countdown />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
