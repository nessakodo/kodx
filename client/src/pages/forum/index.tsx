import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, SearchIcon, FilterIcon } from "lucide-react";
import { MOCK_FORUM_POSTS } from "@/lib/mockData";
import { useEffect, useState } from "react";

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
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
  const allPosts = forumPosts || MOCK_FORUM_POSTS;
  
  // Filter posts based on search term and category
  const filteredPosts = allPosts.filter((post: any) => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "" || categoryFilter === "all" || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(allPosts.map((post: any) => post.category)));
  
  // Get category badge style
  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'discussion':
        return {
          gradient: "from-[#1e293b] to-[#1e293b]",
          border: "border-[#9ecfff]/30",
          text: "text-[#9ecfff]"
        };
      case 'resources':
        return {
          gradient: "from-[#1e293b] to-[#1e293b]",
          border: "border-[#88c9b7]/30",
          text: "text-[#88c9b7]"
        };
      case 'showcase':
        return {
          gradient: "from-[#1e293b] to-[#1e293b]",
          border: "border-[#b166ff]/30",
          text: "text-[#b166ff]"
        };
      case 'announcement':
        return {
          gradient: "from-[#1e293b] to-[#1e293b]",
          border: "border-[#d4af37]/30",
          text: "text-[#d4af37]"
        };
      default:
        return {
          gradient: "from-[#1e293b] to-[#1e293b]",
          border: "border-gray-500/30",
          text: "text-gray-400"
        };
    }
  };
  
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="font-orbitron text-3xl tracking-wider mb-2">
              <span className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">Community</span> Forum
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Connect with other members of the KODEX community to share ideas, ask questions, and showcase your work.
            </p>
          </div>
          
          {isAuthenticated && (
            <Button className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Post
            </Button>
          )}
        </div>
        
        {/* Search and Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
                />
              </div>
              <div className="w-full sm:w-40 flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-gray-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e2535] border-[#1e2535]">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: string) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(searchTerm || categoryFilter) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge 
                      className="flex items-center gap-1 bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20"
                      onClick={() => setSearchTerm("")}
                    >
                      Search: {searchTerm}
                      <span className="cursor-pointer">×</span>
                    </Badge>
                  )}
                  {categoryFilter && (
                    <Badge 
                      className="flex items-center gap-1 bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20"
                      onClick={() => setCategoryFilter("")}
                    >
                      Category: {categoryFilter}
                      <span className="cursor-pointer">×</span>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          
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
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post: any) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-orbitron mb-4">No Posts Found</h2>
              <p className="text-gray-500 mb-8">
                {searchTerm || categoryFilter ? 
                  "No posts match your current filters. Try adjusting your search criteria." : 
                  "Be the first to start a discussion in the community."}
              </p>
              {isAuthenticated && !searchTerm && !categoryFilter && (
                <Button className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Create Post
                </Button>
              )}
            </div>
          )}
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ForumSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}