import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import subRoutes from "./routes/subscriptionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import alertsRoutes from "./routes/alertsRoutes.js";

// ⭐ important: Cron job import
import "./utils/reminderCron.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port 5000");
});
