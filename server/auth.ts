import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage';
import { User } from '@shared/schema';

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
  passport.serializeUser((user: User, done) => {
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
    // Check if the admin user exists
    const adminUser = await storage.getUserByUsername('admin');
    if (!adminUser) {
      // Create admin user with specified password
      const adminPassword = await hashPassword('admin1234!');
      await storage.upsertUser({
        id: 'admin-user-001',
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=F44336&color=fff',
        totalXp: 9950,
        role: 'admin',
      });
      console.log('Admin user created');
    }

    // Check if the test user exists
    const testUser = await storage.getUserByUsername('testuser');
    if (!testUser) {
      // Create test user with specified password
      const testPassword = await hashPassword('testuser1234!');
      await storage.upsertUser({
        id: 'test-user-001',
        username: 'testuser',
        email: 'test@example.com',
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        profileImageUrl: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',
        totalXp: 1250,
        role: 'user',
      });
      console.log('Test user created');
    }
  } catch (error) {
    console.error('Error initializing test users:', error);
  }
}