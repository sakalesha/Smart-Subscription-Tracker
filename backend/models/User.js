import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  settings: {
    emailAlerts: { type: Boolean, default: true },
    dailySummary: { type: Boolean, default: false },
    upcomingRenewalsDays: { type: Number, default: 3 },
    forecastThresholdPercent: { type: Number, default: 20 },
    timezone: { type: String, default: 'UTC' }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
