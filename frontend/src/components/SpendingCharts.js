import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';

const SpendingCharts = ({ subscriptions }) => {
  const monthlyData = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-IN', { month: 'short' });

    const monthlySpending = subscriptions
      .filter(sub => {
        const renewalDate = new Date(sub.nextRenewalDate);
        return renewalDate.getMonth() === date.getMonth() &&
               renewalDate.getFullYear() === date.getFullYear() &&
               sub.status === 'Active';
      })
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

    monthlyData.push({
      month: monthName,
      amount: Math.round(monthlySpending)
    });
  }

  const categoryData = subscriptions
    .filter(sub => sub.status === 'Active')
    .reduce((acc, sub) => {
      const existingCategory = acc.find(item => item.name === sub.category);
      if (existingCategory) {
        existingCategory.value += sub.amount;
      } else {
        acc.push({
          name: sub.category,
          value: sub.amount
        });
      }
      return acc;
    }, []);

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">{label}</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderMonthlyChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#64748B', fontSize: 12 }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `Rs.${value}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
        <Bar dataKey="amount" fill="url(#colorBarGradient)" radius={[6, 6, 0, 0]} maxBarSize={50} />
        <defs>
          <linearGradient id="colorBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderCategoryChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatCurrency(value), 'Amount']}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Spending Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your subscription spending patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6"
        >
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Monthly Trend</h3>
          <div className="h-64 sm:h-72">
            {renderMonthlyChart()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6"
        >
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">By Category</h3>
          {categoryData.length > 0 ? (
            <div className="h-64 sm:h-72">
              {renderCategoryChart()}
            </div>
          ) : (
            <div className="h-64 sm:h-72 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">No data available</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6"
      >
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-100 dark:border-blue-800/30">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(subscriptions.filter(sub => sub.status === 'Active').reduce((sum, sub) => sum + sub.amount, 0))}
            </p>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">Total Active Spending</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-100 dark:border-emerald-800/30">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {subscriptions.filter(sub => sub.status === 'Active').length}
            </p>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-1">Active Subscriptions</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10 border border-violet-100 dark:border-violet-800/30">
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{categoryData.length}</p>
            <p className="text-sm text-violet-600/70 dark:text-violet-400/70 mt-1">Categories in Use</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpendingCharts;