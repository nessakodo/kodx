import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LabDetail } from "@/components/labs/LabDetail";

export default function LabPage() {
  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <LabDetail />
      <Footer />
    </div>
  );
}
