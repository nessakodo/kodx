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
    
    console.log("Database migrations completed successfully.");
  } catch (error) {
    console.error("Error during database migrations:", error);
    throw error;
  } finally {
    await pool.end();
  }
}