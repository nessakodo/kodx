import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { 
  users, labs, projects, badges, userBadges, 
  labProgress, projectProgress, forumPosts, 
  forumComments, userPostLikes, userCommentLikes,
  userSavedPosts, newsletterSubscribers, insertNewsletterSubscriberSchema
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth endpoints are now handled by replitAuth.ts
  
  // User profile endpoint - Protected route example
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...safeUserData } = user;
      return res.json(safeUserData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Labs routes
  app.get("/api/labs", async (req, res) => {
    try {
      const allLabs = await db.select().from(labs).orderBy(labs.id);
      if (allLabs.length === 0) {
        // Import mock data if needed
        const { MOCK_LABS } = await import('./mock-data');
        return res.json(MOCK_LABS);
      }
      res.json(allLabs);
    } catch (error) {
      console.error("Error fetching labs:", error);
      // Return mock data on error
      const { MOCK_LABS } = await import('./mock-data');
      return res.json(MOCK_LABS);
    }
  });

  app.get("/api/labs/:id", async (req, res) => {
    try {
      const labId = parseInt(req.params.id);
      const [lab] = await db.select().from(labs).where(eq(labs.id, labId));
      
      if (!lab) {
        // Try to find in mock data
        const { MOCK_LABS } = await import('./mock-data');
        const mockLab = MOCK_LABS.find(l => l.id === labId);
        if (mockLab) {
          return res.json(mockLab);
        }
        return res.status(404).json({ message: "Lab not found" });
      }
      
      res.json(lab);
    } catch (error) {
      console.error("Error fetching lab:", error);
      
      // Try mock data on error
      try {
        const { MOCK_LABS } = await import('./mock-data');
        const labId = parseInt(req.params.id);
        const mockLab = MOCK_LABS.find(l => l.id === labId);
        if (mockLab) {
          return res.json(mockLab);
        }
      } catch (e) {
        console.error("Error loading mock data:", e);
      }
      
      res.status(500).json({ message: "Failed to fetch lab" });
    }
  });

  app.post("/api/labs/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const labId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if lab exists
      const [lab] = await db.select().from(labs).where(eq(labs.id, labId));
      if (!lab) {
        return res.status(404).json({ message: "Lab not found" });
      }
      
      // Update or create lab progress
      const [existingProgress] = await db.select().from(labProgress)
        .where(and(
          eq(labProgress.userId, userId),
          eq(labProgress.labId, labId)
        ));
      
      if (existingProgress) {
        // Update existing progress
        const [updated] = await db
          .update(labProgress)
          .set({ 
            isCompleted: true, 
            xpEarned: lab.xpReward,
            updatedAt: new Date()
          })
          .where(and(
            eq(labProgress.userId, userId),
            eq(labProgress.labId, labId)
          ))
          .returning();
        
        // Update user's total XP if they haven't already earned XP for this lab
        if (!existingProgress.isCompleted && existingProgress.xpEarned !== lab.xpReward) {
          // Get current user first
          const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
          
          // Then update with calculated new total
          await db
            .update(users)
            .set({ 
              totalXp: (currentUser?.totalXp || 0) + lab.xpReward,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));
        }
        
        res.json(updated);
      } else {
        // Create new progress
        const [created] = await db
          .insert(labProgress)
          .values({
            userId,
            labId,
            isCompleted: true,
            xpEarned: lab.xpReward,
            updatedAt: new Date()
          })
          .returning();
        
        // Get current user first
        const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
        
        // Update user's total XP
        await db
          .update(users)
          .set({ 
            totalXp: (currentUser?.totalXp || 0) + lab.xpReward,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        res.json(created);
      }
    } catch (error) {
      console.error("Error completing lab:", error);
      res.status(500).json({ message: "Failed to complete lab" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.select().from(projects).orderBy(projects.id);
      if (allProjects.length === 0) {
        // Import mock data if needed
        const { MOCK_PROJECTS } = await import('./mock-data');
        return res.json(MOCK_PROJECTS);
      }
      res.json(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Return mock data on error
      const { MOCK_PROJECTS } = await import('./mock-data');
      return res.json(MOCK_PROJECTS);
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
      
      if (!project) {
        // Try to find in mock data
        const { MOCK_PROJECTS } = await import('./mock-data');
        const mockProject = MOCK_PROJECTS.find(p => p.id === projectId);
        if (mockProject) {
          return res.json(mockProject);
        }
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      
      // Try mock data on error
      try {
        const { MOCK_PROJECTS } = await import('./mock-data');
        const projectId = parseInt(req.params.id);
        const mockProject = MOCK_PROJECTS.find(p => p.id === projectId);
        if (mockProject) {
          return res.json(mockProject);
        }
      } catch (e) {
        console.error("Error loading mock data:", e);
      }
      
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if project exists
      const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Update or create project progress
      const [existingProgress] = await db.select().from(projectProgress)
        .where(and(
          eq(projectProgress.userId, userId),
          eq(projectProgress.projectId, projectId)
        ));
      
      if (existingProgress) {
        // Update existing progress
        const [updated] = await db
          .update(projectProgress)
          .set({ 
            isCompleted: true, 
            xpEarned: project.xpReward,
            updatedAt: new Date()
          })
          .where(and(
            eq(projectProgress.userId, userId),
            eq(projectProgress.projectId, projectId)
          ))
          .returning();
        
        // Update user's total XP if they haven't already earned XP for this project
        if (!existingProgress.isCompleted && existingProgress.xpEarned !== project.xpReward) {
          // Get current user first
          const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
          
          // Then update with calculated new total
          await db
            .update(users)
            .set({ 
              totalXp: (currentUser?.totalXp || 0) + project.xpReward,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));
        }
        
        res.json(updated);
      } else {
        // Create new progress
        const [created] = await db
          .insert(projectProgress)
          .values({
            userId,
            projectId,
            isCompleted: true,
            xpEarned: project.xpReward,
            updatedAt: new Date()
          })
          .returning();
        
        // Get current user first
        const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
        
        // Update user's total XP
        await db
          .update(users)
          .set({ 
            totalXp: (currentUser?.totalXp || 0) + project.xpReward,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        res.json(created);
      }
    } catch (error) {
      console.error("Error completing project:", error);
      res.status(500).json({ message: "Failed to complete project" });
    }
  });

  // Progress & Dashboard routes
  app.get("/api/dashboard", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get lab progress
      const userLabProgress = await db
        .select({
          progress: labProgress,
          lab: {
            id: labs.id,
            title: labs.title,
            description: labs.description,
            difficulty: labs.difficulty,
            xpReward: labs.xpReward
          }
        })
        .from(labProgress)
        .innerJoin(labs, eq(labProgress.labId, labs.id))
        .where(eq(labProgress.userId, userId));
      
      // Get project progress
      const userProjectProgress = await db
        .select({
          progress: projectProgress,
          project: {
            id: projects.id,
            title: projects.title,
            description: projects.description,
            repoUrl: projects.repoUrl,
            difficulty: projects.difficulty,
            xpReward: projects.xpReward
          }
        })
        .from(projectProgress)
        .innerJoin(projects, eq(projectProgress.projectId, projects.id))
        .where(eq(projectProgress.userId, userId));
      
      // Get user badges
      const userBadgesList = await db
        .select({
          userBadge: userBadges,
          badge: {
            id: badges.id,
            name: badges.name,
            description: badges.description,
            iconUrl: badges.iconUrl
          }
        })
        .from(userBadges)
        .innerJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(eq(userBadges.userId, userId));
      
      res.json({
        user,
        labProgress: userLabProgress,
        projectProgress: userProjectProgress,
        badges: userBadgesList.map(item => ({
          ...item.badge,
          earnedAt: item.userBadge.earnedAt
        }))
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Forum routes
  app.get("/api/forum-posts", async (req, res) => {
    try {
      const posts = await db
        .select({
          post: forumPosts,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            totalXp: users.totalXp
          }
        })
        .from(forumPosts)
        .innerJoin(users, eq(forumPosts.userId, users.id))
        .orderBy(desc(forumPosts.createdAt));
      
      // Check if we have any posts in the database
      if (posts.length === 0) {
        // Import mock data if no posts exist
        const { MOCK_FORUM_POSTS } = await import('./mock-data');
        return res.json(MOCK_FORUM_POSTS);
      }
      
      // Count comments for each post
      const postsWithCounts = await Promise.all(
        posts.map(async ({ post, user }) => {
          // Get the count of comments for this post
          const comments = await db
            .select()
            .from(forumComments)
            .where(eq(forumComments.postId, post.id));
          
          const commentsCount = { count: comments.length };
          
          return {
            ...post,
            user,
            commentsCount: Number(commentsCount.count) || 0
          };
        })
      );
      
      res.json(postsWithCounts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      // Return mock data on error
      const { MOCK_FORUM_POSTS } = await import('./mock-data');
      return res.json(MOCK_FORUM_POSTS);
    }
  });

  app.get("/api/forum-posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      // Get post with user info
      const [postWithUser] = await db
        .select({
          post: forumPosts,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            totalXp: users.totalXp
          }
        })
        .from(forumPosts)
        .innerJoin(users, eq(forumPosts.userId, users.id))
        .where(eq(forumPosts.id, postId));
      
      if (!postWithUser) {
        // Try to find in mock data
        const { MOCK_FORUM_POSTS } = await import('./mock-data');
        const mockPost = MOCK_FORUM_POSTS.find(p => p.id === postId);
        
        if (mockPost) {
          // Add empty comments array for mock posts
          return res.json({
            ...mockPost,
            comments: []
          });
        }
        
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Get comments with user info
      const comments = await db
        .select({
          comment: forumComments,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            totalXp: users.totalXp
          }
        })
        .from(forumComments)
        .innerJoin(users, eq(forumComments.userId, users.id))
        .where(eq(forumComments.postId, postId))
        .orderBy(forumComments.createdAt);
      
      res.json({
        ...postWithUser.post,
        user: postWithUser.user,
        comments: comments.map(c => ({
          ...c.comment,
          user: c.user
        }))
      });
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ message: "Failed to fetch forum post" });
    }
  });

  app.post("/api/forum-posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title, content, category } = req.body;
      
      if (!title || !content || !category) {
        return res.status(400).json({ message: "Title, content, and category are required" });
      }
      
      const [post] = await db
        .insert(forumPosts)
        .values({
          userId,
          title,
          content,
          category
        })
        .returning();
      
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  app.post("/api/forum-posts/:id/comments", isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Comment content is required" });
      }
      
      // Check if post exists
      const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const [comment] = await db
        .insert(forumComments)
        .values({
          postId,
          userId,
          content
        })
        .returning();
      
      // Get user info for the response
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          totalXp: users.totalXp
        })
        .from(users)
        .where(eq(users.id, userId));
      
      res.status(201).json({
        ...comment,
        user
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.post("/api/forum-posts/:id/save", isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if post exists
      const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user already saved the post
      const [existingSave] = await db
        .select()
        .from(userSavedPosts)
        .where(and(
          eq(userSavedPosts.userId, userId),
          eq(userSavedPosts.postId, postId)
        ));
      
      if (existingSave) {
        // Unsave: Remove the saved post
        await db
          .delete(userSavedPosts)
          .where(and(
            eq(userSavedPosts.userId, userId),
            eq(userSavedPosts.postId, postId)
          ));
        
        res.json({ postId, saved: false });
      } else {
        // Save: Add to saved posts
        await db
          .insert(userSavedPosts)
          .values({
            userId,
            postId
          });
        
        res.json({ postId, saved: true });
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      res.status(500).json({ message: "Failed to save/unsave post" });
    }
  });

app.get("/api/saved-posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get all saved posts for the user with post and author details
      const savedPosts = await db
        .select({
          post: forumPosts,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl
          },
          savedAt: userSavedPosts.createdAt
        })
        .from(userSavedPosts)
        .innerJoin(forumPosts, eq(userSavedPosts.postId, forumPosts.id))
        .innerJoin(users, eq(forumPosts.userId, users.id))
        .where(eq(userSavedPosts.userId, userId))
        .orderBy(desc(userSavedPosts.createdAt));
      
      // Map results to a more friendly format
      const formattedPosts = savedPosts.map(({ post, user, savedAt }) => ({
        ...post,
        user,
        savedAt
      }));
      
      res.json(formattedPosts);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Failed to fetch saved posts" });
    }
  });

app.post("/api/forum-posts/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if post exists
      const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user already liked the post
      const [existingLike] = await db
        .select()
        .from(userPostLikes)
        .where(and(
          eq(userPostLikes.userId, userId),
          eq(userPostLikes.postId, postId)
        ));
      
      if (existingLike) {
        // Unlike: Remove the like
        await db
          .delete(userPostLikes)
          .where(and(
            eq(userPostLikes.userId, userId),
            eq(userPostLikes.postId, postId)
          ));
        
        // Decrement post likes count
        const [updated] = await db
          .update(forumPosts)
          .set({ likes: existingLike ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) })
          .where(eq(forumPosts.id, postId))
          .returning();
        
        res.json({ ...updated, liked: false });
      } else {
        // Like: Add a new like
        await db
          .insert(userPostLikes)
          .values({
            userId,
            postId
          });
        
        // Increment post likes count
        const [updated] = await db
          .update(forumPosts)
          .set({ likes: (post.likes || 0) + 1 })
          .where(eq(forumPosts.id, postId))
          .returning();
        
        res.json({ ...updated, liked: true });
      }
    } catch (error) {
      console.error("Error toggling post like:", error);
      res.status(500).json({ message: "Failed to like/unlike post" });
    }
  });

  // Admin routes
  app.post("/api/admin/labs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user role
      const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId));
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }
      
      const { title, description, content, videoUrl, difficulty, xpReward, timestamps } = req.body;
      
      if (!title || !description || !content || !difficulty || !xpReward) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const [lab] = await db
        .insert(labs)
        .values({
          title,
          description,
          content,
          videoUrl,
          difficulty,
          xpReward,
          timestamps: timestamps || null
        })
        .returning();
      
      res.status(201).json(lab);
    } catch (error) {
      console.error("Error creating lab:", error);
      res.status(500).json({ message: "Failed to create lab" });
    }
  });

  app.post("/api/admin/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user role
      const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId));
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }
      
      const { title, description, content, repoUrl, videoUrl, difficulty, xpReward, timestamps } = req.body;
      
      if (!title || !description || !content || !repoUrl || !difficulty || !xpReward) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const [project] = await db
        .insert(projects)
        .values({
          title,
          description,
          content,
          repoUrl,
          videoUrl,
          difficulty,
          xpReward,
          timestamps: timestamps || null
        })
        .returning();
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.post("/api/admin/badges", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user role
      const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId));
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }
      
      const { name, description, iconUrl, unlockCriteria } = req.body;
      
      if (!name || !description || !iconUrl || !unlockCriteria) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const [badge] = await db
        .insert(badges)
        .values({
          name,
          description,
          iconUrl,
          unlockCriteria
        })
        .returning();
      
      res.status(201).json(badge);
    } catch (error) {
      console.error("Error creating badge:", error);
      res.status(500).json({ message: "Failed to create badge" });
    }
  });

  // Newsletter signup
  app.post("/api/newsletter/signup", async (req, res) => {
    try {
      const { email } = req.body;
      
      try {
        // Validate email
        const parsedData = insertNewsletterSubscriberSchema.parse({ email });
        
        // Check if already subscribed
        const [existing] = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, parsedData.email));
        
        if (existing) {
          return res.status(409).json({ message: "Email already subscribed" });
        }
        
        // Add to subscribers
        const [subscriber] = await db
          .insert(newsletterSubscribers)
          .values(parsedData)
          .returning();
        
        res.status(201).json({ message: "Successfully subscribed to newsletter" });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ message: "Invalid email address" });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
