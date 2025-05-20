import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForumPostDetail } from "@/components/forum/ForumPostDetail";

export default function ForumPostPage() {
  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <ForumPostDetail />
      <Footer />
    </div>
  );
}
