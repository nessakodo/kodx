import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Filter, Search } from "lucide-react";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Filter projects based on search query and difficulty filter
  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter ? project.difficulty === difficultyFilter : true;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="bg-gradient-kodex bg-kodex-grid min-h-screen">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl md:text-4xl tracking-wider mb-4 text-center uppercase">
            <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent drop-shadow-glow">
              KODΞX
            </span> Projects
          </h1>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-8">
            Fork real-world projects, follow step-by-step development guides, and build your
            portfolio of work in cryptography, secure applications, and privacy tools.
          </p>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                className="pl-10 bg-[#1e2535]/50 border-[#9ecfff]/20 focus-visible:ring-[#9ecfff]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={difficultyFilter === "beginner" ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(difficultyFilter === "beginner" ? null : "beginner")}
                className={`${
                  difficultyFilter === "beginner" 
                    ? "bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border-[#9ecfff]/40" 
                    : "border-[#9ecfff]/20"
                }`}
              >
                Beginner
              </Button>
              <Button
                variant={difficultyFilter === "intermediate" ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(difficultyFilter === "intermediate" ? null : "intermediate")}
                className={`${
                  difficultyFilter === "intermediate" 
                    ? "bg-gradient-to-r from-[#b166ff]/20 to-[#9ecfff]/20 border-[#b166ff]/40" 
                    : "border-[#9ecfff]/20"
                }`}
              >
                Intermediate
              </Button>
              <Button
                variant={difficultyFilter === "advanced" ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(difficultyFilter === "advanced" ? null : "advanced")}
                className={`${
                  difficultyFilter === "advanced" 
                    ? "bg-gradient-to-r from-[#ff5c5c]/20 to-[#b166ff]/20 border-[#ff5c5c]/40" 
                    : "border-[#9ecfff]/20"
                }`}
              >
                Advanced
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter(null);
                }}
                className="border border-[#9ecfff]/20"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#1e2535]/25 backdrop-blur-md border border-[#9ecfff]/10 rounded-xl">
            <h3 className="text-xl font-orbitron mb-2">No Projects Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || difficultyFilter 
                ? "Try adjusting your search or filters" 
                : "No projects available yet. Check back soon!"}
            </p>
            {(searchQuery || difficultyFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
