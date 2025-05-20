import React from 'react';
import { Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MessageCircle, Heart, Bookmark, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ForumThreadCardProps {
  id: number;
  title: string;
  author: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  excerpt: string;
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  category: string;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (id: number) => void;
  onSave?: (id: number) => void;
}

export function ForumThreadCard({
  id,
  title,
  author,
  excerpt,
  createdAt,
  commentsCount,
  likesCount,
  category,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave
}: ForumThreadCardProps) {
  const { isAuthenticated } = useAuth();
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Handle like button click
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike && isAuthenticated) {
      onLike(id);
    }
  };
  
  // Handle save button click
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave && isAuthenticated) {
      onSave(id);
    }
  };
  
  // Get category color based on category name
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'discussion': 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      'question': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
      'tutorial': 'text-green-400 border-green-400/30 bg-green-400/10',
      'community': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
      'announcement': 'text-red-400 border-red-400/30 bg-red-400/10',
      'mindful-tech': 'text-teal-400 border-teal-400/30 bg-teal-400/10',
      'project': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
      'reflection': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    };
    
    return categories[category.toLowerCase()] || 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  };
  
  return (
    <Link href={`/forum/thread/${id}`}>
      <Card className="p-5 border border-[#9ecfff]/20 bg-black/40 backdrop-blur-sm hover:bg-[#1e2535]/50 transition-colors cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Thread Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`font-orbitron ${getCategoryColor(category)}`}>
                {category}
              </Badge>
              <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
            </div>
            
            <h3 className="text-lg font-orbitron mb-2 text-white">{title}</h3>
            
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">{excerpt}</p>
            
            {/* Author Info */}
            <div className="flex items-center mb-4">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={author.profileImageUrl} />
                <AvatarFallback className="bg-[#1e2535]">
                  {author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-[#9ecfff]">{author.username}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-400 hover:text-white gap-1 p-0"
                onClick={(e) => e.preventDefault()}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{commentsCount}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs ${isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} gap-1 p-0`}
                onClick={handleLike}
              >
                <Heart className="h-4 w-4" fill={isLiked ? 'rgba(248, 113, 113, 0.5)' : 'none'} />
                <span>{likesCount}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs ${isSaved ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} gap-1 p-0`}
                onClick={handleSave}
              >
                <Bookmark className="h-4 w-4" fill={isSaved ? 'rgba(250, 204, 21, 0.5)' : 'none'} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-400 hover:text-white gap-1 p-0 ml-auto"
                onClick={(e) => e.preventDefault()}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}