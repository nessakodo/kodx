import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";

export default function ProjectPage() {
  // Extract the project ID from the URL
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id;

  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <main className="pb-16">
        <ProjectDetail />
      </main>
      <Footer />
    </div>
  );
}