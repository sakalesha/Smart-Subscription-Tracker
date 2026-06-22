import mongoose from "mongoose";

const spendHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  month: { 
    type: String, // "YYYY-MM"
    required: true,
  },

  totalSpend: { 
    type: Number, 
    required: true,
    min: 0
  },

  categoryBreakdown: { 
    type: Map,
    of: Number,
    default: {}
  }

}, { timestamps: true });

// Ensure unique snapshot per user/month
spendHistorySchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model("SpendHistory", spendHistorySchema);
