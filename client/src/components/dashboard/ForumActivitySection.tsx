import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EmptyForumState } from './EmptyStates';

export function ForumActivitySection() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  
  // Fetch user posts
  const { data: userPosts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/user-posts'],
    enabled: isAuthenticated && activeTab === 'posts',
  });
  
  // Fetch saved posts
  const { data: savedPosts = [], isLoading: isLoadingSaved } = useQuery({
    queryKey: ['/api/saved-posts'],
    enabled: isAuthenticated && activeTab === 'saved',
  });
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  const renderPostItem = (post: any) => (
    <Card 
      key={post.id}
      className="p-4 mb-4 border border-[#9ecfff]/20 bg-[#0f172a]/70 hover:bg-[#1e2535]/40 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-[#9ecfff]/20">
          <AvatarImage src={post.authorImageUrl || post.user?.profileImageUrl} />
          <AvatarFallback className="bg-[#1e293b] text-blue-300 font-orbitron">
            {(post.authorName?.[0] || post.user?.username?.[0] || 'U').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-white line-clamp-1 mr-2">{post.title}</h3>
            <span className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</span>
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-2 mb-2">{post.content}</p>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span>👁️ {post.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬 {post.comments || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>❤️ {post.likes || 0}</span>
            </div>
            
            {post.category && (
              <Badge variant="outline" className="ml-auto bg-blue-900/20 text-blue-300 border-blue-500/30">
                {post.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
  
  const isLoading = (activeTab === 'posts' && isLoadingPosts) || 
                    (activeTab === 'saved' && isLoadingSaved);
                    
  const currentPosts = activeTab === 'posts' ? userPosts : savedPosts;
  const hasData = Array.isArray(currentPosts) && currentPosts.length > 0;
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-blue-300">
          Your Forum Activity
        </h2>
        
        <div className="flex bg-[#0f172a] border border-[#1e293b] rounded-md overflow-hidden">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('posts')}
            className={`rounded-none border-0 px-6 ${
              activeTab === 'posts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-transparent text-gray-300 hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            My Posts
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setActiveTab('saved')}
            className={`rounded-none border-0 px-6 ${
              activeTab === 'saved' 
                ? 'bg-blue-600 text-white' 
                : 'bg-transparent text-gray-300 hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            Saved Posts
          </Button>
        </div>
      </div>
      
      <Card className="border border-[#1e293b] bg-[#0c1527]/50">
        {isLoading ? (
          // Loading skeleton
          <div className="p-8 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[#1e293b]/50 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-[#1e293b]/50 rounded mb-2 animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/50 rounded mb-1 animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/50 rounded mb-2 w-2/3 animate-pulse" />
                  <div className="h-3 bg-[#1e293b]/50 rounded w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : hasData ? (
          <>
            <div className="p-6 space-y-4">
              {currentPosts.slice(0, 3).map((post: any) => renderPostItem(post))}
            </div>
            
            {currentPosts.length > 3 && (
              <div className="text-center py-6 border-t border-[#1e293b]">
                <Link href="/forum">
                  <Button 
                    variant="outline" 
                    className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                  >
                    Explore Forum
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <EmptyForumState type={activeTab} />
        )}
      </Card>
    </section>
  );
}