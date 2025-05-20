import { Link } from "wouter";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, MessageSquareIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  likes: number;
  createdAt: string;
  user: User;
  commentsCount?: number;
}

interface ForumPostCardProps {
  post: ForumPost;
  className?: string;
}

export function ForumPostCard({ post, className }: ForumPostCardProps) {
  // Format category badge style based on category type
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

  const categoryStyle = getCategoryStyle(post.category);
  
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  return (
    <GlassmorphicCard className={`flex flex-col h-full transition-all hover:border-[#9ecfff]/30 group ${className}`}>
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
          <Badge 
            className={`text-xs uppercase tracking-wider bg-gradient-to-r ${categoryStyle.gradient} px-2 py-1 rounded border ${categoryStyle.border} ${categoryStyle.text}`}
          >
            {post.category}
          </Badge>
        </div>
        
        <h3 className="font-orbitron text-white text-lg mb-2">{post.title}</h3>
        <p className="text-gray-500 mb-4 flex-1 line-clamp-3">{post.content}</p>
        
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#9ecfff]/10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <HeartIcon className="h-4 w-4" /> {post.likes}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MessageSquareIcon className="h-4 w-4" /> {post.commentsCount || 0}
            </span>
          </div>
          
          <Link href={`/forum/${post.id}`}>
            <a className="text-sm text-[#9ecfff] font-medium group-hover:underline">
              Read More
            </a>
          </Link>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
