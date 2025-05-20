import { LabDetail } from "@/components/labs/LabDetail";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";

export default function LabPage() {
  // Extract the lab ID from the URL
  const [, params] = useRoute("/labs/:id");
  const labId = params?.id;

  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <main className="pb-16">
        <LabDetail />
      </main>
      <Footer />
    </div>
  );
}