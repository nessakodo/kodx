import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/layout/Footer";
import { LabCard } from "@/components/labs/LabCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { MOCK_LABS } from "@/lib/mockData";
import { useEffect } from "react";

export default function LabsPage() {
  // Fetch all labs
  const { data: labs, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/labs"],
  });

  // For development, use mock data if API returns empty
  useEffect(() => {
    if (labs && labs.length === 0) {
      refetch();
    }
  }, [labs, refetch]);

  // Use mock data when real data is not available
  const displayLabs = (labs && labs.length > 0) ? labs : MOCK_LABS;
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-orbitron text-3xl tracking-wider mb-4">
            <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Labs</span>
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Hands-on guided learning experiences designed to help you master specific technologies and concepts. Complete labs to earn experience points and unlock achievements.
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
            <h2 className="text-2xl font-orbitron mb-4">Failed to Load Labs</h2>
            <p className="text-gray-500 mb-8">There was an error loading the labs. Please try again later.</p>
          </div>
        ) : displayLabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayLabs.map((lab: any) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-orbitron mb-4">No Labs Available</h2>
            <p className="text-gray-500">Check back soon for new learning opportunities!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}