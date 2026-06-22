import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import api from '../utils/api';

const Forecast = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/api/subscriptions');
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // Calculate Forecast Data (Next 6 Months)
  const generateForecastData = () => {
    const data = [];
    let totalForecasted = 0;
    const categoryTotals = {};

    const now = new Date();
    
    // We'll generate data for the next 6 months
    for (let i = 0; i < 6; i++) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthLabel = targetMonth.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      
      let monthlySpend = 0;
      
      subscriptions.forEach(sub => {
        if (sub.status !== 'Active') return;
        
        let amount = sub.amount;
        // Normalize to monthly
        if (sub.renewalType === 'Yearly') amount /= 12;
        if (sub.renewalType === 'Weekly') amount *= 4.33;

        monthlySpend += amount;
        
        // Add to category totals
        const cat = sub.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      });

      data.push({
        name: monthLabel,
        forecast: Math.round(monthlySpend),
        actual: i === 0 ? Math.round(monthlySpend) : null // Just to show a point
      });

      totalForecasted += monthlySpend;
    }

    // Prepare Category Data
    const categoryData = Object.keys(categoryTotals).map(key => ({
      name: key,
      value: Math.round(categoryTotals[key] / 6) // Average monthly per category
    })).sort((a, b) => b.value - a.value);

    return { 
      chartData: data, 
      totalForecasted: Math.round(totalForecasted),
      avgMonthly: Math.round(totalForecasted / 6),
      categoryData
    };
  };

  const { chartData, totalForecasted, avgMonthly, categoryData } = generateForecastData();

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(val);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <Layout pageTitle="Forecast & Analytics">
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Forecast</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Predicted spending based on active subscriptions</p>
          </div>
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Time Range</label>
              <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option>Next 6 Months</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Group By</label>
              <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none">
                <option>Month</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Forecasted Spend</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{formatCurrency(totalForecasted)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Monthly Spend</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(avgMonthly)}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-6">Forecast Overview</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                      <RechartsTooltip 
                        formatter={(value) => [formatCurrency(value), 'Forecast']}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="forecast" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" strokeDasharray="5 5" />
                      <Area type="monotone" dataKey="actual" stroke="#1D4ED8" strokeWidth={3} fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar Stats Area */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-full">
                <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-6">Category Breakdown (Forecast)</h3>
                
                <div className="space-y-5">
                  {categoryData.map((item, index) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(item.value)}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((item.value / avgMonthly) * 100, 100)}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

export default Forecast;
