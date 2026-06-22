import Subscription from "../backend/models/Subscription.js";
import SpendHistory from "../backend/models/SpendHistory.js";

/**
 * Calculates the predicted spend for the next month based on active subscriptions
 * @param {string} userId - The unique ID of the user
 * @returns {object} { todayTotal, nextMonthForecast, trend, breakdown }
 */
export const generateForecast = async (userId) => {
  try {
    // 1. Fetch active subscriptions for the user
    const activeSubs = await Subscription.find({ 
      userId, 
      status: "Active" 
    });

    let currentMonthTotal = 0;
    let nextMonthForecast = 0;
    const breakdown = {};

    // 2. Compute the forecast
    activeSubs.forEach(sub => {
      let monthlyContribution = 0;

      switch (sub.renewalType) {
        case "Monthly":
          monthlyContribution = sub.amount;
          break;
        case "Yearly":
          monthlyContribution = sub.amount / 12;
          break;
        case "Weekly":
          monthlyContribution = sub.amount * 4.33; // Average weeks per month
          break;
        case "One-time":
          // Only count if it hasn't happened yet and is in the target window? 
          // For now, assume one-time doesn't repeat for forecasting.
          monthlyContribution = 0;
          break;
        default:
          monthlyContribution = sub.amount;
      }

      nextMonthForecast += monthlyContribution;
      
      // Category Breakdown for the forecast
      const cat = sub.category || "Other";
      breakdown[cat] = (breakdown[cat] || 0) + monthlyContribution;
    });

    // 3. Fetch historical trend (Last 3 months)
    const history = await SpendHistory.find({ userId })
      .sort({ month: -1 })
      .limit(3)
      .lean();

    let trend = "Stable";
    if (history.length >= 2) {
      const lastMonth = history[0].totalSpend;
      const prevMonth = history[1].totalSpend;
      
      if (nextMonthForecast > lastMonth * 1.05) {
        trend = "Increasing";
      } else if (nextMonthForecast < lastMonth * 0.95) {
        trend = "Decreasing";
      }
    }

    return {
      todayTotal: parseFloat(nextMonthForecast.toFixed(2)), // For now, use the current active total
      nextMonthForecast: parseFloat(nextMonthForecast.toFixed(2)),
      trend,
      breakdown: Object.fromEntries(
        Object.entries(breakdown).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
      ),
      activeCount: activeSubs.length
    };

  } catch (error) {
    console.error("Forecast generation error:", error);
    throw error;
  }
};

/**
 * Updates the monthly spend snapshot for a user
 * @param {string} userId - The unique ID of the user
 * @param {string} monthYM - The month in "YYYY-MM" format
 */
export const updateMonthlySnapshot = async (userId, monthYM) => {
  try {
    const activeSubs = await Subscription.find({ 
      userId, 
      status: "Active" 
    });

    let totalSpend = 0;
    const categoryBreakdown = new Map();

    activeSubs.forEach(sub => {
      // For a snapshot of "actual" monthly billing obligation:
      let amount = sub.amount;
      if (sub.renewalType === "Yearly") amount = sub.amount / 12;
      if (sub.renewalType === "Weekly") amount = sub.amount * 4.33;

      totalSpend += amount;
      const cat = sub.category || "Other";
      categoryBreakdown.set(cat, (categoryBreakdown.get(cat) || 0) + amount);
    });

    await SpendHistory.findOneAndUpdate(
      { userId, month: monthYM },
      { totalSpend, categoryBreakdown: Object.fromEntries(categoryBreakdown) },
      { upsert: true, new: true }
    );

  } catch (error) {
    console.error(`Snapshot update failed for user ${userId}:`, error);
  }
};
