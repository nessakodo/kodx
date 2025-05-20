import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForumPostDetail } from "@/components/forum/ForumPostDetail";
import { ForumSidebar } from "@/components/forum/ForumSidebar";

export default function ForumPostPage() {
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
            <ForumPostDetail />
          </div>
          <div className="md:col-span-1">
            <ForumSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}