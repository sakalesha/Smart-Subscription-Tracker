// Utility functions for renewal countdown

export const getDaysUntilRenewal = (renewalDate) => {
  const today = new Date();
  const renewal = new Date(renewalDate);
  
  // Reset time to start of day for accurate day calculation
  today.setHours(0, 0, 0, 0);
  renewal.setHours(0, 0, 0, 0);
  
  const diffTime = renewal - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getCountdownBadge = (renewalDate, status) => {
  if (status !== 'Active') {
    return null;
  }

  const daysLeft = getDaysUntilRenewal(renewalDate);
  
  if (daysLeft < 0) {
    return {
      text: 'Overdue',
      color: 'bg-red-500',
      textColor: 'text-red-100'
    };
  } else if (daysLeft === 0) {
    return {
      text: 'Due Today',
      color: 'bg-red-500',
      textColor: 'text-red-100'
    };
  } else if (daysLeft === 1) {
    return {
      text: 'Due Tomorrow',
      color: 'bg-orange-500',
      textColor: 'text-orange-100'
    };
  } else if (daysLeft <= 3) {
    return {
      text: `${daysLeft} days left`,
      color: 'bg-orange-500',
      textColor: 'text-orange-100'
    };
  } else if (daysLeft <= 7) {
    return {
      text: `${daysLeft} days left`,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-100'
    };
  } else if (daysLeft <= 30) {
    return {
      text: `${daysLeft} days left`,
      color: 'bg-blue-500',
      textColor: 'text-blue-100'
    };
  } else {
    return {
      text: `${Math.floor(daysLeft / 30)} months left`,
      color: 'bg-green-500',
      textColor: 'text-green-100'
    };
  }
};

export const getUrgentRenewals = (subscriptions) => {
  return subscriptions.filter(sub => {
    if (sub.status !== 'Active') return false;
    const daysLeft = getDaysUntilRenewal(sub.nextRenewalDate);
    return daysLeft <= 7 && daysLeft >= 0;
  });
};
