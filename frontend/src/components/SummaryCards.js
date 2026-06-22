import React from 'react';
import { motion } from 'framer-motion';

const SummaryCards = ({ subscriptions, forecast }) => {
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'Expired').length;

  const totalMonthlySpending = subscriptions
    .filter(sub => sub.status === 'Active')
    .reduce((sum, sub) => {
      if (sub.renewalType === 'Monthly') {
        return sum + sub.amount;
      } else if (sub.renewalType === 'Yearly') {
        return sum + (sub.amount / 12);
      } else if (sub.renewalType === 'Weekly') {
        return sum + (sub.amount * 4.33);
      }
      return sum + sub.amount;
    }, 0);

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueSoonSubscriptions = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.nextRenewalDate);
    return renewalDate >= now && renewalDate <= nextWeek && sub.status === 'Active';
  }).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Subscriptions',
      value: totalSubscriptions,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      textColor: 'text-blue-600',
      darkText: 'dark:text-blue-400'
    },
    {
      title: 'Active',
      value: activeSubscriptions,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      darkBg: 'dark:bg-emerald-900/20',
      textColor: 'text-emerald-600',
      darkText: 'dark:text-emerald-400'
    },
    {
      title: 'Due Soon',
      value: dueSoonSubscriptions,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      darkBg: 'dark:bg-amber-900/20',
      textColor: 'text-amber-600',
      darkText: 'dark:text-amber-400'
    },
    {
      title: 'Monthly Spending',
      value: formatCurrency(totalMonthlySpending),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      gradient: 'from-violet-500 to-violet-600',
      lightBg: 'bg-violet-50',
      darkBg: 'dark:bg-violet-900/20',
      textColor: 'text-violet-600',
      darkText: 'dark:text-violet-400'
    },
    {
      title: 'Next Month (AI)',
      value: forecast ? formatCurrency(forecast.nextMonthForecast) : '—',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      trend: forecast?.trend,
      gradient: 'from-rose-500 to-rose-600',
      lightBg: 'bg-rose-50',
      darkBg: 'dark:bg-rose-900/20',
      textColor: 'text-rose-600',
      darkText: 'dark:text-rose-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative ${card.lightBg} ${card.darkBg} rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden group`}
        >
          {/* Background Decoration */}
          <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

          {/* Content */}
          <div className="relative flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">{card.title}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-xl sm:text-2xl font-bold ${card.textColor} ${card.darkText} truncate`}>
                  {card.value}
                </p>
                {card.trend && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${
                    card.trend === 'Increasing' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    card.trend === 'Decreasing' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {card.trend === 'Increasing' ? '↑' : card.trend === 'Decreasing' ? '↓' : '→'}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg flex-shrink-0`}>
              <div className="text-white">
                {card.icon}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;