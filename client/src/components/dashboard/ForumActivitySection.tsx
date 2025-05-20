import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Heart, BookmarkIcon, ChevronRight } from 'lucide-react';
import { EmptyForumState } from './EmptyStates';

export function ForumActivitySection() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 4;
  
  // Fetch user forum posts
  const { data: userPosts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/user-posts', page, pageSize],
    enabled: isAuthenticated,
  });

  // Fetch saved posts
  const { data: savedPosts = [], isLoading: isLoadingSaved } = useQuery({
    queryKey: ['/api/saved-posts', page, pageSize],
    enabled: isAuthenticated,
  });
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  // Render post item
  const renderPostItem = (post: any, isSaved = false) => {
    return (
      <Link key={post.id} href={`/forum/post/${post.id}`}>
        <div className="p-4 border-l-4 border-blue-500/30 hover:bg-[#1e293b]/20 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-blue-500/10 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-blue-400" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <h3 className="font-medium text-white line-clamp-1">{post.title}</h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatRelativeTime(post.createdAt)}</span>
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-2 mb-2">{post.content}</p>
                
                <div className="flex items-center text-xs text-gray-400 space-x-4">
                  <span className="flex items-center">
                    <Heart className="h-3 w-3 mr-1 text-red-400" />
                    {post.likeCount || 0} likes
                  </span>
                  
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1 text-blue-400" />
                    {post.commentCount || 0} replies
                  </span>
                </div>
              </div>
            </div>
            
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </Link>
    );
  };
  
  // Check if content exists
  const hasUserPosts = Array.isArray(userPosts) && userPosts.length > 0;
  const hasSavedPosts = Array.isArray(savedPosts) && savedPosts.length > 0;
  
  return (
    <div className="mb-10">
      <Tabs defaultValue="my-posts" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-orbitron text-2xl text-white">
            Forum Activity
          </h2>
          <TabsList className="bg-[#1e293b]">
            <TabsTrigger 
              value="my-posts"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              My Posts
            </TabsTrigger>
            <TabsTrigger 
              value="saved-posts"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Saved Posts
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="my-posts">
          <Card className="border border-[#1e293b] bg-[#0c1527]/50 overflow-hidden">
            {isLoadingPosts ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#1e293b]/50" />
                    <div className="flex-1">
                      <Skeleton className="h-5 bg-[#1e293b]/50 rounded mb-2 w-3/4" />
                      <Skeleton className="h-4 bg-[#1e293b]/50 rounded mb-1" />
                      <Skeleton className="h-4 bg-[#1e293b]/50 rounded mb-2 w-2/3" />
                      <div className="flex space-x-4">
                        <Skeleton className="h-3 w-16 bg-[#1e293b]/50 rounded" />
                        <Skeleton className="h-3 w-16 bg-[#1e293b]/50 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasUserPosts ? (
              <div className="divide-y divide-[#1e293b]">
                {userPosts.slice(0, pageSize).map((post: any) => renderPostItem(post))}
                
                {userPosts.length > pageSize && (
                  <div className="p-4 text-center">
                    <Link href="/forum/my-posts">
                      <Button
                        variant="outline"
                        className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                      >
                        View All My Posts
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                <EmptyForumState />
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="saved-posts">
          <Card className="border border-[#1e293b] bg-[#0c1527]/50 overflow-hidden">
            {isLoadingSaved ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#1e293b]/50" />
                    <div className="flex-1">
                      <Skeleton className="h-5 bg-[#1e293b]/50 rounded mb-2 w-3/4" />
                      <Skeleton className="h-4 bg-[#1e293b]/50 rounded mb-1" />
                      <Skeleton className="h-4 bg-[#1e293b]/50 rounded mb-2 w-2/3" />
                      <div className="flex space-x-4">
                        <Skeleton className="h-3 w-16 bg-[#1e293b]/50 rounded" />
                        <Skeleton className="h-3 w-16 bg-[#1e293b]/50 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSavedPosts ? (
              <div className="divide-y divide-[#1e293b]">
                {savedPosts.slice(0, pageSize).map((post: any) => renderPostItem(post, true))}
                
                {savedPosts.length > pageSize && (
                  <div className="p-4 text-center">
                    <Link href="/forum/saved">
                      <Button
                        variant="outline"
                        className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                      >
                        View All Saved Posts
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                <EmptyForumState />
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}