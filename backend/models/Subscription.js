import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userEmail: { type: String, required: true },   // <-- ADDED (required for email reminders)
  
  serviceName: String,
  amount: Number,
  category: String,
  renewalType: String,
  nextRenewalDate: Date,

  status: { type: String, default: "Active" },
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
