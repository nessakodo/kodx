import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mockData";
import { useEffect } from "react";

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  
  // Prefill the query cache with mock data
  useEffect(() => {
    if (!queryClient.getQueryData(["/api/projects"])) {
      queryClient.setQueryData(["/api/projects"], MOCK_PROJECTS);
    }
  }, [queryClient]);
  
  // Fetch all projects
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/projects"],
  });
  
  // Use mock data when real data is not available
  const displayProjects = projects || MOCK_PROJECTS;
  
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-orbitron text-3xl tracking-wider mb-4">
            <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Build real-world applications with guided project challenges. Each project helps you apply your skills in a practical context and earn experience points for your profile.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 mx-auto text-[#ff5c5c] mb-6" />
            <h2 className="text-2xl font-orbitron mb-4">Failed to Load Projects</h2>
            <p className="text-gray-500 mb-8">There was an error loading the projects. Please try again later.</p>
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-orbitron mb-4">No Projects Available</h2>
            <p className="text-gray-500">Check back soon for new project challenges!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}