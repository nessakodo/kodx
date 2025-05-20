import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon, Save, EyeIcon, PenIcon, TagIcon, Plus, X } from "lucide-react";
import { FORUM_CATEGORIES } from "@/lib/mockData";

export default function CreatePostPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [newTag, setNewTag] = useState("");
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  // Auto-save draft
  const DRAFT_KEY = "forum_post_draft";
  
  useEffect(() => {
    // Load draft on mount
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setCategory(draft.category || "");
        setTags(draft.tags || []);
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);
  
  useEffect(() => {
    // Auto-save draft every 5 seconds if there's content
    const intervalId = setInterval(() => {
      if (title || content || category || tags.length > 0) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, category, tags }));
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [title, content, category, tags]);
  
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setContent("");
    setCategory("");
    setTags([]);
  };
  
  const handleTagAdd = () => {
    if (!newTag.trim()) return;
    
    // Format tag with # if not present
    let formattedTag = newTag.trim();
    if (!formattedTag.startsWith('#')) {
      formattedTag = `#${formattedTag}`;
    }
    
    // Prevent duplicates
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
    
    setNewTag("");
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields (title, content, and category).",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create post
      const response = await apiRequest("POST", "/api/forum-posts", {
        title,
        content,
        category,
        tags
      });
      
      // Clear draft after successful submission
      clearDraft();
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      
      // Redirect to post
      setLocation(`/forum/post/${response.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categoriesObj = FORUM_CATEGORIES as Record<string, { label: string; color: string; route: string }>;
  const categories = Object.keys(categoriesObj);
  
  // Get category styling for preview
  const getCategoryStyle = (cat: string) => {
    if (!cat || !categoriesObj[cat]) return {
      color: "#9ca3af",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20"
    };
    
    return {
      color: categoriesObj[cat].color,
      bg: `bg-[${categoriesObj[cat].color}]/10`,
      border: `border-[${categoriesObj[cat].color}]/30`
    };
  };
  
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Link href="/forum" className="inline-flex items-center text-[#9ecfff] hover:underline mb-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Forum
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-orbitron text-2xl tracking-wider">
                <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Create</span> Post
              </h1>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDraft}
                  className="text-gray-400 border-gray-700"
                >
                  Clear Draft
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, category, tags }));
                    toast({
                      title: "Draft saved",
                      description: "Your post draft has been saved locally.",
                    });
                  }}
                  className="text-[#9ecfff] border-[#9ecfff]/30"
                >
                  <Save className="h-4 w-4 mr-2" /> Save Draft
                </Button>
              </div>
            </div>
            
            <GlassmorphicCard>
              <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
                <div className="p-6 border-b border-[#9ecfff]/10">
                  <TabsList className="grid w-full md:w-60 grid-cols-2 bg-[#1e2535]/80">
                    <TabsTrigger value="edit" className="data-[state=active]:bg-[#1e293b]">
                      <PenIcon className="h-4 w-4 mr-2" /> Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="data-[state=active]:bg-[#1e293b]">
                      <EyeIcon className="h-4 w-4 mr-2" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="edit" className="p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                          Title <span className="text-[#ff5c5c]">*</span>
                        </label>
                        <Input
                          id="title"
                          placeholder="Enter post title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-2">
                          Content <span className="text-[#ff5c5c]">*</span>
                        </label>
                        <Textarea
                          id="content"
                          placeholder="Share your thoughts, ask questions, or show your work..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[200px] bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                          Category <span className="text-[#ff5c5c]">*</span>
                        </label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger id="category" className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e2535] border-[#1e2535]">
                            {categories.map((cat) => {
                              const categoryData = categoriesObj[cat];
                              return (
                                <SelectItem 
                                  key={cat} 
                                  value={cat}
                                  className="flex items-center"
                                >
                                  <div className="flex items-center">
                                    <div 
                                      className="w-2 h-2 rounded-full mr-2" 
                                      style={{ backgroundColor: categoryData.color }}
                                    />
                                    {categoryData.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tags
                        </label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {tags.map((tag) => (
                            <Badge 
                              key={tag}
                              className="bg-[#1e293b]/70 text-white border border-[#9ecfff]/20 flex items-center gap-1 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add tag (e.g. #javascript)"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleTagAdd();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleTagAdd}
                            className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/forum")}
                        className="border-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Publishing..." : "Publish Post"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="preview" className="p-6">
                  {!title && !content ? (
                    <div className="text-center py-8">
                      <h3 className="text-xl font-orbitron mb-2">Nothing to Preview</h3>
                      <p className="text-gray-500">Add some content in the Edit tab to see a preview.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="flex items-center">
                          <div className="font-medium flex items-center">
                            <span className="ml-2 text-xs py-0.5 px-1.5 bg-[#5cdc96]/20 text-[#5cdc96] rounded">
                              Preview Mode
                            </span>
                          </div>
                        </div>
                        
                        {category && (
                          <Badge 
                            className="text-xs tracking-wider px-2 py-1 rounded border"
                            style={{
                              backgroundColor: `${getCategoryStyle(category).color}20`,
                              color: getCategoryStyle(category).color,
                              borderColor: `${getCategoryStyle(category).color}40`
                            }}
                          >
                            {categoriesObj[category]?.label || category}
                          </Badge>
                        )}
                      </div>
                      
                      <h1 className="text-2xl md:text-3xl font-orbitron mb-6">
                        {title || "Untitled Post"}
                      </h1>
                      <div className="text-gray-300 mb-8 whitespace-pre-line">
                        {content || "No content yet."}
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-6">
                          {tags.map(tag => (
                            <Badge 
                              key={tag}
                              className="bg-[#1e293b]/70 hover:bg-[#1e293b] text-white border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 cursor-pointer text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="border-t border-[#9ecfff]/10 pt-4 mt-6">
                        <Button
                          onClick={() => setActiveTab("edit")}
                          className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                        >
                          <PenIcon className="h-4 w-4 mr-2" /> Continue Editing
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </GlassmorphicCard>
          </div>
          
          <div className="md:col-span-1">
            <div className="space-y-6">
              <GlassmorphicCard className="p-6">
                <h3 className="text-xl font-orbitron mb-4">Posting Guidelines</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="font-medium text-[#9ecfff] mb-1">Choose the Right Category</h4>
                    <p className="text-sm text-gray-500">Select the most appropriate category for your post to reach the right audience.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#9ecfff] mb-1">Use Descriptive Titles</h4>
                    <p className="text-sm text-gray-500">Clear, concise titles help others understand your post's content at a glance.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#9ecfff] mb-1">Add Relevant Tags</h4>
                    <p className="text-sm text-gray-500">Tags make your post more discoverable and help categorize related content.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#9ecfff] mb-1">Be Respectful</h4>
                    <p className="text-sm text-gray-500">Maintain a supportive and constructive tone in your posts and comments.</p>
                  </div>
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="p-6">
                <h3 className="text-xl font-orbitron mb-4">Formatting Tips</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500">The forum supports basic text formatting:</p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <code className="bg-[#1e293b] px-1 py-0.5 rounded text-gray-300">**bold**</code>
                      <span className="text-gray-500">for <strong>bold text</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="bg-[#1e293b] px-1 py-0.5 rounded text-gray-300">*italic*</code>
                      <span className="text-gray-500">for <em>italic text</em></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="bg-[#1e293b] px-1 py-0.5 rounded text-gray-300">`code`</code>
                      <span className="text-gray-500">for <code className="bg-[#1e293b] px-1 rounded">inline code</code></span>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}