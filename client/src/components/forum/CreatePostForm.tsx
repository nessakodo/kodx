import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KodexModal } from "@/components/ui/kodex-modal";
import {
  BookmarkIcon,
  SendIcon,
  EyeIcon,
  PencilIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";

// Draft autosave key
const DRAFT_STORAGE_KEY = "forum_post_draft";

interface CreatePostFormProps {
  onSubmit: (post: {
    title: string;
    content: string;
    category: string;
  }) => void;
  onCancel?: () => void;
  initialValues?: {
    title: string;
    content: string;
    category: string;
  };
}

export function CreatePostForm({ onSubmit, onCancel, initialValues }: CreatePostFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [category, setCategory] = useState(initialValues?.category || "discussion");
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  
  // Categories available for forum posts
  const categories = [
    { value: "discussion", label: "Discussion" },
    { value: "question", label: "Question" },
    { value: "devlog", label: "Devlog" },
    { value: "announcement", label: "Announcement" },
    { value: "resource", label: "Resource" }
  ];
  
  // Auto-save draft every 5 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || content) {
        saveDraft();
      }
    }, 5000);
    
    return () => clearInterval(autoSaveInterval);
  }, [title, content, category]);
  
  // Load draft on mount
  useEffect(() => {
    if (!initialValues) {
      loadDraft();
    }
    
    // Load mock user notes
    // In a real app, this would come from the API
    setUserNotes([
      "Quantum Computing Basics: Qubit superposition and entanglement enable quantum parallelism. Need to review H-gate operations and Bell states further.",
      "Mindful Meditation App: Implemented encryption for user meditation history. Need to add validation and sanitization for meditation entry descriptions.",
      "API Security Lab: Completed OWASP Top 10 review. JWT implementation works but needs rate limiting."
    ]);
  }, []);
  
  const saveDraft = () => {
    const draft = { title, content, category };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  };
  
  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setCategory(draft.category || "discussion");
        
        toast({
          title: "Draft Loaded",
          description: "Your previous draft has been loaded.",
        });
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  };
  
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a forum post.",
        variant: "destructive"
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your post.",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your post.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit({ title, content, category });
    clearDraft();
  };
  
  const handleInsertNote = (note: string) => {
    setContent(content + "\n\n> " + note + "\n\n");
    setIsNotesModalOpen(false);
  };
  
  return (
    <GlassmorphicCard className="p-6">
      <h2 className="font-orbitron text-2xl mb-6 flex items-center gap-2">
        <PencilIcon className="h-5 w-5 text-[#9ecfff]" />
        Create New Post
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            className="bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e2535] border-[#1e293b]">
              {categories.map((category) => (
                <SelectItem 
                  key={category.value} 
                  value={category.value}
                  className="focus:bg-[#9ecfff]/10 focus:text-white"
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">Content</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-[#9ecfff]"
              onClick={() => setIsNotesModalOpen(true)}
            >
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Insert from Notes
            </Button>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here. You can use markdown for formatting."
            className="min-h-[300px] bg-[#1e293b]/50 border-[#1e293b] focus:border-[#9ecfff]/50 resize-none"
          />
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-[#1e293b]">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="btn-kodex"
              onClick={() => setIsPreviewModalOpen(true)}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              type="button"
              variant="outline"
              className="btn-kodex"
              onClick={saveDraft}
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
          
          <div className="flex gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={onCancel}
              >
                <XIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button type="submit" className="btn-kodex bg-[#1e2535]/80">
              <SendIcon className="h-4 w-4 mr-2" />
              Publish Post
            </Button>
          </div>
        </div>
      </form>
      
      {/* Notes Modal */}
      <KodexModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        title="Your Notes"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
          {userNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notes found</p>
          ) : (
            userNotes.map((note, index) => (
              <div 
                key={index} 
                className="p-3 rounded border border-[#1e293b] bg-[#1e293b]/30 hover:bg-[#1e293b]/50 cursor-pointer transition-colors"
                onClick={() => handleInsertNote(note)}
              >
                <p className="text-sm text-gray-300 line-clamp-3">{note}</p>
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 px-2 text-xs text-[#9ecfff]"
                  >
                    Insert
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </KodexModal>
      
      {/* Preview Modal */}
      <KodexModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Post Preview"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto py-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="forum-tag">{category}</span>
          </div>
          
          <h3 className="text-xl font-orbitron text-white">{title || "Untitled Post"}</h3>
          
          <div className="prose prose-invert max-w-none mt-4">
            <div className="border-t border-[#1e293b] pt-4 text-gray-300 whitespace-pre-line">
              {content || "No content yet..."}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 pt-4 border-t border-[#1e293b]">
          <Button
            variant="outline"
            className="btn-kodex"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            Continue Editing
          </Button>
        </div>
      </KodexModal>
    </GlassmorphicCard>
  );
}