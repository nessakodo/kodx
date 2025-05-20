import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { MOCK_FORUM_POSTS } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Newsletter } from "@/components/home/Newsletter";
import { Countdown } from "@/components/home/Countdown";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, FilterIcon, BellIcon, PinIcon } from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profileImageUrl?: string;
    totalXp?: number;
    isAdmin?: boolean;
  };
  commentsCount?: number;
  isPinned?: boolean;
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<ForumPost[]>([]);
  
  // Add some admin and pinned posts to mock data
  useEffect(() => {
    const updatedPosts: ForumPost[] = [
      {
        id: 101,
        title: "Welcome to the KOD-X WORLD Community!",
        content: "A friendly introduction to our community guidelines and forum features...",
        category: "announcement",
        likes: 42,
        createdAt: "2025-05-01T09:00:00Z",
        user: {
          id: "admin-1",
          username: "KodexAdmin",
          profileImageUrl: "https://ui-avatars.com/api/?name=Kodex+Admin&background=bb86fc&color=fff",
          totalXp: 9000,
          isAdmin: true
        },
        commentsCount: 15,
        isPinned: true
      },
      {
        id: 102,
        title: "May Zen Update: Meditation Features Coming Soon",
        content: "We're excited to announce our new meditation features launching next month...",
        category: "update",
        likes: 37,
        createdAt: "2025-05-15T14:30:00Z",
        user: {
          id: "admin-2",
          username: "ZenMaster",
          profileImageUrl: "https://ui-avatars.com/api/?name=Zen+Master&background=bb86fc&color=fff",
          totalXp: 8500,
          isAdmin: true
        },
        commentsCount: 23,
        isPinned: true
      },
      ...MOCK_FORUM_POSTS as any[]
    ];
    
    // Set pinned posts as featured
    setFeaturedPosts(updatedPosts.filter(post => post.isPinned));
    setForumPosts(updatedPosts);
  }, []);
  
  // Filter posts based on search query and category
  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory && selectedCategory !== "all" ? post.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(forumPosts.map(post => post.category)));
  
  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <Container>
        <main className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="font-orbitron text-3xl text-white mb-4 md:mb-0">Community Forum</h1>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-60">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0f172a]/70 border border-[#1e293b] text-white"
                />
              </div>
              
              <div className="w-40">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-[#0f172a]/70 border border-[#1e293b] text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border border-[#1e293b] text-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {filteredPosts.length === 0 ? (
                <GlassmorphicCard className="p-6 text-center">
                  <p className="text-gray-400">No posts found. Try adjusting your search criteria.</p>
                </GlassmorphicCard>
              ) : (
                filteredPosts.map(post => (
                  <ForumPostCard 
                    key={post.id} 
                    post={post as any} 
                    className={post.user.isAdmin ? "border-[#bb86fc]/30 shadow-[0_0_15px_rgba(187,134,252,0.1)]" : ""}
                  />
                ))
              )}
            </div>
            
            <div className="space-y-6">
              {/* Newsletter Section */}
              <GlassmorphicCard className="p-6 space-y-4">
                <h3 className="font-orbitron text-xl text-white">Join Our Newsletter</h3>
                <p className="text-gray-400 text-sm">
                  Stay updated with the latest cybersecurity insights, KOD-X WORLD updates, and tech wisdom delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-[#0f172a]/70 border border-[#1e293b] text-white"
                  />
                  <button 
                    className="w-full py-2 px-4 rounded-md bg-[#bb86fc]/10 text-[#bb86fc] border border-[#bb86fc]/30 hover:bg-[#bb86fc]/20 transition-colors"
                    type="button"
                  >
                    Subscribe
                  </button>
                </form>
              </GlassmorphicCard>
              
              {/* Featured Posts */}
              <GlassmorphicCard className="p-6 space-y-4">
                <h3 className="font-orbitron text-xl text-white flex items-center gap-2">
                  <PinIcon className="h-4 w-4 text-[#bb86fc]" /> Pinned Posts
                </h3>
                <div className="space-y-3">
                  {featuredPosts.map(post => (
                    <a 
                      key={post.id} 
                      href={`/forum/${post.id}`} 
                      className="block p-3 rounded-md bg-[#1e293b]/30 hover:bg-[#1e293b]/50 transition-colors border border-[#1e293b] hover:border-[#bb86fc]/30"
                    >
                      <div className="flex items-start gap-3">
                        <Badge className="bg-[#bb86fc]/10 text-[#bb86fc] border border-[#bb86fc]/30 flex-shrink-0 mt-1">
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </Badge>
                        <div>
                          <h4 className="text-white font-medium mb-1">{post.title}</h4>
                          <div className="text-xs text-gray-400">
                            By {post.user.username} • {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </GlassmorphicCard>
              
              {/* Countdown */}
              <GlassmorphicCard className="p-6 space-y-4">
                <h3 className="font-orbitron text-xl text-white">Next Content Drop</h3>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-mono text-[#9ecfff] font-bold my-2">
                    11:23:45:09
                  </div>
                  <div className="grid grid-cols-4 w-full gap-1 text-center text-xs text-gray-400">
                    <div>DAYS</div>
                    <div>HRS</div>
                    <div>MIN</div>
                    <div>SEC</div>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-400">
                    New labs, projects and community challenges dropping soon!
                  </p>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </main>
      </Container>
      <Footer />
    </div>
  );
}