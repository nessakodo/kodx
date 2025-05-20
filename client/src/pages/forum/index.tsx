import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import { MOCK_FORUM_POSTS } from "@/lib/mockData";
import { useEffect } from "react";

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Prefill the query cache with mock data
  useEffect(() => {
    if (!queryClient.getQueryData(["/api/forum-posts"])) {
      queryClient.setQueryData(["/api/forum-posts"], MOCK_FORUM_POSTS);
    }
  }, [queryClient]);
  
  // Fetch all forum posts
  const { data: forumPosts, isLoading, error } = useQuery({
    queryKey: ["/api/forum-posts"],
  });
  
  // Use mock data when real data is not available
  const displayPosts = forumPosts || MOCK_FORUM_POSTS;
  
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="font-orbitron text-3xl tracking-wider mb-2">
              <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Community</span> Forum
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Connect with other members of the KODEX community to share ideas, ask questions, and showcase your work.
            </p>
          </div>
          
          {isAuthenticated && (
            <Button className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30">
              <Plus className="h-4 w-4 mr-2" /> Create Post
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-3 bg-[#1e2535]/30 p-6 rounded-lg border border-[#9ecfff]/10">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 mx-auto text-[#ff5c5c] mb-6" />
            <h2 className="text-2xl font-orbitron mb-4">Failed to Load Forum</h2>
            <p className="text-gray-500 mb-8">There was an error loading the forum posts. Please try again later.</p>
          </div>
        ) : displayPosts.length > 0 ? (
          <div className="space-y-6">
            {displayPosts.map((post: any) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-orbitron mb-4">No Posts Yet</h2>
            <p className="text-gray-500 mb-8">Be the first to start a discussion in the community.</p>
            {isAuthenticated && (
              <Button className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30">
                <Plus className="h-4 w-4 mr-2" /> Create Post
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}