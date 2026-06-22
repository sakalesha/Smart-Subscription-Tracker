import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  Plus, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { format, isAfter, addDays, isBefore, differenceInDays } from 'date-fns';
import api from '../services/api';
import { Subscription } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
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
  Pie
} from 'recharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currency, monthlyBudget } = useSettings();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const upcomingRenewals = activeSubs
    .filter(s => isAfter(new Date(s.nextRenewalDate), new Date()))
    .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime())
    .slice(0, 3);

  const categoryData = activeSubs.reduce((acc: any[], sub) => {
    const existing = acc.find(item => item.name === sub.category);
    if (existing) {
      existing.value += sub.amount;
    } else {
      acc.push({ name: sub.category, value: sub.amount });
    }
    return acc;
  }, []);

  const budgetProgress = (monthlySpend / monthlyBudget) * 100;
  const isOverBudget = monthlySpend > monthlyBudget;

  const trialSubscriptions = activeSubs.filter(s => s.isTrial);
  const savingsPotential = activeSubs
    .filter(s => s.isTrial || s.amount > 1000)
    .reduce((acc, sub) => {
      const amount = sub.renewalType === 'Monthly' ? sub.amount : 
                     sub.renewalType === 'Yearly' ? sub.amount / 12 : 
                     sub.renewalType === 'Weekly' ? sub.amount * 4.33 : sub.amount;
      return acc + amount;
    }, 0) * 0.3;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview of your subscription ecosystem</p>
        </div>
        <button 
          onClick={() => navigate('/subscriptions')}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" /> Add Subscription
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
              isOverBudget ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20" : "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            )}>
              {isOverBudget ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} 
              {Math.abs(budgetProgress - 100).toFixed(0)}% {isOverBudget ? 'over' : 'of'} budget
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Monthly Spend</p>
          <h3 className="text-2xl font-bold font-display tracking-tight">{formatCurrency(monthlySpend, currency)}</h3>
          
          {/* Budget Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Budget Progress</span>
              <span>{formatCurrency(monthlyBudget, currency)}</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  budgetProgress > 90 ? "bg-rose-500" : budgetProgress > 70 ? "bg-amber-500" : "bg-indigo-500"
                )}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Subscriptions</p>
          <h3 className="text-2xl font-bold font-display tracking-tight">{activeSubs.length}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Upcoming Renewals (7d)</p>
          <h3 className="text-2xl font-bold font-display tracking-tight">
            {activeSubs.filter(s => {
              const diff = new Date(s.nextRenewalDate).getTime() - new Date().getTime();
              return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
            }).length}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="neumorphic-card p-6 bg-indigo-600 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-indigo-100 mb-1">Savings Potential</p>
          <h3 className="text-2xl font-bold font-display tracking-tight">{formatCurrency(savingsPotential, currency)}</h3>
          <p className="text-[10px] font-bold mt-2 text-indigo-200 uppercase tracking-widest">Optimizable Subs</p>
        </motion.div>
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neumorphic-card p-6"
        >
          <h3 className="text-lg font-bold mb-6">Category Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Bills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Upcoming Bills</h3>
            <button 
              onClick={() => navigate('/subscriptions')}
              className="text-indigo-600 text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingRenewals.length > 0 ? (
              upcomingRenewals.map((sub, i) => {
                const isVerySoon = isBefore(new Date(sub.nextRenewalDate), addDays(new Date(), 3));
                return (
                  <div key={sub._id} className="flex items-center justify-between p-4 neumorphic-inset">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                        <span className="font-bold text-indigo-600">{sub.serviceName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm">{sub.serviceName}</h4>
                          {sub.isTrial && (
                            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" /> TRIAL
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {format(new Date(sub.nextRenewalDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(sub.amount, currency)}</p>
                      {isVerySoon && (
                        <span className="text-[10px] font-bold text-rose-500 animate-pulse">Reminder Sent</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p>No upcoming renewals found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Trial Watchlist & Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trial Watchlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neumorphic-card p-6 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Trial Watchlist</h3>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-4">
            {trialSubscriptions.length > 0 ? (
              trialSubscriptions.map((sub) => {
                const daysLeft = differenceInDays(new Date(sub.trialEndDate || sub.nextRenewalDate), new Date());
                return (
                  <div key={sub._id} className="p-4 neumorphic-inset rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{sub.serviceName}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded",
                        daysLeft <= 2 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {daysLeft}d left
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          daysLeft <= 2 ? "bg-rose-500" : "bg-amber-500"
                        )}
                        style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Ends {format(new Date(sub.trialEndDate || sub.nextRenewalDate), 'MMM d')}</span>
                      <button 
                        onClick={() => sub.cancellationUrl ? window.open(sub.cancellationUrl, '_blank') : navigate('/subscriptions')}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Cancel Now
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No active trials to watch.
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Projection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neumorphic-card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-bold mb-6">Monthly Projection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', amount: monthlySpend * 0.9 },
                { name: 'Feb', amount: monthlySpend * 1.1 },
                { name: 'Mar', amount: monthlySpend },
                { name: 'Apr', amount: monthlySpend * 1.05 },
                { name: 'May', amount: monthlySpend },
                { name: 'Jun', amount: monthlySpend * 0.95 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
