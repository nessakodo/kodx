import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  FlaskConical, 
  GitBranch, 
  MessageCircle, 
  InfoIcon 
} from "lucide-react";

export function UserExperience() {
  const experiences = [
    {
      title: "LABS",
      description: "Interactive modules with guided learning, quizzes, and hands-on challenges to build practical skills.",
      icon: <FlaskConical className="text-2xl text-[#9ecfff]" />,
      gradient: "from-[#9ecfff]/20 to-[#88c9b7]/20",
      border: "border-[#9ecfff]/30"
    },
    {
      title: "PROJECTS",
      description: "Fork real-world projects, follow step-by-step development guides, and build your portfolio of work.",
      icon: <GitBranch className="text-2xl text-[#9ecfff]" />,
      gradient: "from-[#9ecfff]/20 to-[#b166ff]/20",
      border: "border-[#9ecfff]/30"
    },
    {
      title: "FORUM",
      description: "Share insights, ask questions, and contribute to a mindful community of security-focused developers.",
      icon: <MessageCircle className="text-2xl text-[#88c9b7]" />,
      gradient: "from-[#88c9b7]/20 to-[#b166ff]/20",
      border: "border-[#88c9b7]/30"
    },
  ];

  return (
    <section className="px-4 mb-16">
      <GlassmorphicCard className="p-8 rounded-2xl overflow-hidden relative">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#9ecfff]/10 blur-[100px] rounded-full"></div>
        <div className="absolute -left-24 -top-24 w-96 h-96 bg-[#88c9b7]/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <h2 className="font-orbitron text-2xl tracking-wider mb-8 text-center uppercase">
            The <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">KODΞX</span> Experience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${exp.gradient} flex items-center justify-center mb-4 ${exp.border}`}>
                  {exp.icon}
                </div>
                <h3 className="font-orbitron text-xl mb-2">{exp.title}</h3>
                <p className="text-gray-500">{exp.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/labs">
              <Button 
                className="px-6 py-3 h-auto border border-[#9ecfff]/30 bg-[#1e2535]/60 hover:bg-[#1e2535]/90 backdrop-blur-md transition-all font-medium tracking-wide flex items-center gap-2 text-gray-200"
              >
                <span>Learn More</span>
                <InfoIcon size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </GlassmorphicCard>
    </section>
  );
}
