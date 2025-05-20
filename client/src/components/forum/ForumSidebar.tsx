import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { BadgeCheck, Bookmark, TrendingUp, Users, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export function ForumSidebar() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Join Community Card */}
      <GlassmorphicCard>
        <div className="p-4 space-y-4">
          <h3 className="font-orbitron text-xl tracking-wide">Join the Community</h3>
          <p className="text-gray-400 text-sm">
            Connect with fellow technologists, share your knowledge, and grow together.
          </p>
          {!isAuthenticated && (
            <Button 
              className="w-full bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 text-white hover-glow"
              asChild
            >
              <Link href="/api/login">Sign In</Link>
            </Button>
          )}
        </div>
      </GlassmorphicCard>
      
      {/* Forum Stats */}
      <Card className="bg-[#1e2535]/30 border-[#1e2535] p-4 space-y-4">
        <h3 className="font-orbitron text-lg">Forum Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-[#9ecfff]" />
            <div>
              <p className="text-sm text-gray-300">Active Members</p>
              <p className="text-lg font-medium">1,245</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-4 w-4 text-[#88c9b7]" />
            <div>
              <p className="text-sm text-gray-300">Posts This Week</p>
              <p className="text-lg font-medium">124</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-[#b166ff]" />
            <div>
              <p className="text-sm text-gray-300">Avg. Response Time</p>
              <p className="text-lg font-medium">4.2 hours</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Quick Links */}
      <Card className="bg-[#1e2535]/30 border-[#1e2535] p-4 space-y-4">
        <h3 className="font-orbitron text-lg">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/forum?category=discussion">
              <span className="text-[#9ecfff] hover:underline cursor-pointer">Discussions</span>
            </Link>
          </li>
          <li>
            <Link href="/forum?category=resources">
              <span className="text-[#88c9b7] hover:underline cursor-pointer">Resources</span>
            </Link>
          </li>
          <li>
            <Link href="/forum?category=showcase">
              <span className="text-[#b166ff] hover:underline cursor-pointer">Project Showcases</span>
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link href="/forum?saved=true">
                <span className="flex items-center gap-1 text-gray-300 hover:text-[#9ecfff] hover:underline cursor-pointer">
                  <Bookmark className="h-3 w-3" /> Saved Posts
                </span>
              </Link>
            </li>
          )}
        </ul>
      </Card>
      
      {/* Forum Guidelines */}
      <Card className="bg-[#1e2535]/30 border-[#1e2535] p-4 space-y-4">
        <h3 className="font-orbitron text-lg">Community Guidelines</h3>
        <ul className="space-y-2 text-sm list-disc pl-5 text-gray-300">
          <li>Be respectful and constructive</li>
          <li>Give credit where credit is due</li>
          <li>Share knowledge freely</li>
          <li>Protect privacy and security</li>
        </ul>
        <Link href="/forum/guidelines">
          <span className="text-xs text-[#9ecfff] hover:underline cursor-pointer">Read full guidelines</span>
        </Link>
      </Card>
    </div>
  );
}