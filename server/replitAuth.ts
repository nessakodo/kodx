import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Simple mock authentication for development purposes
// This will be replaced with proper Replit Auth integration in production
if (!process.env.SESSION_SECRET) {
  throw new Error("Environment variable SESSION_SECRET not provided");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // For development purposes, we'll use a simplified authentication system
  // Later we can implement the full Replit Auth when OpenID Connect setup is properly configured
  
  // Passport session setup
  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });
  
  // Development routes for authentication
  app.get("/api/login", (req, res) => {
    // For development, automatically create and log in a test user
    const testUser = {
      id: "test-user-123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImageUrl: "https://ui-avatars.com/api/?name=Test+User",
      role: "user",
      totalXp: 1250, // Adding XP for user profile display
      username: "testuser", // Add username for display
    };
    
    console.log("Logging in test user:", testUser);
    
    // Save this user in the database
    storage.upsertUser(testUser)
      .then((user) => {
        console.log("User saved in database:", user);
        req.login(testUser, (err) => {
          if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          console.log("User logged in successfully");
          // Send success response instead of redirect for debugging
          return res.redirect("/?loggedIn=true");
        });
      })
      .catch(err => {
        console.error("User creation error:", err);
        res.status(500).json({ message: "Failed to create test user" });
      });
  });
  
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // Add auth endpoint for checking authenticated user
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  return next();
};
