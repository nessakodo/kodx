import { Button } from "@/components/ui/button";
import { KodexLogo } from "@/components/ui/kodex-logo";
import { Link } from "wouter";
import { FaDiscord } from "react-icons/fa";
import { ChevronDownIcon } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center items-center text-center py-16 px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0e1525] opacity-80"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <KodexLogo size="xl" className="mb-6" />
      </motion.div>
      
      <motion.p 
        className="font-orbitron text-xl md:text-2xl font-medium tracking-wider mb-6 text-white/80 uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Design the Future. Decode the Past.
      </motion.p>
      
      <motion.p 
        className="max-w-2xl text-lg mb-8 text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        A platform for mindful technologists. Build secure systems. Create with intention. 
        Transform your relationship with code, security, and self — one Lab at a time.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link href="/labs">
          <Button 
            className="px-6 py-3 h-auto border border-[#9ecfff]/30 hover:bg-[#9ecfff]/10 bg-[#1e2535]/25 backdrop-blur-md transition-all font-medium tracking-wide"
            size="lg"
          >
            Explore Labs
          </Button>
        </Link>
        
        <a 
          href="https://discord.gg/6xyj2xshxY" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            className="px-6 py-3 h-auto border border-[#88c9b7]/30 hover:bg-[#88c9b7]/10 bg-[#1e2535]/25 backdrop-blur-md transition-all font-medium tracking-wide flex items-center justify-center gap-2"
            size="lg"
          >
            <FaDiscord className="h-5 w-5" />
            Join Community
          </Button>
        </a>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="text-sm text-gray-500 mb-2">Scroll to discover</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDownIcon className="h-5 w-5 text-[#9ecfff]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
