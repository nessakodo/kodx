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