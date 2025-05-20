import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedModules } from "@/components/home/FeaturedModules";
import { UserExperience } from "@/components/home/UserExperience";
import { CommunitySection } from "@/components/home/CommunitySection";
import { Newsletter } from "@/components/home/Newsletter";
import { Countdown } from "@/components/home/Countdown";

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4">
        <Hero />
        <FeaturedModules />
        <UserExperience />
        <CommunitySection />
        <Newsletter />
        <Countdown />
      </main>
      <Footer />
    </>
  );
}
