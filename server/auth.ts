import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage';
import { User, users } from '@shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

// Create a hashed password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Compare password with hashed password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Configure passport to use local strategy
export function setupPassport() {
  // Serialize user to the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error(`User ${id} not found`));
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Local strategy for username/password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          // Find user by username
          const user = await storage.getUserByUsername(username);
          
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          
          // If user has no password (e.g. from OAuth), don't allow local login
          if (!user.password) {
            return done(null, false, { message: 'Invalid login method' });
          }
          
          // Check password
          const isMatch = await comparePassword(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

// Initialize the local users (admin and testuser with specified passwords)
export async function initializeTestUsers() {
  try {
    // First check if any users exist in the database
    const [anyUser] = await db.select().from(users).limit(1);
    
    if (anyUser) {
      console.log('Users already exist in database, skipping test user creation');
      
      // Update admin user password if needed for testing
      const adminUser = await storage.getUserByUsername('admin');
      if (adminUser && !adminUser.password) {
        const adminPassword = await hashPassword('admin1234!');
        await db.update(users)
          .set({ password: adminPassword })
          .where(eq(users.username, 'admin'));
        console.log('Admin user password updated');
      }
      
      // Update test user password if needed for testing
      const testUser = await storage.getUserByUsername('testuser');
      if (testUser && !testUser.password) {
        const testPassword = await hashPassword('testuser1234!');
        await db.update(users)
          .set({ password: testPassword })
          .where(eq(users.username, 'testuser'));
        console.log('Test user password updated');
      }
      
      return;
    }
    
    console.log('Creating test users...');
    
    // Create admin user with specified password
    const adminPassword = await hashPassword('admin1234!');
    await db.insert(users).values({
      id: 'admin-001',
      username: 'admin',
      email: 'admin@kodexzen.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=F44336&color=fff',
      totalXp: 9950,
      role: 'admin',
    });
    console.log('Admin user created');
    
    // Create test user with specified password
    const testPassword = await hashPassword('testuser1234!');
    await db.insert(users).values({
      id: 'test-001',
      username: 'testuser',
      email: 'test@kodexzen.com',
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      profileImageUrl: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',
      totalXp: 1250,
      role: 'user',
    });
    console.log('Test user created');
    
    // Create experienced user 
    const experiencedPassword = await hashPassword('advanced1234!');
    await db.insert(users).values({
      id: 'advanced-001',
      username: 'advanced',
      email: 'advanced@kodexzen.com',
      password: experiencedPassword,
      firstName: 'Advanced',
      lastName: 'User',
      profileImageUrl: 'https://ui-avatars.com/api/?name=Advanced+User&background=9C27B0&color=fff',
      totalXp: 5750,
      role: 'user',
    });
    console.log('Advanced user created');
    
  } catch (error) {
    // If the error is because users already exist, that's fine
    if (error.code === '23505') { // Postgres duplicate key error
      console.log('Some users already exist, continuing...');
    } else {
      console.error('Error initializing test users:', error);
      throw error;
    }
  }
}