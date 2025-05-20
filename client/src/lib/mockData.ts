// Mock data for development
export const MOCK_LABS = [
  {
    id: 1,
    title: "Quantum Computing Basics",
    description: "Learn the fundamentals of quantum computing and create your first quantum circuit.",
    difficulty: "beginner",
    xpReward: 500,
    createdAt: "2025-05-15T00:00:00.000Z",
    updatedAt: "2025-05-15T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Neural Network Foundations",
    description: "Build a simple neural network from scratch and understand the math behind it.",
    difficulty: "intermediate",
    xpReward: 750,
    createdAt: "2025-05-14T00:00:00.000Z",
    updatedAt: "2025-05-14T00:00:00.000Z"
  },
  {
    id: 3,
    title: "Blockchain Development",
    description: "Create your own blockchain and understand distributed ledger technology.",
    difficulty: "advanced",
    xpReward: 1000,
    createdAt: "2025-05-13T00:00:00.000Z",
    updatedAt: "2025-05-13T00:00:00.000Z"
  }
];

export const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Mindful Meditation App",
    description: "Build a meditation app with guided sessions and progress tracking.",
    difficulty: "beginner",
    repoUrl: "https://github.com/example/meditation-app",
    xpReward: 800,
    createdAt: "2025-05-15T00:00:00.000Z",
    updatedAt: "2025-05-15T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Cyber Security Dashboard",
    description: "Create a dashboard to monitor and visualize security threats in real-time.",
    difficulty: "intermediate",
    repoUrl: "https://github.com/example/security-dashboard",
    xpReward: 1200,
    createdAt: "2025-05-14T00:00:00.000Z",
    updatedAt: "2025-05-14T00:00:00.000Z"
  },
  {
    id: 3,
    title: "Decentralized AI Marketplace",
    description: "Build a platform for trading AI models on a decentralized network.",
    difficulty: "advanced",
    repoUrl: "https://github.com/example/ai-marketplace",
    xpReward: 1500,
    createdAt: "2025-05-13T00:00:00.000Z",
    updatedAt: "2025-05-13T00:00:00.000Z"
  }
];

export const FORUM_CATEGORIES = {
  "DISCUSSION": {
    label: "DISCUSSION",
    color: "#8b5cf6", 
    route: "/forum/categories/discussion"
  },
  "RESOURCES": {
    label: "RESOURCES",
    color: "#10b981",
    route: "/forum/categories/resources"
  },
  "SHOWCASE": {
    label: "SHOWCASE",
    color: "#facc15",
    route: "/forum/categories/showcase"
  },
  "QUESTIONS": {
    label: "QUESTIONS",
    color: "#3b82f6",
    route: "/forum/categories/questions"
  },
  "FEEDBACK": {
    label: "FEEDBACK",
    color: "#f87171",
    route: "/forum/categories/feedback"
  },
  "ANNOUNCEMENTS": {
    label: "ANNOUNCEMENTS",
    color: "#e879f9",
    route: "/forum/categories/announcements"
  }
};

export const TRENDING_TAGS = [
  { label: "#quantum", count: 42, route: "/forum/tags/quantum" },
  { label: "#security", count: 35, route: "/forum/tags/security" },
  { label: "#ethical-hacking", count: 29, route: "/forum/tags/ethical-hacking" },
  { label: "#zero-knowledge", count: 23, route: "/forum/tags/zero-knowledge" },
  { label: "#mindfulness", count: 18, route: "/forum/tags/mindfulness" }
];

export const MOCK_FORUM_POSTS = [
  {
    id: 1,
    title: "How to secure your network with Quantum-resistant cryptography",
    content: "With the rapid advancement of quantum computing, our current encryption methods are becoming increasingly vulnerable. In this comprehensive guide, I'll walk through implementing quantum-resistant cryptography for your personal and enterprise networks, focusing on practical solutions that balance security with performance considerations.\n\nQuantum threats to classical cryptography:\n- Shor's algorithm can efficiently break RSA and ECC\n- Grover's algorithm reduces symmetric key security by half\n- Most PKI infrastructure relies on vulnerable algorithms\n\nImplementation steps:\n1. Assess your current cryptographic landscape\n2. Prioritize high-value data for protection\n3. Implement hybrid approaches where possible\n4. Monitor NIST standardization progress\n\nI've also included benchmark results comparing traditional vs. quantum-resistant approaches on various hardware configurations. The performance impact is significant but manageable with proper optimization.",
    category: "RESOURCES",
    tags: ["#quantum", "#security", "#cryptography"],
    likes: 156,
    isFeatured: true,
    createdAt: "2025-05-18T16:00:00Z",
    user: {
      id: "user001",
      username: "CyberSage",
      profileImageUrl: "https://ui-avatars.com/api/?name=Cyber+Sage",
      totalXp: 7450
    },
    commentsCount: 24
  },
  {
    id: 2,
    title: "Tips for managing digital anxiety in 2025",
    content: "As we navigate this hyper-connected era, I've found several practices to reduce the mental toll of constant connectivity. Mindful media consumption, digital sabbaticals, and intentional notification settings have substantially improved my wellbeing. What strategies work for you?\n\nSome practices that have worked for me:\n- Daily digital sunset: No screens 1 hour before bed\n- Notification batching: Only check emails/messages 3x daily\n- Mindful consumption filters: Curated news sources only\n- Weekly tech-free day: One day completely unplugged\n\nI've documented my progress over 6 months and found significant improvements in sleep quality, focus, and overall well-being. The first two weeks were difficult, but the benefits compound over time.",
    category: "DISCUSSION",
    tags: ["#mindfulness", "#digital-health", "#tech-balance"],
    likes: 24,
    createdAt: "2025-05-17T16:00:00Z",
    user: {
      id: "user123",
      username: "zenDeveloper",
      profileImageUrl: "https://ui-avatars.com/api/?name=Zen+Developer",
      totalXp: 3450
    },
    commentsCount: 8
  },
  {
    id: 3,
    title: "Understanding Zero-Knowledge Proofs",
    content: "I'm working through the latest ZK technologies and would appreciate insights from anyone who has practical experience implementing them in real-world applications. What libraries are you using? Any particular challenges or success stories to share?\n\nSpecifically, I'm looking at:\n- zk-SNARKs vs. zk-STARKs performance tradeoffs\n- Practical applications beyond cryptocurrency\n- Implementation challenges in resource-constrained environments\n- Current state of developer tooling\n\nI've experimented with circom and snarkjs but found the learning curve quite steep. Are there more accessible entry points or comprehensive tutorials you would recommend?",
    category: "QUESTIONS",
    tags: ["#zero-knowledge", "#cryptography", "#blockchain"],
    likes: 31,
    createdAt: "2025-05-16T14:30:00Z",
    user: {
      id: "user456",
      username: "cryptoflow",
      profileImageUrl: "https://ui-avatars.com/api/?name=Crypto+Flow",
      totalXp: 5280
    },
    commentsCount: 12
  },
  {
    id: 4,
    title: "Just launched: Ethical Tech Resource Vault",
    content: "After six months of curation, I'm excited to share a comprehensive collection of tools, frameworks, and guides focused on ethical technology development. It includes considerations for accessibility, environmental impact, and social implications. Feedback welcome!\n\nThe resource vault includes:\n- Ethical frameworks for AI development\n- Accessibility toolkits and checklists\n- Carbon impact calculators for digital products\n- Inclusive design principles and templates\n- Privacy-preserving development guides\n\nCheck out the full repository at [github.com/mindfulbuilder/ethical-tech-vault](https://github.com) and feel free to contribute or suggest additional resources.",
    category: "SHOWCASE",
    tags: ["#ethical-tech", "#resources", "#accessibility"],
    likes: 87,
    createdAt: "2025-05-14T09:15:00Z",
    user: {
      id: "user789",
      username: "mindfulbuilder",
      profileImageUrl: "https://ui-avatars.com/api/?name=Mindful+Builder",
      totalXp: 8730
    },
    commentsCount: 23
  },
  {
    id: 5,
    title: "Upcoming Platform Updates - May 2025",
    content: "We're excited to announce several major updates coming to KODΞX over the next month. New features include enhanced visualization tools for quantum computing labs, expanded project templates, and a completely redesigned collaborative workspace. Check out the detailed roadmap and leave your thoughts!\n\nKey updates coming:\n1. Interactive quantum circuit visualizer (May 25)\n2. 12 new project templates across all difficulty levels (May 28)\n3. Real-time collaborative coding environment (June 2)\n4. Expanded resources section with integrated practice environments (June 10)\n\nWe're looking for beta testers for these features - reply here if you're interested in early access and providing feedback!",
    category: "ANNOUNCEMENTS",
    tags: ["#platform-updates", "#new-features", "#kodex-news"],
    likes: 63,
    createdAt: "2025-05-13T10:45:00Z",
    user: {
      id: "admin001",
      username: "kodex_team",
      profileImageUrl: "https://ui-avatars.com/api/?name=KODEX+Team",
      totalXp: 12000
    },
    commentsCount: 19
  },
  {
    id: 6,
    title: "Lab Structure Feedback Needed",
    content: "As someone who's completed most of the quantum computing labs, I have some thoughts on how the progression could be improved. The jump from intermediate to advanced concepts feels too steep. Would love to hear if others have experienced this and any suggestions for bridging the gap.\n\nSpecific pain points:\n- Transition from basic superposition to complex entanglement operations\n- Limited practical exercises between theoretical concepts\n- Advanced error correction techniques introduced too abruptly\n\nI think adding 1-2 intermediate labs focusing specifically on practical quantum algorithm implementation would make the learning journey smoother. Anyone else have similar experiences or other suggestions?",
    category: "FEEDBACK",
    tags: ["#labs", "#learning-path", "#quantum"],
    likes: 42,
    createdAt: "2025-05-12T18:20:00Z",
    user: {
      id: "user567",
      username: "quantum_learner",
      profileImageUrl: "https://ui-avatars.com/api/?name=Quantum+Learner",
      totalXp: 6120
    },
    commentsCount: 15
  }
];

export const MOCK_DASHBOARD_DATA = {
  labProgress: [
    {
      lab: MOCK_LABS[0],
      progress: {
        completedTasks: [1, 2, 3],
        xpEarned: 300,
        isCompleted: false,
        notes: "Need to review quantum gates concept again."
      }
    }
  ],
  projectProgress: [
    {
      project: MOCK_PROJECTS[0],
      progress: {
        completedTasks: [1, 2],
        xpEarned: 400,
        isCompleted: false,
        notes: "User authentication working, still need to implement progress tracking."
      }
    }
  ],
  badges: [
    {
      id: 1,
      name: "Beginner's Mind",
      description: "Completed your first lab",
      iconUrl: null
    },
    {
      id: 2,
      name: "Builder",
      description: "Started your first project",
      iconUrl: null
    }
  ]
};