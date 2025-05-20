import { useQuery } from "@tanstack/react-query";
import { LabCard } from "@/components/labs/LabCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Link } from "wouter";
import { ArrowRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedModules() {
  const { data: labs, isLoading: isLabsLoading } = useQuery({
    queryKey: ["/api/labs"],
  });

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Take first 3 items from both arrays and combine them
  const featuredItems = [];
  if (labs && projects) {
    // Alternate between labs and projects for first 3 of each
    for (let i = 0; i < 3; i++) {
      if (labs[i]) featuredItems.push({ type: 'lab', data: labs[i] });
      if (projects[i]) featuredItems.push({ type: 'project', data: projects[i] });
    }
    // If we have more than 3, slice to only keep the first 3
    if (featuredItems.length > 3) {
      featuredItems.splice(3);
    }
  }

  return (
    <section className="mb-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-orbitron text-2xl tracking-wider uppercase">
          Featured <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Modules</span>
        </h2>
        
        <div className="flex gap-4">
          <Link 
            href="/labs" 
            className="text-[#9ecfff] hover:underline flex items-center gap-1"
          >
            View all <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
      
      {isLabsLoading || isProjectsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : featuredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item, index) => (
            item.type === 'lab' ? (
              <LabCard key={`lab-${item.data.id}`} lab={item.data} />
            ) : (
              <ProjectCard key={`project-${item.data.id}`} project={item.data} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No modules available yet. Check back soon!
        </div>
      )}
    </section>
  );
}
