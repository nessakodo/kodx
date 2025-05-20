import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileIcon, 
  VideoIcon, 
  BookIcon, 
  FileTextIcon, 
  GithubIcon, 
  ExternalLinkIcon, 
  Search, 
  Download, 
  Moon, 
  FilePlusIcon,
  FilterIcon,
  ArrowRightIcon
} from "lucide-react";
import { Link } from "wouter";

// Resources data from provided JSON
const RESOURCE_VAULT_DATA = {
  "id": "kodex-resources",
  "title": "The KODΞX Resource Vault",
  "theme": "dark-glassmorphic",
  "description": "A curated sanctuary of tools, videos, guides, and templates to support your journey through mindful tech and digital sovereignty.",
  "sections": [
    {
      "id": "labs",
      "title": "🧪 LABS",
      "description": "Interactive modules with guided tutorials, embedded walkthroughs, and checkpoint-based XP rewards.",
      "features": [
        "Timestamped YouTube videos",
        "Downloadable PDFs & Notion templates",
        "Lab-specific GitHub repos",
        "Progress tracking & XP badges",
        "Embedded quizzes with instant feedback"
      ],
      "link": "/labs"
    },
    {
      "id": "projects",
      "title": "⚙️ PROJECTS",
      "description": "Step-by-step project guides to build your showcase portfolio.",
      "features": [
        "Real-world starter repos",
        "Tasks + reflection prompts",
        "Sample devlogs",
        "GitHub integration (fork & deploy)",
        "Forum showcase & peer feedback"
      ],
      "link": "/projects"
    },
    {
      "id": "forum",
      "title": "🌐 FORUM",
      "description": "A cyber-zen space to share, reflect, and co-create with community.",
      "features": [
        "Devlog templates",
        "XP from feedback/likes",
        "Topic channels: Quantum, Web3, Flow Tools",
        "Monthly build prompts",
        "Somatic tech check-ins"
      ],
      "link": "/forum"
    },
    {
      "id": "vault",
      "title": "📚 RESOURCE VAULT",
      "description": "Curated tools, cheat sheets, guides, and embedded tutorials for learners of all levels.",
      "resources": {
        "essential_reading": [
          {
            "title": "The Cybersecurity Starter Kit",
            "type": "pdf",
            "url": "/resources/pdfs/cyberstarter.pdf"
          },
          {
            "title": "Digital Minimalism (Cal Newport Summary)",
            "type": "article",
            "url": "https://nessakodo.com/blog/digital-minimalism"
          }
        ],
        "video_playlists": [
          {
            "title": "Intro to Terminal & Git",
            "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "timestamps": [
              {
                "time": "00:00",
                "title": "Intro"
              },
              {
                "time": "01:25",
                "title": "Setup"
              },
              {
                "time": "05:40",
                "title": "Git Basics"
              }
            ]
          },
          {
            "title": "Build Your Password Manager",
            "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "timestamps": [
              {
                "time": "00:00",
                "title": "Project Intro"
              },
              {
                "time": "05:00",
                "title": "JS Encryption"
              },
              {
                "time": "12:30",
                "title": "Final UI"
              }
            ]
          }
        ],
        "toolkits": [
          {
            "title": "Command Line Cheat Sheet",
            "type": "pdf",
            "url": "/resources/pdfs/cli-cheatsheet.pdf"
          },
          {
            "title": "GitHub Devlog Template",
            "type": "notion",
            "url": "https://notion.so/devlog-template"
          }
        ],
        "recommended_extensions": [
          "Bitwarden",
          "Privacy Badger",
          "uBlock Origin",
          "Notion Web Clipper"
        ]
      },
      "download_all_link": "/resources/vault.json"
    },
    {
      "id": "pathways",
      "title": "🌱 Pathways for Mastery",
      "description": "Tiered learning tracks designed to help you grow at your own pace.",
      "tiers": [
        "The Cyber Initiate – foundational digital habits + web security",
        "The Dev Alchemist – creative developer workflows",
        "The Quantum Explorer – quantum computing & AI",
        "The System Architect – personal & technical OS building"
      ],
      "link": "/labs/pathways"
    },
    {
      "id": "newsletter",
      "title": "📬 Join the Digest",
      "description": "Seasonal signal from the Kodξx vault. No noise. Just clarity.",
      "features": [
        "Tips from the forum",
        "New labs & projects",
        "Mindful tech rituals",
        "Lunar cycle reflections"
      ],
      "link": "/subscribe"
    },
    {
      "id": "learn-more",
      "title": "🔮 Learn More",
      "description": "Meet the mind behind KODΞX, read the manifesto, or find ways to contribute.",
      "buttons": [
        {
          "label": "About",
          "url": "/about"
        },
        {
          "label": "Manifesto",
          "url": "/manifesto"
        },
        {
          "label": "Collaborate",
          "url": "/collab"
        }
      ]
    }
  ]
};

// Resource type helpers
type ResourceType = "pdf" | "article" | "video" | "notion" | "github" | "other";

const getResourceIcon = (type: ResourceType) => {
  switch (type) {
    case "pdf":
      return <FileIcon className="h-5 w-5 text-rose-400" />;
    case "article":
      return <FileTextIcon className="h-5 w-5 text-blue-400" />;
    case "video":
      return <VideoIcon className="h-5 w-5 text-amber-400" />;
    case "notion":
      return <FileTextIcon className="h-5 w-5 text-gray-200" />;
    case "github":
      return <GithubIcon className="h-5 w-5 text-purple-400" />;
    default:
      return <BookIcon className="h-5 w-5 text-emerald-400" />;
  }
};

const getResourceActionText = (type: ResourceType) => {
  switch (type) {
    case "pdf":
      return "Open PDF";
    case "article":
      return "Read Article";
    case "video":
      return "Watch";
    case "notion":
      return "Open Template";
    case "github":
      return "View Repository";
    default:
      return "Open";
  }
};

// Resource card component
interface ResourceCardProps {
  title: string;
  type: ResourceType;
  url: string;
  description?: string;
  timestamps?: { time: string; title: string }[];
  tags?: string[];
  isNew?: boolean;
}

function ResourceCard({ title, type, url, description, timestamps, tags, isNew }: ResourceCardProps) {
  return (
    <GlassmorphicCard className="h-full transition-all duration-300 group hover:border-[#9ecfff]/40">
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getResourceIcon(type)}
            <span className="text-xs uppercase font-medium tracking-wider text-gray-400">{type}</span>
          </div>
          {isNew && (
            <Badge className="bg-[#5cdc96]/10 text-[#5cdc96] border border-[#5cdc96]/30 text-xs">
              New
            </Badge>
          )}
        </div>
        
        <h3 className="font-orbitron text-lg mb-2 group-hover:text-[#9ecfff] transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-400 mb-3 flex-grow">
            {description}
          </p>
        )}
        
        {timestamps && timestamps.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-medium text-gray-500 mb-2 block">Timestamps:</span>
            <div className="space-y-1.5 text-xs">
              {timestamps.map((timestamp, i) => (
                <div key={i} className="flex items-start">
                  <Badge className="bg-[#1e2535] border-[#9ecfff]/20 text-[#9ecfff] mr-2">
                    {timestamp.time}
                  </Badge>
                  <span className="text-gray-400 truncate">{timestamp.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, i) => (
              <Badge key={i} className="bg-[#1e293b]/70 text-gray-300 text-xs border border-[#9ecfff]/10">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#9ecfff] hover:underline"
          >
            {getResourceActionText(type)} <ExternalLinkIcon className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </GlassmorphicCard>
  );
}

// Pathway tier card component
function PathwayTierCard({ title, description, index }: { title: string; description: string; index: number }) {
  const colors = [
    "from-[#9ecfff]/10 to-[#9ecfff]/5 border-[#9ecfff]/20 hover:border-[#9ecfff]/40",
    "from-[#5cdc96]/10 to-[#5cdc96]/5 border-[#5cdc96]/20 hover:border-[#5cdc96]/40",
    "from-[#bb86fc]/10 to-[#bb86fc]/5 border-[#bb86fc]/20 hover:border-[#bb86fc]/40",
    "from-[#ff9e9e]/10 to-[#ff9e9e]/5 border-[#ff9e9e]/20 hover:border-[#ff9e9e]/40",
  ];
  
  const headingColors = [
    "text-[#9ecfff]",
    "text-[#5cdc96]",
    "text-[#bb86fc]",
    "text-[#ff9e9e]",
  ];
  
  return (
    <GlassmorphicCard className={`bg-gradient-to-br ${colors[index % colors.length]} transition-all duration-300`}>
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-[#1e2535]/80 border border-[#9ecfff]/20 flex items-center justify-center mr-3">
            <span className="font-orbitron text-sm">0{index + 1}</span>
          </div>
          <h3 className={`font-orbitron ${headingColors[index % headingColors.length]}`}>
            {title}
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {description}
        </p>
        <Button 
          variant="link"
          className={`text-xs p-0 ${headingColors[index % headingColors.length]} hover:underline`}
        >
          View Pathway <ArrowRightIcon className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </GlassmorphicCard>
  );
}

// Sidebar component
function ResourceSidebar() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Get topics from all resources
  const topics = [
    "All",
    "Cybersecurity",
    "Digital Minimalism",
    "Git & Terminal",
    "Password Management",
    "Development",
    "Quantum Computing",
  ];
  
  return (
    <div className="space-y-6">
      <GlassmorphicCard>
        <div className="p-6">
          <h3 className="font-orbitron text-lg mb-4">Filter Resources</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-10 bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Resource Type</label>
              <Select>
                <SelectTrigger className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2535] border-[#1e2535]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="notion">Notion Templates</SelectItem>
                  <SelectItem value="github">GitHub Repos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Topic</label>
              <Select>
                <SelectTrigger className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2535] border-[#1e2535]">
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic.toLowerCase()}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Sort By</label>
              <Select>
                <SelectTrigger className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50">
                  <SelectValue placeholder="Recently Added" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2535] border-[#1e2535]">
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40">
              <FilterIcon className="h-4 w-4 mr-2" /> Apply Filters
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
      
      <GlassmorphicCard className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-orbitron text-lg">Join the Digest</h3>
            <Moon className="h-4 w-4 text-[#9ecfff]" />
          </div>
          
          {isSubscribed ? (
            <div>
              <Badge className="bg-[#5cdc96]/10 text-[#5cdc96] border border-[#5cdc96]/30 mb-3">
                Subscribed
              </Badge>
              <p className="text-sm text-gray-400 mb-4">
                Thank you for joining! You'll receive your first digest with the next lunar cycle.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Seasonal signal from the Kodξx vault. No noise. Just clarity.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1e2535]/50 border-[#1e2535] focus:border-[#9ecfff]/50"
                />
                <Button 
                  className="w-full bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                  onClick={() => setIsSubscribed(true)}
                >
                  Subscribe
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="bg-gradient-to-r from-[#9ecfff]/10 to-[#bb86fc]/10 p-3 text-center border-t border-[#9ecfff]/10">
          <ul className="text-xs text-gray-400 space-y-1">
            {RESOURCE_VAULT_DATA.sections.find(s => s.id === "newsletter")?.features.map((feature, i) => (
              <li key={i}>• {feature}</li>
            ))}
          </ul>
        </div>
      </GlassmorphicCard>
      
      <GlassmorphicCard className="overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-orbitron text-lg">Suggest Resource</h3>
            <FilePlusIcon className="h-4 w-4 text-[#9ecfff]" />
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Have a resource that helped you? Suggest it to be added to the vault.
          </p>
          <Button 
            className="w-full bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40"
          >
            Submit Suggestion
          </Button>
        </div>
      </GlassmorphicCard>
    </div>
  );
}

// Main page component
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("essential");
  
  const resourceVaultSection = RESOURCE_VAULT_DATA.sections.find(section => section.id === "vault");
  const pathwaysSection = RESOURCE_VAULT_DATA.sections.find(section => section.id === "pathways");
  const learnMoreSection = RESOURCE_VAULT_DATA.sections.find(section => section.id === "learn-more");
  
  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-orbitron text-3xl tracking-wider mb-2">
            <span className="bg-gradient-to-r from-[#9ecfff] to-[#bb86fc] bg-clip-text text-transparent">
              {RESOURCE_VAULT_DATA.title}
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            {RESOURCE_VAULT_DATA.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          <div className="md:col-span-2 lg:col-span-3 space-y-8">
            {/* Resource Tabs */}
            <GlassmorphicCard>
              <Tabs defaultValue="essential" value={activeTab} onValueChange={setActiveTab}>
                <div className="p-4 border-b border-[#9ecfff]/10 overflow-x-auto">
                  <TabsList className="bg-[#1e2535]/80">
                    <TabsTrigger value="essential" className="data-[state=active]:bg-[#1e293b]">
                      Essential Reading
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="data-[state=active]:bg-[#1e293b]">
                      Video Tutorials
                    </TabsTrigger>
                    <TabsTrigger value="toolkits" className="data-[state=active]:bg-[#1e293b]">
                      Toolkits
                    </TabsTrigger>
                    <TabsTrigger value="extensions" className="data-[state=active]:bg-[#1e293b]">
                      Extensions
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="essential" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-orbitron text-xl">Essential Reading</h2>
                    <Button variant="link" className="text-[#9ecfff] text-xs">
                      View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourceVaultSection?.resources.essential_reading.map((resource, i) => (
                      <ResourceCard
                        key={i}
                        title={resource.title}
                        type={resource.type as ResourceType}
                        url={resource.url}
                        isNew={i === 0}
                        tags={['beginner', 'security']}
                        description="A comprehensive guide to securing your digital life. Covers basic to advanced techniques."
                      />
                    ))}
                    
                    {/* Additional Resources */}
                    <ResourceCard
                      title="Privacy-Focused Development"
                      type="article"
                      url="#"
                      description="Learn how to integrate privacy by design into your development workflow."
                      tags={['intermediate', 'privacy', 'dev-practices']}
                    />
                    
                    <ResourceCard
                      title="Quantum Computing for Beginners"
                      type="pdf"
                      url="#"
                      description="An introduction to quantum computing concepts without the complex math."
                      tags={['beginner', 'quantum', 'future-tech']}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="videos" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-orbitron text-xl">Video Tutorials</h2>
                    <Button variant="link" className="text-[#9ecfff] text-xs">
                      View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourceVaultSection?.resources.video_playlists.map((video, i) => (
                      <ResourceCard
                        key={i}
                        title={video.title}
                        type="video"
                        url={video.youtube_url}
                        timestamps={video.timestamps}
                        description="A step-by-step guide to mastering essential terminal commands and Git workflow."
                        tags={i === 0 ? ['beginner', 'terminal', 'git'] : ['intermediate', 'security', 'javascript']}
                      />
                    ))}
                    
                    {/* Additional Videos */}
                    <ResourceCard
                      title="Web3 Security Analysis"
                      type="video"
                      url="#"
                      description="Deep dive into smart contract vulnerabilities and how to prevent them."
                      timestamps={[
                        { time: "00:00", title: "Introduction" },
                        { time: "05:30", title: "Common Exploits" },
                        { time: "15:45", title: "Audit Process" }
                      ]}
                      tags={['advanced', 'web3', 'security']}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="toolkits" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-orbitron text-xl">Toolkits & Templates</h2>
                    <Button variant="link" className="text-[#9ecfff] text-xs">
                      View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourceVaultSection?.resources.toolkits.map((toolkit, i) => (
                      <ResourceCard
                        key={i}
                        title={toolkit.title}
                        type={toolkit.type as ResourceType}
                        url={toolkit.url}
                        description={i === 0 ? "Essential command line references for daily development tasks." : "A template for tracking your project development with structured sections."}
                        tags={i === 0 ? ['reference', 'terminal'] : ['productivity', 'template']}
                      />
                    ))}
                    
                    {/* Additional Toolkits */}
                    <ResourceCard
                      title="API Security Checklist"
                      type="github"
                      url="#"
                      description="A comprehensive checklist for securing your APIs before deployment."
                      tags={['security', 'api', 'checklist']}
                    />
                    
                    <ResourceCard
                      title="Custom Keyboard Shortcuts Template"
                      type="notion"
                      url="#"
                      description="Track and customize your keyboard shortcuts across different applications."
                      tags={['productivity', 'workflow']}
                      isNew={true}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="extensions" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-orbitron text-xl">Recommended Extensions</h2>
                    <Button variant="link" className="text-[#9ecfff] text-xs">
                      View All <ArrowRightIcon className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourceVaultSection?.resources.recommended_extensions.map((extension, i) => (
                      <ResourceCard
                        key={i}
                        title={extension}
                        type="other"
                        url="#"
                        description={
                          i === 0 ? "Secure password manager with browser integration." :
                          i === 1 ? "Block trackers before they load to protect your privacy." :
                          i === 2 ? "Efficient and effective ad blocker with customizable filters." :
                          "Save web pages to your Notion workspace with one click."
                        }
                        tags={['browser', 'extension']}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </GlassmorphicCard>
            
            {/* Pathways for Mastery */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-2xl">
                  <span className="bg-gradient-to-r from-[#9ecfff] to-[#5cdc96] bg-clip-text text-transparent">
                    {pathwaysSection?.title}
                  </span>
                </h2>
                <Button asChild variant="link" className="text-[#9ecfff]">
                  <Link href={pathwaysSection?.link || "#"}>View All Pathways</Link>
                </Button>
              </div>
              
              <p className="text-gray-400 mb-6 max-w-2xl">
                {pathwaysSection?.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pathwaysSection?.tiers.map((tier, i) => {
                  const [title, description] = tier.split(" – ");
                  return (
                    <PathwayTierCard 
                      key={i} 
                      title={title} 
                      description={description} 
                      index={i} 
                    />
                  );
                })}
              </div>
            </section>
            
            {/* Learn More Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-2xl">
                  <span className="bg-gradient-to-r from-[#bb86fc] to-[#ff9e9e] bg-clip-text text-transparent">
                    {learnMoreSection?.title}
                  </span>
                </h2>
              </div>
              
              <p className="text-gray-400 mb-6 max-w-2xl">
                {learnMoreSection?.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {learnMoreSection?.buttons.map((button, i) => (
                  <Button
                    key={i}
                    asChild
                    className="bg-[#1e2535]/70 hover:bg-[#1e2535] border border-[#9ecfff]/20 hover:border-[#9ecfff]/40 relative overflow-hidden group"
                  >
                    <Link href={button.url}>
                      <span className="relative z-10">{button.label}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#9ecfff]/0 to-[#9ecfff]/0 group-hover:from-[#9ecfff]/10 group-hover:to-[#9ecfff]/0 transition-all duration-300 ease-out"></span>
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
            
            {/* Download All */}
            <section className="mt-10">
              <GlassmorphicCard className="p-6 bg-gradient-to-br from-[#1e2535]/80 to-[#1e2535]/60">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="font-orbitron text-xl mb-2">Download All Resources</h3>
                    <p className="text-gray-400 text-sm">
                      Get the entire resource collection as a JSON file for offline access.
                    </p>
                  </div>
                  
                  <Button 
                    className="bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#88c9b7]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                    asChild
                  >
                    <a 
                      href={resourceVaultSection?.download_all_link} 
                      download
                    >
                      <Download className="h-4 w-4 mr-2" /> Download Vault
                    </a>
                  </Button>
                </div>
              </GlassmorphicCard>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1 h-full">
            <ResourceSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}