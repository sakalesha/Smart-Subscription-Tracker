import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  userEmail: { 
    type: String, 
    required: true 
  },

  serviceName: { 
    type: String, 
    required: true,
    trim: true 
  },

  amount: { 
    type: Number, 
    required: true,
    min: 1 
  },

  category: { 
    type: String, 
    default: "Other" 
  },

  renewalType: { 
    type: String, 
    enum: ["Monthly", "Yearly", "Weekly", "One-time"],
    default: "Monthly"
  },

  nextRenewalDate: { 
    type: Date, 
    required: true 
  },

  status: { 
    type: String, 
    enum: ["Active", "Cancelled", "Expired"],
    default: "Active" 
  },

  // VERY IMPORTANT FOR REMINDER SYSTEM
  lastReminderDate: { 
    type: String, 
    default: null 
  },

  aiCategory: {
    type: String, 
    default: null 
  },

  // NEW FIELDS FOR V2 FRONTEND
  isTrial: {
    type: Boolean,
    default: false
  },

  trialEndDate: {
    type: Date,
    default: null
  },

  attachmentUrl: {
    type: String,
    default: null
  },

  cancellationUrl: {
    type: String,
    default: null
  }

}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
