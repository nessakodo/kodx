import { Link } from "wouter";
import { KodexLogo } from "@/components/ui/kodex-logo";
import { FaDiscord, FaYoutube, FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-[#9ecfff]/10 backdrop-blur-md bg-[#0e1525]/75 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <KodexLogo size="lg" />
            <p className="text-gray-500 max-w-md mt-2">
              A platform for mindful technologists building secure, ethical, and intentional digital systems.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a 
              href="https://discord.gg/6xyj2xshxY" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-[#1e2535]/80 flex items-center justify-center hover:bg-[#9ecfff]/20 transition-all"
            >
              <FaDiscord size={20} />
            </a>
            <a 
              href="https://youtube.com/@nessakodo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-[#1e2535]/80 flex items-center justify-center hover:bg-[#9ecfff]/20 transition-all"
            >
              <FaYoutube size={20} />
            </a>
            <a 
              href="https://github.com/nessakodo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-[#1e2535]/80 flex items-center justify-center hover:bg-[#9ecfff]/20 transition-all"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-orbitron text-white mb-4 uppercase">Labs</h3>
            <ul className="space-y-2">
              <li><Link href="/labs"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Cybersecurity</a></Link></li>
              <li><Link href="/labs"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Privacy</a></Link></li>
              <li><Link href="/labs"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Secure Development</a></Link></li>
              <li><Link href="/labs"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Digital Self-Agency</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-orbitron text-white mb-4 uppercase">Projects</h3>
            <ul className="space-y-2">
              <li><Link href="/projects"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Cryptography</a></Link></li>
              <li><Link href="/projects"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Secure Applications</a></Link></li>
              <li><Link href="/projects"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Privacy Tools</a></Link></li>
              <li><Link href="/projects"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">CTF Challenges</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-orbitron text-white mb-4 uppercase">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/forum"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Forum</a></Link></li>
              <li><a href="https://discord.gg/6xyj2xshxY" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#9ecfff] transition-colors">Discord</a></li>
              <li><Link href="/"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Events</a></Link></li>
              <li><Link href="/dashboard"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Badges</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-orbitron text-white mb-4 uppercase">About</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Philosophy</a></Link></li>
              <li><Link href="/"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Team</a></Link></li>
              <li><Link href="/"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Manifesto</a></Link></li>
              <li><Link href="/"><a className="text-gray-500 hover:text-[#9ecfff] transition-colors">Contact</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#9ecfff]/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 KODΞX WORLD. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <Link href="/"><a className="text-gray-500 text-sm hover:text-[#9ecfff] transition-colors">Privacy Policy</a></Link>
            <Link href="/"><a className="text-gray-500 text-sm hover:text-[#9ecfff] transition-colors">Terms of Service</a></Link>
            <Link href="/"><a className="text-gray-500 text-sm hover:text-[#9ecfff] transition-colors">Code of Conduct</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
