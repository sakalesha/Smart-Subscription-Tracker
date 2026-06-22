import Subscription from "../models/Subscription.js";

// Get user alerts
export const getAlerts = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });
    
    const alerts = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Calculate upcoming renewals (e.g. next 7 days)
    subscriptions.forEach(sub => {
      if (sub.status !== 'Active') return;
      
      const renewalDate = new Date(sub.nextRenewalDate);
      renewalDate.setHours(0, 0, 0, 0);
      
      const diffTime = renewalDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 7) {
        alerts.push({
          id: `renewal-${sub._id}`,
          type: diffDays === 0 ? 'Critical' : 'Warning',
          title: `${sub.serviceName} is renewing ${diffDays === 0 ? 'today' : `in ${diffDays} days`}`,
          message: `Your subscription to ${sub.serviceName} will renew on ${renewalDate.toLocaleDateString()} for ₹${sub.amount}.`,
          date: new Date().toISOString(),
          read: false
        });
      }
    });

    // We can add other heuristics here like "price increased" if we tracked price history
    
    // Sort alerts by criticality and date
    alerts.sort((a, b) => {
      if (a.type === 'Critical' && b.type !== 'Critical') return -1;
      if (b.type === 'Critical' && a.type !== 'Critical') return 1;
      return 0;
    });

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};
