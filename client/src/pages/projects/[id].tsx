import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export default function ProjectPage() {
  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <ProjectDetail />
      <Footer />
    </div>
  );
}
