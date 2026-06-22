import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify JWT token and attach user info to request
 */
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

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

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal server error during authentication" });
  }
};
