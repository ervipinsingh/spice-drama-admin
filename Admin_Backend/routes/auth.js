import express from "express";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { isAuthenticated, hasRole } from "../middleware/auth.js";

const router = express.Router();

/* -------------------- Rate Limiter -------------------- */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts",
});

/* -------------------- Login -------------------- */
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- Logout -------------------- */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

/* -------------------- Current User -------------------- */
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- Create User (Admin only) -------------------- */
router.post("/users", isAuthenticated, hasRole("admin"), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || "viewer",
      createdBy: req.session.userId,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- Get All Users (Admin only) -------------------- */
router.get("/users", isAuthenticated, hasRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- Delete User (Admin only) -------------------- */
router.delete(
  "/users/:id",
  isAuthenticated,
  hasRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Admin cannot delete self
      if (user._id.toString() === req.session.userId) {
        return res
          .status(400)
          .json({ error: "Cannot delete your own account" });
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

/* -------------------- Update User Status (Admin only) -------------------- */
router.patch(
  "/users/:id/status",
  isAuthenticated,
  hasRole("admin"),
  async (req, res) => {
    try {
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true },
      ).select("-password");

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
