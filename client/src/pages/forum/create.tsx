import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { ArrowLeftIcon, SaveIcon, SendIcon, HashIcon, PlusIcon, XIcon } from "lucide-react";
import { FORUM_CATEGORIES, TRENDING_TAGS } from "@/lib/mockData";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function CreatePostPage() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("write");
  
  // Post state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(Object.keys(FORUM_CATEGORIES)[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && !savedAsDraft) {
      toast({
        title: "Authentication required",
        description: "You need to be signed in to create a post.",
        variant: "destructive",
      });
      navigate("/forum");
    }
  }, [isAuthenticated, navigate, toast, savedAsDraft]);
  
  // Load from draft if available
  useEffect(() => {
    const savedDraft = localStorage.getItem("forum_post_draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setCategory(draft.category || Object.keys(FORUM_CATEGORIES)[0]);
        setTags(draft.tags || []);
        setSavedAsDraft(true);
        
        toast({
          title: "Draft loaded",
          description: "Your previous draft has been loaded.",
        });
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [toast]);
  
  // Auto-save draft
  useEffect(() => {
    const autoSaveDraft = () => {
      if (title || content || tags.length > 0) {
        const draft = { title, content, category, tags };
        localStorage.setItem("forum_post_draft", JSON.stringify(draft));
        setSavedAsDraft(true);
      }
    };
    
    // Auto-save every 30 seconds while the user is typing
    const intervalId = setInterval(autoSaveDraft, 30000);
    
    return () => clearInterval(intervalId);
  }, [title, content, category, tags]);
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category: string; tags: string[] }) => 
      apiRequest("POST", "/api/forum-posts/create", data),
    onSuccess: (data) => {
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      // Clear the draft
      localStorage.removeItem("forum_post_draft");
      // Navigate to the new post
      navigate(`/forum/post/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle tag addition
  const handleAddTag = () => {
    // Check if tag already exists or if we hit the limit
    if (tags.length >= 5) {
      toast({
        title: "Tag limit reached",
        description: "You can only add up to 5 tags per post.",
        variant: "destructive",
      });
      return;
    }
    
    const formattedTag = newTag.trim().toLowerCase();
    
    if (!formattedTag) {
      return;
    }
    
    // Add # if not present
    const finalTag = formattedTag.startsWith('#') ? formattedTag : `#${formattedTag}`;
    
    if (tags.includes(finalTag)) {
      toast({
        title: "Duplicate tag",
        description: "This tag has already been added.",
        variant: "destructive",
      });
      return;
    }
    
    setTags([...tags, finalTag]);
    setNewTag("");
  };
  
  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Handle popular tag selection
  const handlePopularTagClick = (tag: string) => {
    const tagWithoutHash = tag.startsWith('#') ? tag.substring(1) : tag;
    setNewTag(tagWithoutHash);
  };
  
  // Save draft explicitly
  const saveDraft = () => {
    const draft = { title, content, category, tags };
    localStorage.setItem("forum_post_draft", JSON.stringify(draft));
    setSavedAsDraft(true);
    
    toast({
      title: "Draft saved",
      description: "Your post draft has been saved. You can continue editing later.",
    });
  };
  
  // Submit post
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your post.",
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate({ title, content, category, tags });
  };
  
  // Get categoriesObj for styling
  const categoriesObj = FORUM_CATEGORIES as Record<string, { label: string; color: string; route: string }>;
  
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Link href="/forum">
          <div className="inline-flex items-center text-[#9ecfff] hover:underline mb-6 cursor-pointer">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Forum
          </div>
        </Link>
        
        <h1 className="font-orbitron text-3xl tracking-wider mb-6">
          <span className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">Create</span> Post
        </h1>
        
        <GlassmorphicCard className="mb-8">
          <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
            
            <Separator className="bg-[#9ecfff]/10 mb-6" />
            
            <TabsContent value="write" className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="content">Content</Label>
                    <span className="text-xs text-gray-500">
                      Markdown supported
                    </span>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Share your knowledge, experience, or ask a question..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Category</Label>
                  <RadioGroup 
                    value={category} 
                    onValueChange={setCategory}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(categoriesObj).map(([key, { label, color }]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={key} 
                            id={`category-${key}`} 
                            className="border-[#9ecfff]/30 text-[#9ecfff]"
                          />
                          <Label 
                            htmlFor={`category-${key}`}
                            className="flex items-center cursor-pointer"
                          >
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: color }}
                            />
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="mb-2 block">Tags (up to 5)</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(tag => (
                      <Badge 
                        key={tag} 
                        className="bg-[#1e293b]/70 text-white border border-[#9ecfff]/20 flex items-center gap-1"
                      >
                        {tag}
                        <XIcon
                          className="h-3 w-3 cursor-pointer hover:text-[#ff5c5c]"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <HashIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="pl-10 bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddTag}
                      variant="outline"
                      className="border-[#9ecfff]/30 hover:bg-[#9ecfff]/10"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="text-xs text-gray-500 mb-2 block">Popular tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_TAGS.slice(0, 6).map(tag => (
                        <Badge 
                          key={tag.label} 
                          className="bg-[#1e293b]/70 text-white border border-[#9ecfff]/20 cursor-pointer hover:bg-[#1e293b]"
                          onClick={() => handlePopularTagClick(tag.label)}
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-[#9ecfff]/30 hover:bg-[#9ecfff]/10 flex-1"
                    onClick={saveDraft}
                  >
                    <SaveIcon className="mr-2 h-4 w-4" /> Save Draft
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30 flex-1"
                    disabled={createPostMutation.isPending}
                  >
                    <SendIcon className="mr-2 h-4 w-4" /> 
                    {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="preview" className="px-6 pb-6">
              {!title && !content ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-orbitron mb-4">Nothing to Preview</h3>
                  <p className="text-gray-500">
                    Add some content in the Write tab to see a preview.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-4">
                    {category && (
                      <Badge
                        className="text-xs uppercase tracking-wider mr-2"
                        style={{
                          backgroundColor: `${categoriesObj[category].color}20`,
                          color: categoriesObj[category].color,
                          borderColor: `${categoriesObj[category].color}40`
                        }}
                      >
                        {categoriesObj[category].label}
                      </Badge>
                    )}
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                          <Badge 
                            key={tag} 
                            className="bg-[#1e293b]/70 text-white border border-[#9ecfff]/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-orbitron mb-4">
                    {title || "Untitled Post"}
                  </h1>
                  
                  <div className="prose prose-invert prose-sm max-w-none">
                    {content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-[#9ecfff]/10">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("write")}
                  variant="outline"
                  className="border-[#9ecfff]/30 hover:bg-[#9ecfff]/10"
                >
                  Back to Editing
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </GlassmorphicCard>
      </main>
      <Footer />
    </div>
  );
}