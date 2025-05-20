import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Filter, Search, PenLine, MessageSquare } from "lucide-react";

export default function ForumPage() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "question"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/forum-posts"],
  });

  // Filter posts based on search query and category filter
  const filteredPosts = posts?.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/forum-posts", newPost);
      
      toast({
        title: "Post created!",
        description: "Your forum post has been published successfully.",
      });
      
      // Reset form and hide it
      setNewPost({
        title: "",
        content: "",
        category: "question"
      });
      setShowNewPostForm(false);
      
      // Refresh posts list
      queryClient.invalidateQueries({ queryKey: ["/api/forum-posts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl md:text-4xl tracking-wider mb-4 text-center uppercase">
            <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent drop-shadow-glow">
              KODΞX
            </span> Forum
          </h1>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-8">
            Share insights, ask questions, and contribute to a mindful community of security-focused developers.
          </p>

          {/* Search, filters and new post button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search forum..."
                className="pl-10 bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === "question" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === "question" ? null : "question")}
                className={`${
                  categoryFilter === "question" 
                    ? "bg-gradient-to-r from-[#9ecfff]/20 to-[#9ecfff]/20 border-[#9ecfff]/40" 
                    : "border-[#9ecfff]/20"
                }`}
              >
                Questions
              </Button>
              <Button
                variant={categoryFilter === "devlog" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === "devlog" ? null : "devlog")}
                className={`${
                  categoryFilter === "devlog" 
                    ? "bg-gradient-to-r from-[#b166ff]/20 to-[#9ecfff]/20 border-[#b166ff]/40" 
                    : "border-[#9ecfff]/20"
                }`}
              >
                Devlogs
              </Button>
              <Button
                variant={categoryFilter === "announcement" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(categoryFilter === "announcement" ? null : "announcement")}
                className={`${
                  categoryFilter === "announcement" 
                    ? "bg-gradient-to-r from-[#88c9b7]/20 to-[#88c9b7]/20 border-[#88c9b7]/40" 
                    : "border-[#9ecfff]/20"
                }`}
              >
                Announcements
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter(null);
                }}
                className="border border-[#9ecfff]/20"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Create new post button */}
          <div className="mb-8 flex justify-end">
            {isAuthenticated ? (
              <Button 
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
              >
                <PenLine className="mr-2 h-4 w-4" />
                {showNewPostForm ? "Cancel" : "Create New Post"}
              </Button>
            ) : (
              <Button asChild>
                <a href="/api/login">Sign In to Post</a>
              </Button>
            )}
          </div>
          
          {/* New Post Form */}
          {showNewPostForm && (
            <GlassmorphicCard className="mb-8">
              <div className="p-6">
                <h3 className="font-orbitron text-xl mb-6">Create New Post</h3>
                <form onSubmit={handleNewPostSubmit}>
                  <div className="mb-4">
                    <label htmlFor="post-title" className="block text-sm font-medium mb-2">
                      Post Title
                    </label>
                    <Input
                      id="post-title"
                      placeholder="Enter a descriptive title"
                      className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="post-content" className="block text-sm font-medium mb-2">
                      Post Content
                    </label>
                    <Textarea
                      id="post-content"
                      placeholder="Enter your post content..."
                      className="min-h-[200px] bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <Badge
                        onClick={() => setNewPost({ ...newPost, category: "question" })}
                        className={`cursor-pointer px-3 py-1.5 text-sm ${
                          newPost.category === "question" 
                            ? "bg-[#9ecfff]/10 border-[#9ecfff]/40" 
                            : "bg-[#1e2535]/50 border-[#9ecfff]/20 hover:bg-[#1e2535]/80"
                        }`}
                      >
                        Question
                      </Badge>
                      <Badge
                        onClick={() => setNewPost({ ...newPost, category: "devlog" })}
                        className={`cursor-pointer px-3 py-1.5 text-sm ${
                          newPost.category === "devlog" 
                            ? "bg-[#b166ff]/10 border-[#b166ff]/40" 
                            : "bg-[#1e2535]/50 border-[#9ecfff]/20 hover:bg-[#1e2535]/80"
                        }`}
                      >
                        Devlog
                      </Badge>
                      {user?.role === "admin" && (
                        <Badge
                          onClick={() => setNewPost({ ...newPost, category: "announcement" })}
                          className={`cursor-pointer px-3 py-1.5 text-sm ${
                            newPost.category === "announcement" 
                              ? "bg-[#88c9b7]/10 border-[#88c9b7]/40" 
                              : "bg-[#1e2535]/50 border-[#9ecfff]/20 hover:bg-[#1e2535]/80"
                          }`}
                        >
                          Announcement
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post to Forum"}
                    </Button>
                  </div>
                </form>
              </div>
            </GlassmorphicCard>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: any) => (
              <ForumPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#1e2535]/25 backdrop-blur-md border border-[#9ecfff]/10 rounded-xl">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-orbitron mb-2">No Posts Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter 
                ? "Try adjusting your search or filters" 
                : "Be the first to start a discussion!"}
            </p>
            {(searchQuery || categoryFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter(null);
                }}
                className="mr-4"
              >
                Clear Filters
              </Button>
            )}
            {isAuthenticated && !showNewPostForm && (
              <Button 
                onClick={() => setShowNewPostForm(true)}
                className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
              >
                Create Post
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
