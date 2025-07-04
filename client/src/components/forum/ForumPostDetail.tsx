import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HeartIcon, MessageSquareIcon, ArrowLeftIcon, BookmarkIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "wouter";

interface User {
  id: string;
  username: string;
  profileImageUrl?: string;
  totalXp?: number;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  user: User;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  likes: number;
  createdAt: string;
  user: User;
  comments: Comment[];
  liked?: boolean;
  saved?: boolean;
}

export function ForumPostDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [commentContent, setCommentContent] = useState("");

  // Fetch post details
  const { data: post, isLoading } = useQuery<ForumPost>({
    queryKey: [`/api/forum-posts/${id}`],
    enabled: !!id,
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/forum-posts/${id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forum-posts/${id}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like/unlike post. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Save post mutation
  const saveMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/forum-posts/${id}/save`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forum-posts/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-posts"] });
      
      toast({
        title: post?.saved ? "Post unsaved" : "Post saved",
        description: post?.saved 
          ? "This post has been removed from your saved posts." 
          : "This post has been added to your saved posts.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save/unsave post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (content: string) => apiRequest("POST", `/api/forum-posts/${id}/comments`, { content }),
    onSuccess: () => {
      setCommentContent("");
      queryClient.invalidateQueries({ queryKey: [`/api/forum-posts/${id}`] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Format category badge style based on category type
  const getCategoryStyle = (category: string) => {
    const categoryMap = {
      'DISCUSSION': {
        gradient: "from-[#8b5cf6]/10 to-[#8b5cf6]/10",
        border: "border-[#8b5cf6]/20",
        text: "#8b5cf6"
      },
      'RESOURCES': {
        gradient: "from-[#10b981]/10 to-[#10b981]/10",
        border: "border-[#10b981]/20",
        text: "#10b981"
      },
      'SHOWCASE': {
        gradient: "from-[#facc15]/10 to-[#facc15]/10",
        border: "border-[#facc15]/20",
        text: "#facc15"
      },
      'QUESTIONS': {
        gradient: "from-[#3b82f6]/10 to-[#3b82f6]/10",
        border: "border-[#3b82f6]/20",
        text: "#3b82f6"
      },
      'FEEDBACK': {
        gradient: "from-[#f87171]/10 to-[#f87171]/10",
        border: "border-[#f87171]/20",
        text: "#f87171"
      },
      'ANNOUNCEMENTS': {
        gradient: "from-[#e879f9]/10 to-[#e879f9]/10",
        border: "border-[#e879f9]/20",
        text: "#e879f9"
      }
    };
    
    return categoryMap[category as keyof typeof categoryMap] || {
      gradient: "from-gray-500/10 to-gray-500/10",
      border: "border-gray-500/20",
      text: "#9ca3af"
    };
  };

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  // Format date
  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "unknown date";
    }
  };

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts.",
        variant: "default",
      });
      return;
    }
    
    likeMutation.mutate();
  };
  
  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save posts.",
        variant: "default",
      });
      return;
    }
    
    saveMutation.mutate();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some content for your comment.",
        variant: "destructive",
      });
      return;
    }
    
    commentMutation.mutate(commentContent);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-32 mb-6" />
        <GlassmorphicCard className="mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-24 ml-auto" />
            </div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            
            <div className="flex items-center mt-6 pt-4 border-t border-[#9ecfff]/10">
              <Skeleton className="h-8 w-20 mr-4" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </GlassmorphicCard>
        
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-32 w-full mb-6" />
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <GlassmorphicCard key={i} className="p-4">
              <div className="flex items-center mb-4">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
            </GlassmorphicCard>
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-orbitron mb-4">Post Not Found</h2>
        <p className="text-gray-500 mb-8">The post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/forum">Back to Forum</Link>
        </Button>
      </div>
    );
  }

  const categoryStyle = getCategoryStyle(post.category);

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/forum" className="inline-flex items-center text-[#9ecfff] hover:underline mb-6">
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Forum
      </Link>
      
      {/* Main Post */}
      <GlassmorphicCard className="mb-8">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex items-center">
              <Avatar className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <AvatarImage 
                  src={post.user.profileImageUrl} 
                  alt={post.user.username}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30">
                  {post.user.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium flex items-center">
                  {post.user.username}
                  {post.user.totalXp && (
                    <span className="ml-2 text-xs py-0.5 px-1.5 bg-[#5cdc96]/20 text-[#5cdc96] rounded">
                      {post.user.totalXp} XP
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Posted {getRelativeTime(post.createdAt)}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {getFormattedDate(post.createdAt)}
                </div>
              </div>
            </div>
            
            <Badge 
              className={`text-xs uppercase tracking-wider bg-gradient-to-r ${categoryStyle.gradient} px-2 py-1 rounded border ${categoryStyle.border}`}
              style={{ color: categoryStyle.text }}
            >
              {post.category}
            </Badge>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-orbitron mb-6">{post.title}</h1>
          <div className="text-gray-300 mb-8 whitespace-pre-line">
            {post.content}
          </div>
          
          <div className="flex items-center mt-6 pt-4 border-t border-[#9ecfff]/10">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 mr-4 ${post.liked ? 'text-[#ff5c5c] border-[#ff5c5c]/30' : 'text-gray-400'}`}
              onClick={handleLikeToggle}
              disabled={likeMutation.isPending}
            >
              <HeartIcon className="h-4 w-4" /> {post.likes}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-gray-400"
              onClick={() => document.getElementById('comment-form')?.focus()}
            >
              <MessageSquareIcon className="h-4 w-4" /> {post.comments?.length || 0}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ml-4 ${post.saved ? 'text-amber-400 border-amber-400/30' : 'text-gray-400'}`}
              onClick={handleSaveToggle}
              disabled={saveMutation.isPending}
            >
              <BookmarkIcon className="h-4 w-4" /> {post.saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <GlassmorphicCard className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-orbitron mb-4">Leave a Comment</h3>
            <form onSubmit={handleCommentSubmit}>
              <Textarea
                id="comment-form"
                placeholder="Add to the discussion..."
                className="min-h-[120px] bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50 mb-4"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                disabled={commentMutation.isPending || !commentContent.trim()}
              >
                {commentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </div>
        </GlassmorphicCard>
      ) : (
        <GlassmorphicCard className="mb-8 p-6 text-center">
          <h3 className="text-lg font-orbitron mb-2">Sign In to Comment</h3>
          <p className="text-gray-500 mb-4">Join the discussion by signing in to your account.</p>
          <Button asChild>
            <a href="/api/login">Sign In</a>
          </Button>
        </GlassmorphicCard>
      )}
      
      {/* Comments */}
      <div className="mb-4">
        <h3 className="text-xl font-orbitron mb-6">
          Comments ({post.comments?.length || 0})
        </h3>
        
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <GlassmorphicCard key={comment.id} className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <AvatarImage 
                      src={comment.user.profileImageUrl} 
                      alt={comment.user.username}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30">
                      {comment.user.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      {comment.user.username}
                      {comment.user.totalXp && (
                        <span className="ml-2 text-xs py-0.5 px-1.5 bg-[#5cdc96]/20 text-[#5cdc96] rounded">
                          {comment.user.totalXp} XP
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRelativeTime(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-gray-300 whitespace-pre-line">
                  {comment.content}
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        ) : (
          <GlassmorphicCard className="p-6 text-center">
            <MessageSquareIcon className="h-8 w-8 mx-auto text-gray-500 mb-2" />
            <p className="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </GlassmorphicCard>
        )}
      </div>
    </div>
  );
}
