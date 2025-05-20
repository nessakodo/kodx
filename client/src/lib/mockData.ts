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
    title: "Build Your Own Password Manager",
    description: "Create a local password manager app using JavaScript, secure storage patterns, and a minimal UI with encryption best practices.",
    difficulty: "beginner",
    repoUrl: "https://github.com/nessakodo/password-manager-starter",
    xpReward: 40,
    createdAt: "2025-05-15T00:00:00.000Z",
    updatedAt: "2025-05-15T00:00:00.000Z",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timestamps: [
      { time: "00:00", title: "Project Intro" },
      { time: "01:25", title: "Setting up HTML/CSS" },
      { time: "05:40", title: "JavaScript encryption logic" },
      { time: "12:10", title: "UI hooks and button interactions" },
      { time: "18:45", title: "Finishing touches" }
    ],
    tasks: [
      { id: "task-1", description: "Set up base HTML and CSS structure", completed: false },
      { id: "task-2", description: "Add form inputs for site/account and password fields", completed: false },
      { id: "task-3", description: "Use Web Crypto API or a JS library to encrypt password data", completed: false },
      { id: "task-4", description: "Store and retrieve encrypted data using localStorage or IndexedDB", completed: false },
      { id: "task-5", description: "Implement copy-to-clipboard and password visibility toggle", completed: false },
      { id: "task-6", description: "Style the interface with dark theme and finalize layout", completed: false },
      { id: "task-7", description: "Deploy the finished version to GitHub Pages", completed: false }
    ]
  },
  {
    id: 2,
    title: "Cyber Security Dashboard",
    description: "Create a dashboard to monitor and visualize security threats in real-time.",
    difficulty: "intermediate",
    repoUrl: "https://github.com/example/security-dashboard",
    xpReward: 80,
    createdAt: "2025-05-14T00:00:00.000Z",
    updatedAt: "2025-05-14T00:00:00.000Z",
    tasks: [
      { id: "task-1", description: "Set up project structure with proper modules", completed: false },
      { id: "task-2", description: "Implement data visualization components", completed: false },
      { id: "task-3", description: "Add real-time updates with WebSockets", completed: false },
      { id: "task-4", description: "Create threat classification algorithms", completed: false },
      { id: "task-5", description: "Implement user authentication and roles", completed: false },
      { id: "task-6", description: "Add notification system for critical alerts", completed: false }
    ]
  },
  {
    id: 3,
    title: "Decentralized AI Marketplace",
    description: "Build a platform for trading AI models on a decentralized network.",
    difficulty: "advanced",
    repoUrl: "https://github.com/example/ai-marketplace",
    xpReward: 120,
    createdAt: "2025-05-13T00:00:00.000Z",
    updatedAt: "2025-05-13T00:00:00.000Z",
    tasks: [
      { id: "task-1", description: "Set up blockchain integration for transactions", completed: false },
      { id: "task-2", description: "Implement AI model verification system", completed: false },
      { id: "task-3", description: "Create decentralized storage solution", completed: false },
      { id: "task-4", description: "Build smart contract for model ownership", completed: false },
      { id: "task-5", description: "Develop front-end marketplace interface", completed: false },
      { id: "task-6", description: "Implement secure payment and escrow system", completed: false },
      { id: "task-7", description: "Add reputation and review mechanisms", completed: false }
    ]
  }
];

export const MOCK_FORUM_POSTS = [
  {
    id: 1,
    title: "Balancing tech productivity and mindfulness",
    content: "I've been struggling with maintaining mindfulness while coding for long hours. What techniques have worked for you?",
    category: "discussion",
    likes: 24,
    createdAt: "2025-05-15T00:00:00.000Z",
    user: {
      id: "user-123",
      username: "zenDeveloper",
      profileImageUrl: "https://ui-avatars.com/api/?name=Zen+Developer",
      totalXp: 3000
    },
    commentsCount: 12
  },
  {
    id: 2,
    title: "Resources for ethical AI development",
    content: "I'm starting a project on AI ethics and looking for resources. Any recommendations?",
    category: "resources",
    likes: 18,
    createdAt: "2025-05-14T00:00:00.000Z",
    user: {
      id: "user-456",
      username: "ethicalCoder",
      profileImageUrl: "https://ui-avatars.com/api/?name=Ethical+Coder",
      totalXp: 2500
    },
    commentsCount: 8
  },
  {
    id: 3,
    title: "My experience with quantum computing lab",
    content: "Just completed the quantum computing lab and wanted to share some insights...",
    category: "showcase",
    likes: 32,
    createdAt: "2025-05-13T00:00:00.000Z",
    user: {
      id: "user-789",
      username: "quantumLeap",
      profileImageUrl: "https://ui-avatars.com/api/?name=Quantum+Leap",
      totalXp: 4200
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