import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmptyForumActivityState, EmptySavedPostsState } from './EmptyStates';
import { ForumThreadCard } from '../forum/ForumThreadCard';

export function ForumActivitySection() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('your-posts');
  
  // Fetch user's forum posts
  const { data: userPosts = [] } = useQuery({
    queryKey: ['/api/user-posts'],
    enabled: isAuthenticated && activeTab === 'your-posts',
  });
  
  // Fetch user's saved posts
  const { data: savedPosts = [] } = useQuery({
    queryKey: ['/api/saved-posts'],
    enabled: isAuthenticated && activeTab === 'saved-posts',
  });
  
  // Handle like action
  const handleLikePost = (postId: number) => {
    // API call to like/unlike post would go here
    console.log(`Toggle like for post: ${postId}`);
  };
  
  // Handle save action
  const handleSavePost = (postId: number) => {
    // API call to save/unsave post would go here
    console.log(`Post saved: ${postId}`);
  };
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-2xl text-teal-300">Your Forum Activity</h2>
        
        <Link href="/forum">
          <Button variant="outline" 
            className="border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20">
            Browse Forum
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="your-posts" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-[#1e2535]/50 border border-teal-500/20 mb-6">
          <TabsTrigger 
            value="your-posts"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300"
          >
            Your Posts
          </TabsTrigger>
          <TabsTrigger 
            value="saved-posts"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300"
          >
            Saved Posts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="your-posts">
          <div className="space-y-4">
            {userPosts && userPosts.length > 0 ? (
              userPosts.map((post: any) => (
                <ForumThreadCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  author={{
                    id: user?.id || '',
                    username: user?.username || 'Anonymous',
                    profileImageUrl: user?.profileImageUrl
                  }}
                  excerpt={post.content.substring(0, 150) + '...'}
                  createdAt={post.createdAt}
                  commentsCount={post.commentsCount || 0}
                  likesCount={post.likesCount || 0}
                  category={post.category || 'discussion'}
                  isLiked={post.isLiked}
                  isSaved={post.isSaved}
                  onLike={handleLikePost}
                  onSave={handleSavePost}
                />
              ))
            ) : (
              <EmptyForumActivityState />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="saved-posts">
          <div className="space-y-4">
            {savedPosts && savedPosts.length > 0 ? (
              savedPosts.map((post: any) => (
                <ForumThreadCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  author={{
                    id: post.author.id,
                    username: post.author.username,
                    profileImageUrl: post.author.profileImageUrl
                  }}
                  excerpt={post.content.substring(0, 150) + '...'}
                  createdAt={post.createdAt}
                  commentsCount={post.commentsCount || 0}
                  likesCount={post.likesCount || 0}
                  category={post.category || 'discussion'}
                  isLiked={post.isLiked}
                  isSaved={true} // Always true for saved posts
                  onLike={handleLikePost}
                  onSave={handleSavePost}
                />
              ))
            ) : (
              <EmptySavedPostsState />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}