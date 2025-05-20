import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// Function to run database migrations
export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("Starting database migrations...");
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  try {
    // First check if the users table has a password column
    const checkPasswordColumnResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'
    `);
    
    // If password column doesn't exist, add it
    if (checkPasswordColumnResult.rows.length === 0) {
      console.log("Adding password column to users table...");
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN password VARCHAR(255)
      `);
      console.log("Password column added successfully.");
    } else {
      console.log("Password column already exists.");
    }

    // Check if badges table has the category column (to detect new schema)
    const checkBadgeCategoryColumnResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'badges' AND column_name = 'category'
    `);

    // If badges table doesn't have category column, update the schema
    if (checkBadgeCategoryColumnResult.rows.length === 0) {
      console.log("Updating badges schema...");
      
      // If the badges table exists, modify it
      try {
        await pool.query(`
          ALTER TABLE badges
          ALTER COLUMN id TYPE VARCHAR(255),
          ADD COLUMN category VARCHAR(255) NOT NULL DEFAULT 'labs',
          ADD COLUMN rarity VARCHAR(255) NOT NULL DEFAULT 'common',
          ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()
        `);
        console.log("Badges schema updated successfully.");
      } catch (error) {
        // If the table doesn't exist, it will be created by Drizzle
        console.log("Badges table will be created with the new schema.");
      }
    }

    // Check if user_badges table has is_displayed column
    const checkBadgeDisplayColumnResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_badges' AND column_name = 'is_displayed'
    `);

    // If user_badges doesn't have is_displayed column, add it
    if (checkBadgeDisplayColumnResult.rows.length === 0) {
      console.log("Updating user_badges schema...");
      
      try {
        // First alter the badge_id to match the new data type
        await pool.query(`
          ALTER TABLE user_badges
          ALTER COLUMN badge_id TYPE VARCHAR(255),
          ADD COLUMN is_displayed BOOLEAN DEFAULT TRUE
        `);
        console.log("User badges schema updated successfully.");
      } catch (error) {
        // If the table doesn't exist, it will be created by Drizzle
        console.log("User badges table will be created with the new schema.");
      }
    }

    // Create user_saved_posts table if it doesn't exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_saved_posts (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("User saved posts table created or verified.");
    } catch (error) {
      console.log("Error with user_saved_posts table:", error.message);
    }
    
    console.log("Database migrations completed successfully.");
  } catch (error) {
    console.error("Error during database migrations:", error);
    throw error;
  } finally {
    await pool.end();
  }
}