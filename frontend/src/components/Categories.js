import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessCategories = async () => {
      try {
        const response = await api.get('/api/subscriptions');
        const subs = response.data;
        
        const catMap = {};
        
        subs.forEach(sub => {
          if (sub.status !== 'Active') return;
          
          const catName = sub.category || 'Other';
          if (!catMap[catName]) {
            catMap[catName] = { name: catName, count: 0, totalSpend: 0 };
          }
          
          catMap[catName].count += 1;
          
          let amount = sub.amount;
          if (sub.renewalType === 'Yearly') amount /= 12;
          if (sub.renewalType === 'Weekly') amount *= 4.33;
          
          catMap[catName].totalSpend += amount;
        });
        
        const sortedCategories = Object.values(catMap).sort((a, b) => b.totalSpend - a.totalSpend);
        setCategories(sortedCategories);

      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndProcessCategories();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Math.round(val));

  return (
    <Layout pageTitle="Categories">
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Categories</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your subscription categories</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No active categories</p>
              <p className="mt-1">Add some subscriptions to see categories.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Subscriptions</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Monthly Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {categories.map((cat, index) => (
                    <motion.tr 
                      key={cat.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`}>
                            {cat.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-white">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg">
                          {cat.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(cat.totalSpend)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </Layout>
  );
};

export default Categories;
