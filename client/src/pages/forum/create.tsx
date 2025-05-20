import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CreatePostForm } from "@/components/forum/CreatePostForm";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function CreateForumPostPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (post: {
    title: string;
    content: string;
    category: string;
  }) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a forum post",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would create a post via the API
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Post Created",
        description: "Your post has been published successfully!",
      });
      
      // Redirect to forum
      setLocation("/forum");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLocation("/forum");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-orbitron mb-4">Authentication Required</h1>
        <p className="mb-6 text-gray-400">
          You need to be signed in to create forum posts.
        </p>
        <button
          onClick={() => setLocation("/api/login")}
          className="btn-kodex bg-[#1e2535]/60 px-4 py-2 rounded border border-[#9ecfff]/30"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setLocation("/forum")}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Forum
        </button>
      </div>

      <CreatePostForm
        onSubmit={handleCreatePost}
        onCancel={handleCancel}
      />
    </div>
  );
}