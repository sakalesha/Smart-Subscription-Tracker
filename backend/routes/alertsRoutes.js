import express from "express";
import { getAlerts } from "../controllers/alertsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAlerts);

export default router;
