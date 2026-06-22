import express from "express";
import { register, login, getSettings, updateSettings } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/settings", verifyToken, getSettings);
router.put("/settings", verifyToken, updateSettings);

export default router;
