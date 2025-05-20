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
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Setting to false for development
      maxAge: sessionTtl,
      sameSite: 'lax',
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
  
  // Test users for development
  const testUsers = {
    regular: {
      id: "test-user-123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImageUrl: "https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff",
      role: "user",
      totalXp: 1250,
      username: "testuser",
    },
    experienced: {
      id: "test-user-456",
      email: "advanced@example.com", 
      firstName: "Advanced",
      lastName: "User",
      profileImageUrl: "https://ui-avatars.com/api/?name=Advanced+User&background=9C27B0&color=fff",
      role: "user",
      totalXp: 5750,
      username: "advanceduser",
    },
    admin: {
      id: "admin-789",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: "https://ui-avatars.com/api/?name=Admin+User&background=F44336&color=fff",
      role: "admin",
      totalXp: 9950,
      username: "adminuser",
    }
  };
  
  // Development routes for authentication
  app.get("/api/login", (req, res) => {
    const userType = req.query.type || "regular";
    const userToLogin = testUsers[userType as keyof typeof testUsers] || testUsers.regular;
    
    console.log(`Logging in ${userToLogin.role} user:`, userToLogin);
    
    // Save this user in the database
    storage.upsertUser(userToLogin)
      .then((user) => {
        console.log("User saved in database:", user);
        req.login(userToLogin, (err) => {
          if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Login failed" });
          }
          console.log("User logged in successfully");
          const redirectUrl = typeof req.query.redirect === 'string' ? req.query.redirect : "/?loggedIn=true";
          return res.redirect(redirectUrl);
        });
      })
      .catch(err => {
        console.error("User creation error:", err);
        res.status(500).json({ message: "Failed to create test user" });
      });
  });
  
  app.get("/api/auth/admin", (req, res) => {
    const adminUser = testUsers.admin;
    
    storage.upsertUser(adminUser)
      .then((user) => {
        req.login(adminUser, (err) => {
          if (err) {
            console.error("Admin login error:", err);
            return res.status(500).json({ message: "Admin login failed" });
          }
          console.log("Admin logged in successfully");
          return res.redirect("/admin?adminLoggedIn=true");
        });
      })
      .catch(err => {
        console.error("Admin creation error:", err);
        res.status(500).json({ message: "Failed to create admin user" });
      });
  });
  
  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.redirect("/?loggedOut=true");
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
