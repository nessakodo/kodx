import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";

export function CommunityStats() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent to-[#1e293b]/20">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-orbitron text-3xl tracking-wider mb-4">
            Our <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Community</span> Network
          </h2>
          <p className="max-w-3xl mx-auto text-gray-400">
            KODΞX World is cultivating a new era of ethical technologists. We believe cybersecurity is a daily ritual, creative coding is a craft, and technology should be used with intention. Our community thrives through ritual, reflection, and collaborative building.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <GlassmorphicCard className="p-6 text-center transition-all duration-300 hover:border-[#9ecfff]/30">
            <div className="font-orbitron text-4xl bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent mb-3">
              16
            </div>
            <div className="text-gray-300 uppercase tracking-wider text-sm">Labs Completed</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 text-center transition-all duration-300 hover:border-[#9ecfff]/30">
            <div className="font-orbitron text-4xl bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent mb-3">
              200+
            </div>
            <div className="text-gray-300 uppercase tracking-wider text-sm">Active Technologists</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6 text-center transition-all duration-300 hover:border-[#9ecfff]/30">
            <div className="font-orbitron text-4xl bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent mb-3">
              78
            </div>
            <div className="text-gray-300 uppercase tracking-wider text-sm">Projects Published</div>
          </GlassmorphicCard>
        </div>
      </div>
    </section>
  );
}