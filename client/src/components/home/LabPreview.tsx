import { useQuery } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { XPRing } from "@/components/ui/xp-ring";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export function LabPreview() {
  const { isAuthenticated } = useAuth();
  
  // Get the first lab for the preview
  const { data: labs, isLoading } = useQuery({
    queryKey: ["/api/labs"],
  });
  
  // Simulated lab progress for the preview
  const labProgress = {
    completedTasks: ["task1", "task2"],
    currentProgress: 40,
    currentXp: 100,
    totalXp: 250
  };
  
  const previewLab = labs && labs.length > 0 ? labs[0] : null;

  return (
    <section className="mb-16 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8">
        <h2 className="font-orbitron text-2xl tracking-wider mb-4 md:mb-0 uppercase">
          Lab <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Preview</span>
        </h2>
        
        {!isLoading && previewLab && (
          <div className="text-right">
            <span className="text-gray-500 mr-2">LAB 01</span>
            <span className="font-orbitron text-[#9ecfff] uppercase">{previewLab.title}</span>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </div>
        </div>
      ) : previewLab ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <GlassmorphicCard className="overflow-hidden">
              <div className="relative pb-[56.25%] h-0 bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  {previewLab.videoUrl ? (
                    <iframe 
                      className="w-full h-full"
                      src={previewLab.videoUrl}
                      title={previewLab.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img 
                        src="https://images.unsplash.com/photo-1629654297299-c8506221ca97" 
                        alt={previewLab.title}
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                          <PlayIcon className="text-white h-8 w-8" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex gap-3 mb-4 overflow-x-auto py-2 scrollbar-thin">
                  <Badge 
                    className="whitespace-nowrap px-3 py-1 bg-[#9ecfff]/10 text-[#9ecfff] hover:bg-[#9ecfff]/20"
                  >
                    Introduction <span className="text-xs">0:00</span>
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="whitespace-nowrap px-3 py-1 bg-transparent text-gray-300 hover:bg-white/5"
                  >
                    Threat Modeling <span className="text-xs">3:42</span>
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="whitespace-nowrap px-3 py-1 bg-transparent text-gray-300 hover:bg-white/5"
                  >
                    Validation <span className="text-xs">7:15</span>
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="whitespace-nowrap px-3 py-1 bg-transparent text-gray-300 hover:bg-white/5"
                  >
                    Authentication <span className="text-xs">12:30</span>
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="whitespace-nowrap px-3 py-1 bg-transparent text-gray-300 hover:bg-white/5"
                  >
                    Summary <span className="text-xs">18:45</span>
                  </Badge>
                </div>
                
                <h3 className="font-orbitron text-white text-xl mb-2">{previewLab.title}</h3>
                <p className="text-gray-500">{previewLab.description}</p>
              </div>
            </GlassmorphicCard>
          </div>
          
          <div className="lg:col-span-2">
            <GlassmorphicCard className="overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-[#9ecfff]/10">
                <h3 className="font-orbitron text-white text-lg mb-4 uppercase">Lab Progress</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Checkbox id="task1" className="border-[#9ecfff]/50 text-[#9ecfff] data-[state=checked]:bg-[#9ecfff]" defaultChecked />
                    <label htmlFor="task1" className="ml-2 text-sm text-gray-300 line-through">Watch introduction video</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="task2" className="border-[#9ecfff]/50 text-[#9ecfff] data-[state=checked]:bg-[#9ecfff]" defaultChecked />
                    <label htmlFor="task2" className="ml-2 text-sm text-gray-300 line-through">Complete threat modeling exercise</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="task3" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                    <label htmlFor="task3" className="ml-2 text-sm text-gray-300">Pass validation quiz (min 80%)</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="task4" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                    <label htmlFor="task4" className="ml-2 text-sm text-gray-300">Implement authentication sample</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="task5" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                    <label htmlFor="task5" className="ml-2 text-sm text-gray-300">Submit final review</label>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <XPRing percentage={40} size="md" className="mr-4" />
                  
                  <div>
                    <div className="text-sm text-gray-500">Completion</div>
                    <div>
                      <span className="text-[#9ecfff] font-semibold">100 XP</span>
                      <span className="text-gray-500 text-sm"> / 250 XP</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-orbitron text-white text-lg mb-4 uppercase">Lab Quiz</h3>
                
                <div className="mb-6">
                  <p className="mb-3 text-sm">Which of the following is NOT a secure way to store user passwords?</p>
                  
                  <div className="space-y-2">
                    <div className="flex flex-col space-y-2">
                      <RadioGroup defaultValue="base64" className="space-y-2">
                        <div className="flex items-center p-2 rounded hover:bg-white/5 cursor-pointer">
                          <RadioGroupItem value="bcrypt" id="bcrypt" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                          <label htmlFor="bcrypt" className="ml-2 text-sm cursor-pointer">Salted bcrypt hashing</label>
                        </div>
                        
                        <div className="flex items-center p-2 rounded hover:bg-white/5 cursor-pointer">
                          <RadioGroupItem value="argon2" id="argon2" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                          <label htmlFor="argon2" className="ml-2 text-sm cursor-pointer">Argon2id with proper parameters</label>
                        </div>
                        
                        <div className="flex items-center p-2 rounded hover:bg-white/5 cursor-pointer">
                          <RadioGroupItem value="pbkdf2" id="pbkdf2" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                          <label htmlFor="pbkdf2" className="ml-2 text-sm cursor-pointer">PBKDF2 with high iteration count</label>
                        </div>
                        
                        <div className="flex items-center p-2 bg-[#9ecfff]/5 border border-[#9ecfff]/20 rounded cursor-pointer">
                          <RadioGroupItem value="base64" id="base64" className="border-[#9ecfff]/50 text-[#9ecfff]" />
                          <label htmlFor="base64" className="ml-2 text-sm cursor-pointer">Base64 encoding with a static salt</label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link href={`/labs/${previewLab.id}`}>
                    <Button className="w-full py-3 h-auto bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30 font-medium">
                      {isAuthenticated ? "Continue Lab" : "Sign In to Start"}
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No labs available for preview yet. Check back soon!
        </div>
      )}
    </section>
  );
}
