import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const SubscriptionDetails = () => {
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await api.get(`/api/subscriptions/${id}`);
        setSubscription(response.data);
      } catch (error) {
        console.error('Failed to fetch subscription details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscription();
  }, [id]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Math.round(val));

  // Generate mocked chart and upcoming payments data based on the subscription
  const generateMockData = () => {
    if (!subscription) return { chartData: [], upcoming: [] };

    const chartData = [];
    const upcoming = [];
    const now = new Date();
    
    // Spend History (Last 6 months)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      chartData.push({
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        amount: subscription.amount
      });
    }

    // Upcoming Payments (Next 3 payments)
    let nextDate = new Date(subscription.nextRenewalDate);
    for (let i = 0; i < 3; i++) {
      upcoming.push({
        id: i,
        date: new Date(nextDate),
        amount: subscription.amount
      });
      // Increment date based on billing cycle
      if (subscription.renewalType === 'Monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (subscription.renewalType === 'Yearly') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else if (subscription.renewalType === 'Weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      }
    }

    return { chartData, upcoming };
  };

  const { chartData, upcoming } = generateMockData();

  if (isLoading) {
    return (
      <Layout pageTitle="Subscription Details">
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!subscription) {
    return (
      <Layout pageTitle="Subscription Not Found">
        <div className="max-w-4xl mx-auto py-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Subscription Not Found</h2>
            <p className="text-slate-500 mb-6">The subscription you are looking for does not exist or you don't have access to it.</p>
            <Link to="/dashboard" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Subscription Details">
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        
        {/* Breadcrumbs */}
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Subscriptions</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-800 dark:text-slate-200">{subscription.serviceName}</span>
        </div>

        {/* Header Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
              {subscription.serviceName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{subscription.serviceName}</h1>
                <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                  {subscription.category || 'Other'}
                </span>
              </div>
              <a href={`https://${subscription.serviceName.toLowerCase().replace(/\s/g, '')}.com`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {subscription.serviceName.toLowerCase().replace(/\s/g, '')}.com
              </a>
            </div>
          </div>
          <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${subscription.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {subscription.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Price</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{formatCurrency(subscription.amount)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Billing Cycle</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{subscription.renewalType}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Next Renewal</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{new Date(subscription.nextRenewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Created At</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{new Date(subscription.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6">
            <nav className="-mb-px flex space-x-8">
              {['Overview', 'History', 'Forecast', 'Notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'Overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Spend History Chart */}
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-6">Spend History</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="month" tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                        <RechartsTooltip 
                          formatter={(value) => [formatCurrency(value), 'Spend']}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Upcoming Payments List */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white">Upcoming Payments</h3>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</button>
                  </div>
                  <div className="space-y-4">
                    {upcoming.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="font-medium text-slate-800 dark:text-white">
                          {payment.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab !== 'Overview' && (
              <div className="text-center py-12 text-slate-500">
                {activeTab} content coming soon.
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default SubscriptionDetails;
