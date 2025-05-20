import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { setupPassport, initializeTestUsers } from "./auth";
import { hashPassword } from "./auth";
import { User } from "@shared/schema";

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

  // Setup passport with local strategy
  setupPassport();
  
  // Initialize test users with proper credentials
  await initializeTestUsers();
  
  // Login route with username/password
  app.post("/api/login", (req, res, next) => {
    passport.authenticate('local', (err: Error | null, user: any, info: { message: string } | undefined) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "An error occurred during login" });
      }
      
      if (!user) {
        return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ success: false, message: "Failed to complete login" });
        }
        
        // Don't send password back to client
        const safeUser = { ...user, password: undefined };
        return res.json({ success: true, user: safeUser });
      });
    })(req, res, next);
  });
  
  // Register route for new users
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;
      
      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords don't match" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create new user
      const newUser = await storage.upsertUser({
        id: `user-${Date.now()}`,
        username,
        email,
        password: hashedPassword,
        firstName: "",
        lastName: "",
        profileImageUrl: `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`,
        totalXp: 0,
        role: "user",
      });
      
      // Log in the new user
      req.login(newUser, (err) => {
        if (err) {
          console.error("Auto-login error after registration:", err);
          return res.status(200).json({ 
            success: true, 
            message: "Registration successful. Please log in.",
            user: { ...newUser, password: undefined } 
          });
        }
        
        return res.status(201).json({ 
          success: true, 
          message: "Registration successful. You are now logged in.",
          user: { ...newUser, password: undefined }
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ success: false, message: "Failed to register" });
    }
  });
  
  // Legacy route for test users
  app.get("/api/login", (req, res) => {
    const userType = req.query.type || "regular";
    
    if (userType === "admin") {
      storage.getUserByUsername("admin")
        .then(user => {
          if (!user) {
            return res.status(404).json({ success: false, message: "Admin user not found" });
          }
          
          req.login(user, (err) => {
            if (err) {
              console.error("Admin login error:", err);
              return res.status(500).json({ success: false, message: "Admin login failed" });
            }
            
            return res.redirect("/admin?adminLoggedIn=true");
          });
        })
        .catch(err => {
          console.error("Admin fetch error:", err);
          res.status(500).json({ success: false, message: "Failed to fetch admin user" });
        });
    } else {
      storage.getUserByUsername("testuser")
        .then(user => {
          if (!user) {
            return res.status(404).json({ success: false, message: "Test user not found" });
          }
          
          req.login(user, (err) => {
            if (err) {
              console.error("Test user login error:", err);
              return res.status(500).json({ success: false, message: "Test user login failed" });
            }
            
            const redirectUrl = typeof req.query.redirect === 'string' ? req.query.redirect : "/?loggedIn=true";
            return res.redirect(redirectUrl);
          });
        })
        .catch(err => {
          console.error("Test user fetch error:", err);
          res.status(500).json({ success: false, message: "Failed to fetch test user" });
        });
    }
  });
  
  // Admin access route
  app.get("/api/auth/admin", async (req, res) => {
    try {
      const adminUser = await storage.getUserByUsername("admin");
      
      if (!adminUser) {
        return res.status(404).json({ success: false, message: "Admin user not found" });
      }
      
      req.login(adminUser, (err) => {
        if (err) {
          console.error("Admin login error:", err);
          return res.status(500).json({ success: false, message: "Admin login failed" });
        }
        
        return res.redirect("/admin?adminLoggedIn=true");
      });
    } catch (err) {
      console.error("Admin access error:", err);
      res.status(500).json({ success: false, message: "Failed to access admin" });
    }
  });
  
  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.redirect("/?loggedOut=true");
    });
  });

  // Get current authenticated user
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      // Don't send password back to client
      const user = req.user as any;
      const safeUser = { ...user, password: undefined };
      res.json(safeUser);
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

// Middleware to check if the user is an admin
export const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = req.user as any;
  if (user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  
  return next();
};
