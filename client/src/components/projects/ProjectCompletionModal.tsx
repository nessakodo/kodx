import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SparklesIcon, TrophyIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectCompletionModalProps {
  projectId: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
  xpEarned: number;
}

export function ProjectCompletionModal({
  projectId,
  projectTitle,
  isOpen,
  onClose,
  xpEarned
}: ProjectCompletionModalProps) {
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      toast({
        title: "Please add a reflection",
        description: "Share your thoughts about what you learned from this project.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would post to an API endpoint
      await apiRequest("POST", `/api/projects/${projectId}/complete`, {
        reflection
      });
      
      toast({
        title: "Project completed!",
        description: "Your reflection has been saved and XP has been awarded.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting project reflection:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to save your reflection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1e2535] to-[#111827] border border-[#9ecfff]/30 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center border-2 border-[#9ecfff]/40">
              <TrophyIcon className="h-8 w-8 text-amber-400" />
            </div>
            <span>Project Complete!</span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            You've completed <span className="text-[#9ecfff] font-bold">{projectTitle}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-amber-400" />
            <span className="text-lg text-amber-400">{xpEarned} XP earned!</span>
            <SparklesIcon className="h-5 w-5 text-amber-400" />
          </div>
          
          <div className="mb-4">
            <h3 className="text-gray-200 mb-2 font-medium">Reflect on your journey</h3>
            <p className="text-sm text-gray-400 mb-4">Share your thoughts about what you built, challenges you faced, and what surprised you about your process.</p>
            
            <Textarea 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you build? What challenges came up? What surprised you about your process?"
              className="h-32 bg-[#1e293b]/70 border-[#9ecfff]/20 focus:border-[#9ecfff]/40 focus:ring-[#9ecfff]/10 text-gray-200"
            />
          </div>
        </div>
        
        <DialogFooter>
          <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
            <Button
              className="sm:flex-1 bg-[#1e293b]/80 hover:bg-[#1e293b] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-gray-200"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Skip for now
            </Button>
            <Button
              className="sm:flex-1 bg-[#9ecfff]/20 hover:bg-[#9ecfff]/30 border border-[#9ecfff]/30 hover:border-[#9ecfff]/60 text-[#9ecfff]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Reflection"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}