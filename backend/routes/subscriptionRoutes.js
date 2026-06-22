import express from "express";
import { 
  createSubscription, 
  getAllSubscriptions, 
  updateSubscription, 
  deleteSubscription,
  getSubscriptionStats,
  getSubscriptionById
} from "../controllers/subscriptionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", verifyToken, createSubscription);
router.get("/", verifyToken, getAllSubscriptions);
router.get("/stats", verifyToken, getSubscriptionStats);
router.get("/:id", verifyToken, getSubscriptionById);
router.put("/:id", verifyToken, updateSubscription);
router.delete("/:id", verifyToken, deleteSubscription);

export default router;
