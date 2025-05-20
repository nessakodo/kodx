import { Router } from "express";
import { isAdmin, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { db } from "./db";
import { 
  users, labs, projects, badges, userBadges, 
  labProgress, projectProgress, forumPosts, 
  forumComments, userPostLikes, userCommentLikes
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const adminRouter = Router();

// User Management routes
adminRouter.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    
    // Don't send passwords
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    
    res.json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

adminRouter.post("/users/update-role", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Validate input
    if (!userId || !role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid input" });
    }
    
    // Update user role
    const [updated] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...safeUser } = updated;
    
    res.json(safeUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

adminRouter.delete("/users/delete", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't allow deleting the current user
    if (userId === (req as any).user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    // Delete the user
    await db.delete(users).where(eq(users.id, userId));
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Lab Management routes
adminRouter.get("/labs", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const allLabs = await db.select().from(labs);
    res.json(allLabs);
  } catch (error) {
    console.error("Error fetching labs:", error);
    res.status(500).json({ message: "Failed to fetch labs" });
  }
});

adminRouter.post("/labs/create", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, content, difficulty, xpReward, videoUrl } = req.body;
    
    // Validate input
    if (!title || !description || !content || !difficulty || !xpReward) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Create new lab
    const [created] = await db
      .insert(labs)
      .values({
        title,
        description,
        content,
        difficulty,
        xpReward,
        videoUrl: videoUrl || null,
      })
      .returning();
    
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating lab:", error);
    res.status(500).json({ message: "Failed to create lab" });
  }
});

adminRouter.put("/labs/:id/update", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const labId = parseInt(req.params.id);
    const { title, description, content, difficulty, xpReward, videoUrl } = req.body;
    
    // Validate input
    if (!title || !description || !content || !difficulty || !xpReward) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Update lab
    const [updated] = await db
      .update(labs)
      .set({
        title,
        description,
        content,
        difficulty,
        xpReward,
        videoUrl: videoUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(labs.id, labId))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ message: "Lab not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating lab:", error);
    res.status(500).json({ message: "Failed to update lab" });
  }
});

adminRouter.delete("/labs/:id/delete", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const labId = parseInt(req.params.id);
    
    // Check if lab exists
    const lab = await storage.getLab(labId);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    
    // Delete the lab
    await db.delete(labs).where(eq(labs.id, labId));
    
    res.json({ message: "Lab deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab:", error);
    res.status(500).json({ message: "Failed to delete lab" });
  }
});

// Project Management routes
adminRouter.get("/projects", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const allProjects = await db.select().from(projects);
    res.json(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

adminRouter.post("/projects/create", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, content, repoUrl, difficulty, xpReward, videoUrl } = req.body;
    
    // Validate input
    if (!title || !description || !content || !repoUrl || !difficulty || !xpReward) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Create new project
    const [created] = await db
      .insert(projects)
      .values({
        title,
        description,
        content,
        repoUrl,
        difficulty,
        xpReward,
        videoUrl: videoUrl || null,
      })
      .returning();
    
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Badge Management routes
adminRouter.get("/badges", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const allBadges = await db.select().from(badges);
    res.json(allBadges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Failed to fetch badges" });
  }
});

adminRouter.post("/badges/create", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id, name, description, category, rarity, iconUrl } = req.body;
    
    // Validate input
    if (!id || !name || !description || !category || !rarity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Create new badge
    const [created] = await db
      .insert(badges)
      .values({
        id,
        name,
        description,
        category,
        rarity,
        iconUrl: iconUrl || null,
      })
      .returning();
    
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating badge:", error);
    res.status(500).json({ message: "Failed to create badge" });
  }
});

// Forum Management routes
adminRouter.get("/forum/posts", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const posts = await db.select().from(forumPosts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ message: "Failed to fetch forum posts" });
  }
});

adminRouter.post("/forum/posts/:id/feature", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    // Check if post exists
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Toggle featured status
    const [updated] = await db
      .update(forumPosts)
      .set({ isPinned: !post.isPinned, updatedAt: new Date() })
      .where(eq(forumPosts.id, postId))
      .returning();
    
    res.json(updated);
  } catch (error) {
    console.error("Error featuring forum post:", error);
    res.status(500).json({ message: "Failed to feature forum post" });
  }
});

adminRouter.delete("/forum/posts/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    // Check if post exists
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Delete the post
    await db.delete(forumPosts).where(eq(forumPosts.id, postId));
    
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting forum post:", error);
    res.status(500).json({ message: "Failed to delete forum post" });
  }
});

adminRouter.delete("/forum/comments/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    
    // Check if comment exists
    const [comment] = await db.select().from(forumComments).where(eq(forumComments.id, commentId));
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Delete the comment
    await db.delete(forumComments).where(eq(forumComments.id, commentId));
    
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting forum comment:", error);
    res.status(500).json({ message: "Failed to delete forum comment" });
  }
});

export default adminRouter;