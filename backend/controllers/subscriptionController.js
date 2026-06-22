import Subscription from "../models/Subscription.js";
import { checkDuplicates } from "../../ml/duplicateService.js";
import { categorizeService } from "../../ml/categorizationService.js";

// Add Subscription
export const createSubscription = async (req, res) => {
  try {
    // Auto-categorize if no category is provided
    let { category, serviceName } = req.body;
    if (!category || category === "Other") {
      const { category: detectedCategory } = categorizeService(serviceName);
      category = detectedCategory;
    }

    const sub = await Subscription.create({
      ...req.body,
      category,
      userId: req.userId,
      userEmail: req.userEmail,
      lastReminderDate: null
    });

    // Check for duplicates
    const otherSubs = await Subscription.find({ 
      userId: req.userId, 
      _id: { $ne: sub._id } 
    }).lean();
    const warnings = checkDuplicates(sub, otherSubs);

    res.status(201).json({
      subscription: sub,
      warnings
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({ message: "Failed to create subscription", error });
  }
};

// Get All Subscriptions for User
export const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

// Get Single Subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid subscription ID format" });
    }

    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.userId });
    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    res.json(sub);
  } catch (error) {
    console.error("Fetch single subscription error:", error);
    res.status(500).json({ message: "Failed to fetch subscription details" });
  }
};

// Update Subscription
export const updateSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Check for duplicates on update
    const otherSubs = await Subscription.find({ 
      userId: req.userId, 
      _id: { $ne: sub._id } 
    }).lean();
    const warnings = checkDuplicates(sub, otherSubs);

    res.json({
      subscription: sub,
      warnings
    });
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
};

// Delete Subscription
export const deleteSubscription = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid subscription ID format" });
    }

    const sub = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found or unauthorized" });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Delete subscription error:", error);
    res.status(500).json({ message: "Failed to delete subscription" });
  }
};

// Get Subscription Statistics
export const getSubscriptionStats = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId });
    
    let totalMonthlySpend = 0;
    const categoryBreakdown = {};
    let activeCount = 0;
    let cancelledCount = 0;

    subs.forEach(sub => {
      if (sub.status === "Active") {
        activeCount++;
        
        let amount = sub.amount;
        if (sub.renewalType === "Yearly") amount /= 12;
        if (sub.renewalType === "Weekly") amount *= 4.33;
        
        totalMonthlySpend += amount;
        
        const cat = sub.category || "Other";
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + amount;
      } else {
        cancelledCount++;
      }
    });

    res.json({
      totalMonthlySpend: parseFloat(totalMonthlySpend.toFixed(2)),
      activeCount,
      cancelledCount,
      categoryBreakdown: Object.fromEntries(
        Object.entries(categoryBreakdown).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
      )
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};
