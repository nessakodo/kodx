import { useState } from "react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { XIcon, TrophyIcon, BookIcon, CodeIcon } from "lucide-react";

interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  category: string;
  earnedDate: string;
}

interface BadgeSectionProps {
  badges: Badge[];
  isLoading?: boolean;
}

export function BadgeSection({ badges, isLoading = false }: BadgeSectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // Get badge icon based on category
  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return <TrophyIcon className="h-6 w-6 text-[#bb86fc]" />;
      case 'learning':
        return <BookIcon className="h-6 w-6 text-[#56ccf2]" />;
      case 'development':
        return <CodeIcon className="h-6 w-6 text-[#6fcf97]" />;
      default:
        return <TrophyIcon className="h-6 w-6 text-[#9ecfff]" />;
    }
  };
  
  // Get badge background style based on category
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'achievement':
        return "from-[#bb86fc]/20 to-transparent border-[#bb86fc]/30";
      case 'learning':
        return "from-[#56ccf2]/20 to-transparent border-[#56ccf2]/30";
      case 'development':
        return "from-[#6fcf97]/20 to-transparent border-[#6fcf97]/30";
      default:
        return "from-[#9ecfff]/20 to-transparent border-[#9ecfff]/30";
    }
  };
  
  return (
    <>
      <GlassmorphicCard className="p-6">
        <h3 className="font-orbitron text-xl text-white mb-6">Achievement Badges</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            ))
          ) : badges && badges.length > 0 ? (
            badges.map((badge) => (
              <div 
                key={badge.id}
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedBadge(badge)}
              >
                <div 
                  className={`h-20 w-20 rounded-full bg-gradient-to-br ${getBadgeStyle(badge.category)} border flex items-center justify-center`}
                >
                  {badge.iconUrl ? (
                    <img src={badge.iconUrl} alt={badge.name} className="h-12 w-12" />
                  ) : (
                    getBadgeIcon(badge.category)
                  )}
                </div>
                <span className="text-sm text-gray-300 mt-2 text-center">{badge.name}</span>
              </div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center">
              <p className="text-gray-500">
                Complete labs and projects to earn badges!
              </p>
            </div>
          )}
        </div>
      </GlassmorphicCard>
      
      {/* Badge Detail Dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="bg-[#1e2535] border border-[#1e293b] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-xl flex items-center gap-2">
              {selectedBadge && (
                <>
                  {selectedBadge.iconUrl ? (
                    <img src={selectedBadge.iconUrl} alt={selectedBadge.name} className="h-6 w-6" />
                  ) : (
                    getBadgeIcon(selectedBadge.category)
                  )}
                  {selectedBadge.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBadge && (
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <div 
                  className={`h-24 w-24 rounded-full bg-gradient-to-br ${getBadgeStyle(selectedBadge.category)} border flex items-center justify-center`}
                >
                  {selectedBadge.iconUrl ? (
                    <img src={selectedBadge.iconUrl} alt={selectedBadge.name} className="h-14 w-14" />
                  ) : (
                    getBadgeIcon(selectedBadge.category)
                  )}
                </div>
              </div>
              
              <DialogDescription className="text-gray-400 text-base">
                {selectedBadge.description}
              </DialogDescription>
              
              <div className="text-sm text-gray-500 pt-2">
                Earned on {new Date(selectedBadge.earnedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          )}
          
          <DialogClose className="absolute right-4 top-4 text-gray-500 hover:text-white">
            <XIcon className="h-4 w-4" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}