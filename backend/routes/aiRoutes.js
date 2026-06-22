import express from "express";
import { categorize, getForecast, getRecommendations } from "../controllers/aiController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/categorize", categorize);
router.get("/forecast", verifyToken, getForecast);
router.get("/recommendations", verifyToken, getRecommendations);

export default router;
