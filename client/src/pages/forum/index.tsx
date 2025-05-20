import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Footer } from "@/components/layout/Footer";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, SearchIcon, FilterIcon, Bookmark, BookmarkCheck } from "lucide-react";
import { MOCK_FORUM_POSTS } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { KodexModal } from "@/components/ui/kodex-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ForumPage() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  
  // State for creating new posts
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "discussion"
  });
  
  // State for post drafts
  const [drafts, setDrafts] = useState<any[]>(() => {
    // Load drafts from localStorage if available
    const savedDrafts = localStorage.getItem('forum_drafts');
    return savedDrafts ? JSON.parse(savedDrafts) : [];
  });
  const [selectedDraft, setSelectedDraft] = useState<number | null>(null);
  
  // State for saving posts
  const [savedPosts, setSavedPosts] = useState<number[]>(() => {
    // Load saved posts from localStorage if available
    const saved = localStorage.getItem('saved_posts');
    return saved ? JSON.parse(saved) : [];
  });
  
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
  
  // Save draft to localStorage
  const saveDraft = () => {
    if (!newPost.title.trim() && !newPost.content.trim()) {
      toast({
        title: "Empty Draft",
        description: "Cannot save an empty draft",
        variant: "destructive"
      });
      return;
    }
    
    const timestamp = new Date().toISOString();
    const draft = {
      id: selectedDraft !== null ? drafts[selectedDraft].id : Date.now(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      createdAt: selectedDraft !== null ? drafts[selectedDraft].createdAt : timestamp,
      updatedAt: timestamp
    };
    
    let updatedDrafts;
    if (selectedDraft !== null) {
      // Update existing draft
      updatedDrafts = [...drafts];
      updatedDrafts[selectedDraft] = draft;
    } else {
      // Add new draft
      updatedDrafts = [draft, ...drafts];
    }
    
    setDrafts(updatedDrafts);
    localStorage.setItem('forum_drafts', JSON.stringify(updatedDrafts));
    
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved successfully",
    });
    
    if (selectedDraft === null) {
      // Reset form for new draft
      setNewPost({
        title: "",
        content: "",
        category: "discussion"
      });
    }
    
    setSelectedDraft(null);
  };
  
  // Load a draft for editing
  const loadDraft = (index: number) => {
    const draft = drafts[index];
    setNewPost({
      title: draft.title,
      content: draft.content,
      category: draft.category
    });
    setSelectedDraft(index);
    setIsDraftsModalOpen(false);
    setIsCreatePostModalOpen(true);
  };
  
  // Delete a draft
  const deleteDraft = (index: number) => {
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
    localStorage.setItem('forum_drafts', JSON.stringify(updatedDrafts));
    
    if (selectedDraft === index) {
      setSelectedDraft(null);
    } else if (selectedDraft !== null && selectedDraft > index) {
      setSelectedDraft(selectedDraft - 1);
    }
    
    toast({
      title: "Draft Deleted",
      description: "Your draft has been deleted",
    });
  };
  
  // Handle creating a new forum post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real implementation, this would call the API
      const newPostId = Math.max(...allPosts.map((post: any) => post.id), 0) + 1;
      const createdPost = {
        id: newPostId,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        likes: 0,
        createdAt: new Date().toISOString(),
        user: {
          id: user?.id || "guest",
          username: user?.firstName || "Anonymous",
          profileImageUrl: user?.profileImageUrl
        },
        commentsCount: 0,
        comments: []
      };
      
      // Add to local data
      const updatedPosts = [createdPost, ...allPosts];
      queryClient.setQueryData(["/api/forum-posts"], updatedPosts);
      
      // If this was a draft, remove it from drafts
      if (selectedDraft !== null) {
        deleteDraft(selectedDraft);
      }
      
      // Reset form and close modal
      setNewPost({
        title: "",
        content: "",
        category: "discussion"
      });
      setIsCreatePostModalOpen(false);
      setSelectedDraft(null);
      
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Toggle saving a post for later
  const toggleSavePost = (postId: number) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
      toast({
        title: "Post Unsaved",
        description: "Post removed from your saved items"
      });
    } else {
      setSavedPosts([...savedPosts, postId]);
      toast({
        title: "Post Saved",
        description: "Post added to your saved items"
      });
    }
  };
  
  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className="min-h-screen">
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
            <div className="flex gap-2">
              <Button 
                className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white hover-glow"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Create Post
              </Button>
              <Button 
                className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#b166ff]/20 hover:border-[#b166ff]/40 text-white hover-glow"
                onClick={() => setIsDraftsModalOpen(true)}
              >
                <Bookmark className="h-4 w-4 mr-2" /> My Drafts {drafts.length > 0 && 
                  <span className="bg-[#b166ff]/30 text-xs font-semibold px-1.5 py-0.5 rounded-full ml-1">
                    {drafts.length}
                  </span>
                }
              </Button>
            </div>
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
                  {categoryFilter && categoryFilter !== "all" && (
                    <Badge 
                      className={`flex items-center gap-1 bg-[#1e2535]/70 hover:bg-[#1e2535] ${getCategoryStyle(categoryFilter).border} ${getCategoryStyle(categoryFilter).text}`}
                      onClick={() => setCategoryFilter("")}
                    >
                      Category: {categoryFilter}
                      <span className="cursor-pointer ml-1">×</span>
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
                <Button 
                  className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white hover-glow"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
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
      
      {/* Create Post Modal */}
      <KodexModal
        isOpen={isCreatePostModalOpen}
        onClose={() => {
          // Prompt to save draft if there's unsaved content
          if ((newPost.title.trim() || newPost.content.trim()) && 
              window.confirm("Save your draft before closing?")) {
            saveDraft();
          }
          setIsCreatePostModalOpen(false);
          setSelectedDraft(null);
        }}
        title={selectedDraft !== null ? "Edit Draft" : "Create New Post"}
        size="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <Input
              id="title"
              placeholder="Enter a title for your post"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <Select 
              value={newPost.category}
              onValueChange={(value) => setNewPost({ ...newPost, category: value })}
            >
              <SelectTrigger className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e2535] border-[#1e2535]">
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="resources">Resources</SelectItem>
                <SelectItem value="showcase">Showcase</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content</label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-xs text-[#9ecfff] hover:text-[#b166ff]"
                onClick={() => {
                  // Simulate importing user notes (in a real app, this would fetch from the user's notes)
                  const userNotes = [
                    { id: 1, title: "Cybersecurity Best Practices", content: "1. Use strong, unique passwords\n2. Enable two-factor authentication\n3. Keep software updated\n4. Be cautious of phishing attempts" },
                    { id: 2, title: "Privacy Tools Research", content: "Recommended privacy tools:\n- Signal for messaging\n- Brave for web browsing\n- Proton Mail for email\n- Bitwarden for password management" }
                  ];
                  
                  // In a real implementation, show a modal to select which notes to import
                  // For this demo, just import the first note
                  const selectedNote = userNotes[0];
                  
                  setNewPost(prev => ({
                    ...prev,
                    content: prev.content ? 
                      `${prev.content}\n\n--- Imported from my notes: ${selectedNote.title} ---\n\n${selectedNote.content}` :
                      `--- Imported from my notes: ${selectedNote.title} ---\n\n${selectedNote.content}`
                  }));
                  
                  toast({
                    title: "Notes Imported",
                    description: `Added content from "${selectedNote.title}"`,
                  });
                }}
              >
                Import from My Notes
              </Button>
            </div>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50 min-h-[250px]"
            />
          </div>
          
          <div className="flex justify-between gap-3 pt-4">
            <Button 
              type="button"
              onClick={saveDraft}
              className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#b166ff]/20 hover:border-[#b166ff]/40 text-white hover-glow"
            >
              {selectedDraft !== null ? "Update Draft" : "Save as Draft"}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setIsCreatePostModalOpen(false)}
                className="border-[#1e2535] hover:bg-[#1e2535]/50 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white hover-glow"
              >
                Publish Post
              </Button>
            </div>
          </div>
        </form>
      </KodexModal>
      
      {/* Drafts Modal */}
      <KodexModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        title="My Drafts"
      >
        {drafts.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#1e2535]/70 mb-4">
              <Bookmark className="h-8 w-8 text-[#b166ff]" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Drafts Found</h3>
            <p className="text-gray-400 mb-4">You haven't saved any drafts yet.</p>
            <Button
              onClick={() => {
                setIsDraftsModalOpen(false);
                setIsCreatePostModalOpen(true);
              }}
              className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white hover-glow"
            >
              Create New Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-auto">
            {drafts.map((draft, index) => (
              <div key={draft.id} className="bg-[#1e2535]/50 border border-[#1e2535] rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium truncate">{draft.title || "Untitled Draft"}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-[#9ecfff]"
                      onClick={() => loadDraft(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        <path d="m15 5 4 4"></path>
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-[#ff5c5c]"
                      onClick={() => deleteDraft(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{draft.content || "No content"}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-full bg-[#1e2535] text-[#b166ff] border border-[#b166ff]/20">
                    {draft.category}
                  </span>
                  <span>{new Date(draft.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </KodexModal>
      
      {/* Pagination */}
      {filteredPosts.length > postsPerPage && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`h-8 w-8 p-0 ${
                currentPage === index + 1
                  ? "bg-[#1e2535] border border-[#9ecfff]/40 text-[#9ecfff]"
                  : "bg-[#1e2535]/30 hover:bg-[#1e2535]/50 text-gray-400"
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}