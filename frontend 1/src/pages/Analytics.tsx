import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';
import api from '../services/api';
import { Subscription } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const Analytics: React.FC = () => {
  const { currency } = useSettings();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'Monthly' | 'Yearly'>('Monthly');

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await api.get('/subscriptions');
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch subscriptions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubs();
  }, []);

  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  
  const monthlySpend = activeSubs.reduce((acc, sub) => {
    if (sub.renewalType === 'Monthly') return acc + sub.amount;
    if (sub.renewalType === 'Yearly') return acc + (sub.amount / 12);
    if (sub.renewalType === 'Weekly') return acc + (sub.amount * 4.33);
    return acc;
  }, 0);

  const displaySpend = viewMode === 'Monthly' ? monthlySpend : monthlySpend * 12;

  const categoryData = activeSubs.reduce((acc: any[], sub) => {
    const amount = sub.renewalType === 'Monthly' ? sub.amount : 
                   sub.renewalType === 'Yearly' ? sub.amount / 12 : 
                   sub.renewalType === 'Weekly' ? sub.amount * 4.33 : sub.amount;
    const value = viewMode === 'Monthly' ? amount : amount * 12;
    
    const existing = acc.find(item => item.name === sub.category);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: sub.category, value });
    }
    return acc;
  }, []);

  const savingsPotential = activeSubs
    .filter(s => s.isTrial || s.amount > 1000) // Simulated logic for savings
    .reduce((acc, sub) => {
      const amount = sub.renewalType === 'Monthly' ? sub.amount : 
                     sub.renewalType === 'Yearly' ? sub.amount / 12 : 
                     sub.renewalType === 'Weekly' ? sub.amount * 4.33 : sub.amount;
      return acc + (viewMode === 'Monthly' ? amount : amount * 12);
    }, 0) * 0.3; // Assume 30% can be saved

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const monthlyTrendData = [
    { name: 'Jan', amount: displaySpend * 0.85, count: activeSubs.length - 1 },
    { name: 'Feb', amount: displaySpend * 0.92, count: activeSubs.length - 1 },
    { name: 'Mar', amount: displaySpend * 0.98, count: activeSubs.length },
    { name: 'Apr', amount: displaySpend * 1.05, count: activeSubs.length + 1 },
    { name: 'May', amount: displaySpend * 1.12, count: activeSubs.length + 1 },
    { name: 'Jun', amount: displaySpend, count: activeSubs.length },
  ];

  const detailedCategoryData = activeSubs.map(sub => ({
    name: sub.serviceName,
    category: sub.category,
    amount: viewMode === 'Monthly' ? (sub.renewalType === 'Monthly' ? sub.amount : sub.amount / 12) : (sub.renewalType === 'Monthly' ? sub.amount * 12 : sub.amount)
  })).sort((a, b) => b.amount - a.amount);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Deep dive into your spending habits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
            {(['Monthly', 'Yearly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  viewMode === mode 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <button 
            onClick={() => toast('Filter options coming soon', { icon: '🔍' })}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button 
            onClick={() => toast.success('Report generation started...')}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Export Report
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: `Total ${viewMode}`, value: formatCurrency(displaySpend, currency), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: viewMode === 'Monthly' ? 'Annual Projection' : 'Monthly Average', value: formatCurrency(viewMode === 'Monthly' ? displaySpend * 12 : displaySpend / 12, currency), icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Sub Cost', value: formatCurrency(displaySpend / activeSubs.length, currency), icon: PieChartIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Savings Potential', value: formatCurrency(savingsPotential, currency), icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="neumorphic-card p-6"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-xl font-bold font-display tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trend (Area + Line) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Spending & Subscription Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Spend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Count</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                <Line yAxisId="right" type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Top Subscriptions by Cost</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedCategoryData.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20}>
                  {detailedCategoryData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights & Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscription Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neumorphic-card p-6"
        >
          <h3 className="text-lg font-bold mb-6">Subscription Efficiency</h3>
          <div className="space-y-6">
            {activeSubs.slice(0, 4).map((sub, i) => (
              <div key={sub._id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold">{sub.serviceName}</span>
                  <span className="text-slate-500">Usage: {80 - i * 12}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${80 - i * 12}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn("h-full rounded-full", i === 0 ? "bg-emerald-500" : i === 1 ? "bg-indigo-500" : "bg-amber-500")}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Savings Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neumorphic-card p-6"
        >
          <h3 className="text-lg font-bold mb-6">Potential Savings Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Unused Trials', value: savingsPotential * 0.4, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Redundant Services', value: savingsPotential * 0.35, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Annual Plan Savings', value: savingsPotential * 0.25, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between p-4 neumorphic-inset rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs", item.bg, item.color)}>
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="font-bold text-emerald-600">+{formatCurrency(item.value, currency)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
