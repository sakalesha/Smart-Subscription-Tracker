/**
 * Recommendation Service
 * 
 * Provides logic to score subscriptions and suggest cancellations 
 * to help users save money.
 */

const CATEGORY_SCORES = {
  "Software": 80,
  "Cloud": 90,
  "Education": 85,
  "Finance": 95,
  "Health": 75,
  "News": 60,
  "Entertainment": 40,
  "Music": 45,
  "Gaming": 35,
  "Other": 50
};

/**
 * Generates cancellation recommendations for a user
 * @param {Array} subscriptions - List of active subscriptions
 * @returns {Object} { recommendations, potentialMonthlySavings }
 */
export const generateRecommendations = (subscriptions) => {
  if (!subscriptions || subscriptions.length === 0) {
    return { recommendations: [], potentialMonthlySavings: 0 };
  }

  const recommendations = subscriptions
    .filter(sub => sub.status === "Active")
    .map(sub => {
      let keepScore = 50; // Base score

      // 1. Category Essentiality (Weight: 30)
      const catScore = CATEGORY_SCORES[sub.category] || CATEGORY_SCORES["Other"];
      keepScore += (catScore / 100) * 30;

      // 2. Cost Penalty (Weight: 30)
      // Expensive subs (> 1000) get penalized
      const monthlyAmount = sub.renewalType === "Yearly" ? sub.amount / 12 : sub.amount;
      if (monthlyAmount > 2000) keepScore -= 25;
      else if (monthlyAmount > 1000) keepScore -= 15;
      else if (monthlyAmount < 200) keepScore += 10;

      // 3. Trial Status (Weight: 20)
      // Trials are prime candidates for cancellation if not used
      if (sub.isTrial) {
        keepScore -= 20;
      }

      // 4. Frequency Bonus (Weight: 10)
      if (sub.renewalType === "Yearly") keepScore += 10; // Commitment bonus

      // Normalize score to 0-100
      keepScore = Math.max(0, Math.min(100, keepScore));

      let action = "KEEP";
      let reason = "This subscription seems well-balanced.";

      if (keepScore < 40) {
        action = "CANCEL";
        reason = `High cost in ${sub.category} category. You could save ₹${monthlyAmount.toFixed(0)}/mo.`;
      } else if (keepScore < 60) {
        action = "CONSIDER";
        reason = "Monitor your usage; this might be a candidate for downgrading.";
      } else if (sub.isTrial) {
        action = "MONITOR";
        reason = "Trial period active. Ensure you derive value before it ends!";
      }

      return {
        subscriptionId: sub._id,
        serviceName: sub.serviceName,
        amount: sub.amount,
        monthlyAmount: parseFloat(monthlyAmount.toFixed(2)),
        category: sub.category,
        keepScore: Math.round(keepScore),
        reason,
        action
      };
    })
    .sort((a, b) => a.keepScore - b.keepScore); // Worst scores first

  const potentialMonthlySavings = recommendations
    .filter(r => r.action === "CANCEL")
    .reduce((sum, r) => sum + r.monthlyAmount, 0);

  return {
    recommendations,
    potentialMonthlySavings: parseFloat(potentialMonthlySavings.toFixed(2))
  };
};
