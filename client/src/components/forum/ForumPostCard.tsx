import { Link } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageSquareIcon, BookmarkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FORUM_CATEGORIES } from "@/lib/mockData";

interface User {
  id: string;
  username: string;
  profileImageUrl?: string;
  totalXp?: number;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  likes: number;
  createdAt: string;
  user: User;
  commentsCount?: number;
  isFeatured?: boolean;
}

interface ForumPostCardProps {
  post: ForumPost;
  className?: string;
}

export function ForumPostCard({ post, className }: ForumPostCardProps) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  
  // Get category color from our categories data
  const getCategoryStyle = (category: string) => {
    const categoryKey = category.toUpperCase();
    const categories = FORUM_CATEGORIES as Record<string, { color: string; label: string; route: string }>;
    
    if (categories[categoryKey]) {
      return {
        color: categories[categoryKey].color,
      };
    }
    
    // Default styling if category not found
    return {
      color: "#9ca3af", // gray-400
    };
  };

  const categoryStyle = getCategoryStyle(post.category);
  
  // Handle saving posts (toggle)
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    // Here you would make an API call to save/unsave the post
    console.log(`Post ${isSaved ? 'unsaved' : 'saved'}: ${post.id}`);
  };
  
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  return (
    <GlassmorphicCard className={`flex flex-col h-full transition-all hover:border-[#9ecfff]/30 group ${className} ${post.isFeatured ? 'border-[#bb86fc]/30' : ''}`}>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <AvatarImage 
                src={post.user.profileImageUrl} 
                alt={post.user.username}
              />
              <AvatarFallback className="bg-gradient-to-br from-[#9ecfff]/30 to-[#88c9b7]/30">
                {post.user.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.user.username}</div>
              <div className="text-xs text-gray-500">{getRelativeTime(post.createdAt)}</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {post.isFeatured && (
              <Badge className="bg-[#bb86fc]/10 text-[#bb86fc] border border-[#bb86fc]/30">
                Featured
              </Badge>
            )}
            <Badge 
              className="text-xs px-2 py-1 rounded-full tracking-wider border"
              style={{
                backgroundColor: `${categoryStyle.color}20`,
                color: categoryStyle.color,
                borderColor: `${categoryStyle.color}40`
              }}
            >
              {post.category}
            </Badge>
          </div>
        </div>
        
        <h3 className="font-orbitron text-white text-lg mb-2">{post.title}</h3>
        <p className="text-gray-500 mb-4 flex-1 line-clamp-3">{post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map(tag => (
              <Link key={tag} href={`/forum/tags/${tag.replace('#', '')}`}>
                <Badge 
                  className="bg-[#1e293b]/70 hover:bg-[#1e293b] text-white border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 cursor-pointer text-xs"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#9ecfff]/10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <HeartIcon className="h-4 w-4 text-rose-500" /> {post.likes}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MessageSquareIcon className="h-4 w-4 text-[#9ecfff]" /> {post.commentsCount || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className={`p-1 h-7 w-7 rounded-full ${isSaved ? 'text-amber-400 hover:text-amber-500' : 'text-gray-400 hover:text-gray-300'}`}
              >
                <BookmarkIcon className="h-4 w-4" />
              </Button>
            )}
            <Link href={`/forum/post/${post.id}`}>
              <span className="text-sm text-[#9ecfff] font-medium group-hover:underline cursor-pointer">
                Read More
              </span>
            </Link>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
