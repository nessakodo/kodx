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
    label: "Discussion",
    color: "#8b5cf6", 
    route: "/forum/categories/discussion"
  },
  "RESOURCES": {
    label: "Resources",
    color: "#10b981",
    route: "/forum/categories/resources"
  },
  "SHOWCASE": {
    label: "Showcase",
    color: "#facc15",
    route: "/forum/categories/showcase"
  },
  "QUESTIONS": {
    label: "Questions",
    color: "#3b82f6",
    route: "/forum/categories/questions"
  },
  "FEEDBACK": {
    label: "Feedback",
    color: "#f87171",
    route: "/forum/categories/feedback"
  },
  "ANNOUNCEMENTS": {
    label: "Announcements",
    color: "#e879f9",
    route: "/forum/categories/announcements"
  }
};

export const TRENDING_TAGS = [
  { label: "#quantum", count: 42, route: "/forum/tags/quantum" },
  { label: "#security", count: 35, route: "/forum/tags/security" },
  { label: "#ethical-hacking", count: 29, route: "/forum/tags/ethical-hacking" },
  { label: "#zero-knowledge", count: 23, route: "/forum/tags/zero-knowledge" },
  { label: "#mindfulness", count: 18, route: "/forum/tags/mindfulness" },
  { label: "#learning-path", count: 16, route: "/forum/tags/learning-path" },
  { label: "#qiskit", count: 14, route: "/forum/tags/qiskit" },
  { label: "#rust", count: 13, route: "/forum/tags/rust" },
  { label: "#blockchain", count: 12, route: "/forum/tags/blockchain" },
  { label: "#burnout", count: 10, route: "/forum/tags/burnout" },
  { label: "#flow", count: 9, route: "/forum/tags/flow" }
];

export const MOCK_FORUM_POSTS = [
  {
    id: 1,
    title: "From Quantum Confusion to Clarity: A Beginner's Map",
    content: "After months feeling lost in Qiskit docs, I finally mapped out a learning sequence that actually worked. Sharing it here — hopefully it helps others on this wild quantum ride.\n\nMy Quantum Learning Path:\n\n1. Start with basic quantum computing principles - superposition, entanglement, and quantum gates\n2. Build foundational math skills - complex numbers, linear algebra, and probability theory\n3. Practice with simple circuits before diving into algorithms\n4. Use visualization tools (Bloch spheres, circuit diagrams) to build intuition\n5. Join study groups and forums (like this one!) to discuss concepts\n\nKey resources that helped me break through:\n- Qiskit Textbook chapters 1-3 (read BEFORE trying any code)\n- 'Quantum Computing for Computer Scientists' book\n- QuantumKatas on GitHub for hands-on exercises\n- Drawing circuits on paper before implementing them\n\nThe biggest breakthrough came when I stopped trying to perfectly understand everything and started building simple circuits. Experimentation helped me develop intuition that textbooks couldn't provide.",
    category: "RESOURCES",
    tags: ["#quantum", "#qiskit", "#learning-path"],
    likes: 138,
    isFeatured: true,
    createdAt: "2025-05-18T16:00:00Z",
    user: {
      id: "user001",
      username: "quantumOracle",
      profileImageUrl: "https://ui-avatars.com/api/?name=Quantum+Oracle",
      totalXp: 7450
    },
    commentsCount: 19
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
  },
  {
    id: 7,
    title: "Flow state vs. burnout in security work",
    content: "I've been exploring the line between deep focus and burnout while doing high-stakes pentesting. Anyone else ride this edge?\n\nAfter years in cybersecurity, I've noticed a concerning pattern: the same flow state that makes us excel at security work can lead straight to burnout if not carefully managed.\n\nMy observations:\n- The hyper-focus needed for vulnerability analysis creates a dopamine loop that can be addictive\n- Security work often involves 'negative creativity' (thinking about how things break) which can be mentally taxing\n- The high-stakes nature of the work creates pressure that's both motivating and exhausting\n\nStrategies I'm testing:\n- Time-boxing intensive analysis sessions to 90 minutes maximum\n- Alternating between offensive and defensive security tasks\n- Mindfulness practices specifically designed for high-cognitive-load work\n\nI'd love to hear from other security professionals about how you manage this balance.",
    category: "DISCUSSION",
    tags: ["#burnout", "#mindfulness", "#security"],
    likes: 17,
    createdAt: "2025-05-16T14:20:00Z",
    user: {
      id: "user568",
      username: "cyberLotus",
      profileImageUrl: "https://ui-avatars.com/api/?name=Cyber+Lotus",
      totalXp: 5430
    },
    commentsCount: 15
  },
  {
    id: 8,
    title: "Terminal rituals to start your coding day",
    content: "Curious what practices help you enter the zone. I start each session with breathwork + a Bash mantra. Share yours!\n\nOver the past year, I've been experimenting with different rituals to transition my mind into a focused coding state. My current routine involves:\n\n1. Three minutes of 4-7-8 breathing (4 count inhale, 7 count hold, 8 count exhale)\n2. Running a custom Bash script that displays a randomized coding mantra and clears my workspace\n3. Setting an intention for the session in writing\n\nThe script includes affirmations like:\n```bash\necho \"You build with intention, not distraction\"\necho \"Each line of code is a deliberate creation\"\necho \"Complexity yields to patient exploration\"\n```\n\nI've found this helps create a consistent mental environment regardless of physical location. Has anyone else developed specific rituals or scripts to help transition into focused work?",
    category: "DISCUSSION",
    tags: ["#rituals", "#terminal", "#flow"],
    likes: 43,
    createdAt: "2025-05-17T09:20:00Z",
    user: {
      id: "user569",
      username: "terminalMuse",
      profileImageUrl: "https://ui-avatars.com/api/?name=Terminal+Muse",
      totalXp: 4920
    },
    commentsCount: 9
  },
  {
    id: 9,
    title: "What's the best way to learn Rust in 2025?",
    content: "Rust is booming. Any solid guides, YouTubers, or creative ways to master it without getting overwhelmed?\n\nWith Rust continuing to gain adoption across systems programming, web development, and now AI infrastructure, I'm ready to dive in. However, the learning resources seem vast and sometimes contradictory.\n\nI'm particularly interested in:\n- Resources that emphasize practical projects over academic theory\n- Approaches that help build mental models of ownership and borrowing\n- Learning paths that connect Rust concepts to other language paradigms\n- Communities that are welcoming to beginners asking foundational questions\n\nMy background is primarily Python and JavaScript, and previous attempts to learn Rust left me feeling overwhelmed by the borrow checker. Any recommendations for resources specifically designed for people coming from high-level languages?",
    category: "QUESTIONS",
    tags: ["#rust", "#learning", "#2025"],
    likes: 59,
    createdAt: "2025-05-17T11:15:00Z",
    user: {
      id: "user570",
      username: "rootflow",
      profileImageUrl: "https://ui-avatars.com/api/?name=Root+Flow",
      totalXp: 3840
    },
    commentsCount: 14
  },
  {
    id: 10,
    title: "Building trustless systems with ZK proofs",
    content: "Built my first proof using snarkJS and circom — wild stuff. Excited to hear how others are experimenting.\n\nAfter months of theoretical study, I finally implemented my first zero-knowledge application - a credential verification system that proves educational qualifications without revealing personal data.\n\nKey components I used:\n- circom for circuit design\n- snarkJS for proof generation and verification\n- Groth16 proving system\n- Solidity for on-chain verification\n\nThe most challenging aspect was designing circuits that balanced expressiveness with efficiency. My initial implementations had prohibitive proving times (~3 minutes), but after optimization, I got it down to around 20 seconds.\n\nI'm particularly interested in how others are balancing privacy guarantees with user experience. Have you found any clever optimizations or UX patterns that make ZK applications more accessible to non-technical users?",
    category: "SHOWCASE",
    tags: ["#zero-knowledge", "#zkp", "#blockchain"],
    likes: 53,
    createdAt: "2025-05-13T16:40:00Z",
    user: {
      id: "user571",
      username: "codedSage",
      profileImageUrl: "https://ui-avatars.com/api/?name=Coded+Sage",
      totalXp: 6750
    },
    commentsCount: 21
  },
  {
    id: 11,
    title: "My first CTF write-up: lessons + takeaways",
    content: "Just published my first CTF write-up and wanted to share what I learned from the experience.\n\nAfter participating in the KOD∙X Defensive CTF last month, I finally published my complete write-up documenting my approach, tools, and mental process. This was my first time not only competing but also writing up my methodology.\n\nKey lessons learned:\n\n1. Documentation during the challenge is crucial - I used Obsidian with a custom CTF template to capture all commands, outputs, and thought processes\n2. Screenshots with annotations help tremendously when explaining visual aspects of exploitation\n3. Explaining your failures is often more valuable than just showcasing successful techniques\n4. Using ASCII diagrams to visualize attack paths makes complex exploits more understandable\n\nI found that writing the explanation forced me to develop a deeper understanding of the vulnerabilities I was exploiting. Concepts I thought I understood completely revealed gaps in my knowledge when I tried to explain them clearly.\n\nMy write-up is available at: [github.com/glitchcraft/kodex-ctf-2025](https://github.com) (includes full code samples and step-by-step walkthrough)",
    category: "SHOWCASE",
    tags: ["#ctf", "#writeup", "#ethical-hacking"],
    likes: 86,
    createdAt: "2025-05-12T10:30:00Z",
    user: {
      id: "user572",
      username: "glitchcraft",
      profileImageUrl: "https://ui-avatars.com/api/?name=Glitch+Craft",
      totalXp: 5230
    },
    commentsCount: 7
  },
  {
    id: 12,
    title: "Open source as sacred tech practice",
    content: "Exploring how open-source dev can feel like spiritual offering — a practice of contribution and intention.\n\nOver the past few years, I've begun approaching open source contribution as a form of techno-spiritual practice - a way of creating meaning through mindful technical creation. This perspective has completely transformed how I select projects and contribute code.\n\nSome elements of this approach include:\n\n- Treating PRs as offerings rather than achievements\n- Setting intentions before coding sessions\n- Focusing on how my contributions might benefit others I'll never meet\n- Maintaining presence and attention to detail as a form of respect\n- Approaching documentation as a teaching practice\n\nThis mindset has helped me find deep satisfaction even when working on unglamorous tasks like fixing edge cases, improving error messages, or clarifying documentation. It's also made me more resilient to the occasional project maintainer who might be having a rough day.\n\nHas anyone else found ways to infuse meaning and purpose into their technical work beyond the functional outcomes?",
    category: "RESOURCES",
    tags: ["#opensource", "#spirituality", "#tech"],
    likes: 88,
    createdAt: "2025-05-15T14:20:00Z",
    user: {
      id: "user573",
      username: "nighthawkZero",
      profileImageUrl: "https://ui-avatars.com/api/?name=Nighthawk+Zero",
      totalXp: 7830
    },
    commentsCount: 20
  },
  {
    id: 13,
    title: "How I use TouchDesigner in my pen-testing demos",
    content: "TouchDesigner is usually seen as a VJ tool, but I've been fusing it with Kali Linux and OBS. Here's how it plays out in demos.\n\nAfter years of delivering technical security presentations with standard slides and terminal windows, I started experimenting with TouchDesigner to create more engaging and conceptually clear demonstrations.\n\nMy current setup includes:\n\n1. A custom TouchDesigner interface that visualizes network traffic in real-time during exploitation\n2. Integration with Kali Linux tools via Python scripting and UDP messaging\n3. Visual representations of data exfiltration and lateral movement that help non-technical audiences grasp the concepts\n4. Dynamic highlighting of code and process relationships during explanation\n\nThe most effective aspect has been creating visualizations that respond to actual attack techniques as they're performed. For example, when demonstrating SQL injection, the interface shows the query structure being manipulated and database tables being exposed in a visual format that's much more intuitive than watching raw SQL commands.\n\nThe response from clients has been overwhelmingly positive - especially from management and board members who previously struggled to understand the technical details of penetration testing reports.\n\nHappy to share some example patches if anyone's interested in this approach!",
    category: "SHOWCASE",
    tags: ["#touchdesigner", "#demos", "#pentesting"],
    likes: 33,
    createdAt: "2025-05-15T09:15:00Z",
    user: {
      id: "user574",
      username: "synaptek",
      profileImageUrl: "https://ui-avatars.com/api/?name=Synaptek",
      totalXp: 6480
    },
    commentsCount: 5
  }
];

// Standard dashboard data for existing users
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
  ],
  reflections: [
    {
      id: 1,
      title: "Quantum Computing Basics",
      section: "Introduction",
      content: "Qubit superposition and entanglement enable quantum parallelism. Need to review H-gate operations and Bell states further.",
      updatedAt: "2025-05-19T00:00:00.000Z",
      type: "Lab"
    },
    {
      id: 2,
      title: "Mindful Meditation App",
      section: "Security Implementation",
      content: "Implemented encryption for user meditation history. Need to add validation and sanitization for meditation entry descriptions.",
      updatedAt: "2025-05-17T00:00:00.000Z",
      type: "Project"
    }
  ]
};

// Empty dashboard data for new users
export const EMPTY_DASHBOARD_DATA = {
  labProgress: [],
  projectProgress: [],
  badges: [],
  reflections: []
};