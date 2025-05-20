import {
  users,
  type User,
  type UpsertUser,
  labs,
  projects,
  badges,
  userBadges,
  labProgress,
  projectProgress,
  forumPosts,
  forumComments,
  type Lab,
  type Project,
  type Badge,
  type LabProgress,
  type ProjectProgress,
  type ForumPost,
  type ForumComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Lab operations
  getLab(id: number): Promise<Lab | undefined>;
  getAllLabs(): Promise<Lab[]>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  
  // Progress operations
  getLabProgress(userId: string, labId: number): Promise<LabProgress | undefined>;
  createOrUpdateLabProgress(progress: Partial<LabProgress>): Promise<LabProgress>;
  getProjectProgress(userId: string, projectId: number): Promise<ProjectProgress | undefined>;
  createOrUpdateProjectProgress(progress: Partial<ProjectProgress>): Promise<ProjectProgress>;
  
  // Forum operations
  getForumPost(id: number): Promise<ForumPost | undefined>;
  getAllForumPosts(): Promise<ForumPost[]>;
  createForumPost(post: Partial<ForumPost>): Promise<ForumPost>;
  createForumComment(comment: Partial<ForumComment>): Promise<ForumComment>;
  
  // Badge operations
  awardBadge(userId: string, badgeId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Lab operations
  async getLab(id: number): Promise<Lab | undefined> {
    const [lab] = await db.select().from(labs).where(eq(labs.id, id));
    return lab;
  }
  
  async getAllLabs(): Promise<Lab[]> {
    return await db.select().from(labs);
  }
  
  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }
  
  // Progress operations
  async getLabProgress(userId: string, labId: number): Promise<LabProgress | undefined> {
    const [progress] = await db.select().from(labProgress).where(
      and(
        eq(labProgress.userId, userId),
        eq(labProgress.labId, labId)
      )
    );
    return progress;
  }
  
  async createOrUpdateLabProgress(progress: Partial<LabProgress>): Promise<LabProgress> {
    if (!progress.userId || !progress.labId) {
      throw new Error("userId and labId are required");
    }
    
    const [existing] = await db.select().from(labProgress).where(
      and(
        eq(labProgress.userId, progress.userId),
        eq(labProgress.labId, progress.labId)
      )
    );
    
    if (existing) {
      const [updated] = await db
        .update(labProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(eq(labProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(labProgress)
        .values(progress as any)
        .returning();
      return created;
    }
  }
  
  async getProjectProgress(userId: string, projectId: number): Promise<ProjectProgress | undefined> {
    const [progress] = await db.select().from(projectProgress).where(
      and(
        eq(projectProgress.userId, userId),
        eq(projectProgress.projectId, projectId)
      )
    );
    return progress;
  }
  
  async createOrUpdateProjectProgress(progress: Partial<ProjectProgress>): Promise<ProjectProgress> {
    if (!progress.userId || !progress.projectId) {
      throw new Error("userId and projectId are required");
    }
    
    const [existing] = await db.select().from(projectProgress).where(
      and(
        eq(projectProgress.userId, progress.userId),
        eq(projectProgress.projectId, progress.projectId)
      )
    );
    
    if (existing) {
      const [updated] = await db
        .update(projectProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(eq(projectProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(projectProgress)
        .values(progress as any)
        .returning();
      return created;
    }
  }
  
  // Forum operations
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post;
  }
  
  async getAllForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(forumPosts);
  }
  
  async createForumPost(post: Partial<ForumPost>): Promise<ForumPost> {
    const [created] = await db
      .insert(forumPosts)
      .values(post as any)
      .returning();
    return created;
  }
  
  async createForumComment(comment: Partial<ForumComment>): Promise<ForumComment> {
    const [created] = await db
      .insert(forumComments)
      .values(comment as any)
      .returning();
    return created;
  }
  
  // Badge operations
  async awardBadge(userId: string, badgeId: number): Promise<void> {
    // Check if user already has this badge
    const [existing] = await db.select().from(userBadges).where(
      and(
        eq(userBadges.userId, userId),
        eq(userBadges.badgeId, badgeId)
      )
    );
    
    if (!existing) {
      await db
        .insert(userBadges)
        .values({
          userId,
          badgeId,
          earnedAt: new Date()
        });
    }
  }
}

export const storage = new DatabaseStorage();
