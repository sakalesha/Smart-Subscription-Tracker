import React from 'react';
import { motion } from 'framer-motion';

const SummaryCards = ({ subscriptions }) => {
  // Calculate summary statistics
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'Expired').length;
  
  // Calculate total monthly spending
  const totalMonthlySpending = subscriptions
    .filter(sub => sub.status === 'Active')
    .reduce((sum, sub) => {
      if (sub.renewalType === 'Monthly') {
        return sum + sub.amount;
      } else if (sub.renewalType === 'Yearly') {
        return sum + (sub.amount / 12);
      } else if (sub.renewalType === 'Weekly') {
        return sum + (sub.amount * 4.33); // Approximate weeks per month
      }
      return sum + sub.amount;
    }, 0);

  // Find subscriptions due soon (within next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueSoonSubscriptions = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.nextRenewalDate);
    return renewalDate >= now && renewalDate <= nextWeek && sub.status === 'Active';
  }).length;

  const cards = [
    {
      title: 'Total Subscriptions',
      value: totalSubscriptions,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Due Soon',
      value: dueSoonSubscriptions,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-700'
    },
    {
      title: 'Monthly Spending',
      value: `₹${totalMonthlySpending.toFixed(0)}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100',
      textColor: 'text-violet-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-br ${card.bgGradient} dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-lg p-6 border border-white/50 dark:border-slate-600/50 hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`bg-gradient-to-br ${card.gradient} rounded-xl p-3 text-white shadow-lg`}
            >
              {card.icon}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
