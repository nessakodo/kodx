import {
  pgTable,
  text,
  serial,
  integer,
  varchar,
  timestamp,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  email: varchar("email").unique(),
  password: varchar("password"), // Added password field for local authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  totalXp: integer("total_xp").default(0),
  completedOnboarding: boolean("completed_onboarding").default(false),
  interests: text("interests").array(), // Array of interest categories
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  role: varchar("role").default("user"),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Labs table
export const labs = pgTable("labs", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  content: text("content_path").notNull(), // Path to markdown file
  videoUrl: varchar("video_url"),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  xpReward: integer("xp_reward").notNull(),
  timestamps: jsonb("timestamps"), // JSON array of video timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Lab = typeof labs.$inferSelect;
export type InsertLab = typeof labs.$inferInsert;

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  content: text("content_path").notNull(), // Path to markdown file
  repoUrl: varchar("repo_url").notNull(),
  videoUrl: varchar("video_url"),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  xpReward: integer("xp_reward").notNull(),
  timestamps: jsonb("timestamps"), // JSON array of video timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Badges table
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().notNull(), // Using string ID for badge code (e.g., "lab_starter")
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // labs, community, meta, leveling, etc.
  rarity: varchar("rarity").notNull(), // common, uncommon, rare, epic, legendary
  iconUrl: varchar("icon_url"),
  unlockCriteria: jsonb("unlock_criteria"), // JSON with criteria
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

// User badges (many-to-many)
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: varchar("badge_id").notNull().references(() => badges.id, { onDelete: 'cascade' }),
  earnedAt: timestamp("earned_at").defaultNow(),
  isDisplayed: boolean("is_displayed").default(true), // For users to choose which badges to display on profile
});

// Lab progress
export const labProgress = pgTable("lab_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  labId: integer("lab_id").notNull().references(() => labs.id, { onDelete: 'cascade' }),
  isCompleted: boolean("is_completed").default(false),
  currentStep: integer("current_step").default(0),
  notes: text("notes"),
  quizResults: jsonb("quiz_results"), // JSON with quiz answers and scores
  completedTasks: jsonb("completed_tasks"), // JSON array of completed task IDs
  xpEarned: integer("xp_earned").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type LabProgress = typeof labProgress.$inferSelect;
export type InsertLabProgress = typeof labProgress.$inferInsert;

// Project progress
export const projectProgress = pgTable("project_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  isCompleted: boolean("is_completed").default(false),
  notes: text("notes"),
  completedTasks: jsonb("completed_tasks"), // JSON array of completed task IDs
  xpEarned: integer("xp_earned").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ProjectProgress = typeof projectProgress.$inferSelect;
export type InsertProjectProgress = typeof projectProgress.$inferInsert;

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(), // question, announcement, devlog, etc.
  isPinned: boolean("is_pinned").default(false),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;

// Forum comments
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = typeof forumComments.$inferInsert;

// User likes for posts (many-to-many)
export const userPostLikes = pgTable("user_post_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer("post_id").notNull().references(() => forumPosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User likes for comments (many-to-many)
export const userCommentLikes = pgTable("user_comment_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  commentId: integer("comment_id").notNull().references(() => forumComments.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User saved posts (many-to-many)
export const userSavedPosts = pgTable("user_saved_posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer("post_id").notNull().references(() => forumPosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);
