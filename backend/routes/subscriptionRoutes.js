import express from "express";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";     // <-- Needed for email fallback
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.userId = decoded.id;
    req.userEmail = decoded.email;

    // SAFETY: If token didn’t include email, fetch from DB
    if (!req.userEmail) {
      const user = await User.findById(req.userId).lean();
      req.userEmail = user?.email;
    }

    if (!req.userEmail) {
      return res.status(500).json({ message: "User email missing, cannot continue" });
    }

    next();
  });
}

// Add Subscription
router.post("/", verifyToken, async (req, res) => {
  try {
    const sub = await Subscription.create({
      ...req.body,
      userId: req.userId,
      userEmail: req.userEmail,
      lastReminderDate: null      // ensure this always exists
    });

    res.status(201).json(sub);
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({ message: "Failed to create subscription", error });
  }
});

// Get All Subscriptions for User
router.get("/", verifyToken, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

// Update Subscription
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(sub);
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});

// Delete Subscription
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid subscription ID format" });
    }

    const sub = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found or unauthorized" });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Delete subscription error:", error);
    res.status(500).json({ message: "Failed to delete subscription" });
  }
});

export default router;
