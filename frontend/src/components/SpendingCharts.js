import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const SpendingCharts = ({ subscriptions }) => {
  // Prepare data for monthly spending chart
  const monthlyData = [];
  const currentDate = new Date();
  
  // Generate last 6 months data
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

  // Prepare data for category breakdown
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

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-6"
      >
        Spending Analytics
      </motion.h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Spending Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Amount']}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="amount" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelStyle={{ color: '#1e293b' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300 text-slate-500">
              No data available for chart
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
          >
            <div className="text-2xl font-bold text-blue-700 mb-2">
              ₹{Math.round(subscriptions.filter(sub => sub.status === 'Active').reduce((sum, sub) => sum + sub.amount, 0))}
            </div>
            <div className="text-sm text-slate-600">Total Active Spending</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200"
          >
            <div className="text-2xl font-bold text-emerald-700 mb-2">
              {subscriptions.filter(sub => sub.status === 'Active').length}
            </div>
            <div className="text-sm text-slate-600">Active Subscriptions</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200"
          >
            <div className="text-2xl font-bold text-violet-700 mb-2">
              {categoryData.length}
            </div>
            <div className="text-sm text-slate-600">Categories</div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpendingCharts;
