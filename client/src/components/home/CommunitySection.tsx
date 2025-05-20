import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRightIcon } from "lucide-react";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { Skeleton } from "@/components/ui/skeleton";

export function CommunitySection() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/forum-posts'],
  });
  
  // Get latest 3 posts
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <section className="mb-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-orbitron text-2xl tracking-wider uppercase">
          Community <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Forum</span>
        </h2>
        
        <Link href="/forum">
          <a className="text-[#9ecfff] hover:underline flex items-center gap-1">
            Visit Forum <ArrowRightIcon size={14} />
          </a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : recentPosts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <ForumPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No forum posts yet. Be the first to start a discussion!
        </div>
      )}
    </section>
  );
}
