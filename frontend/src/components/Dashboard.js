import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { exportFilteredSubscriptionsToCSV } from '../utils/csvExport';
import Layout from './Layout';
import SubscriptionTable from './SubscriptionTable';
import SummaryCards from './SummaryCards';
import SpendingCharts from './SpendingCharts';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nextRenewalDate');
  const [forecast, setForecast] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    fetchForecast();

    const handleSubscriptionAdded = () => {
      fetchSubscriptions();
      fetchForecast();
    };

    window.addEventListener('subscriptionAdded', handleSubscriptionAdded);
    return () => window.removeEventListener('subscriptionAdded', handleSubscriptionAdded);
  }, []);

  const fetchForecast = async () => {
    try {
      const response = await api.get('/api/ai/forecast');
      setForecast(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/subscriptions');
      setSubscriptions(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (id, updates) => {
    try {
      const response = await api.put(`/api/subscriptions/${id}`, updates);
      setSubscriptions(prev =>
        prev.map(sub => sub._id === id ? response.data : sub)
      );
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Failed to update subscription');
    }
  };

  const handleDeleteSubscription = async (id) => {
    try {
      const response = await api.delete(`/api/subscriptions/${id}`);
      setSubscriptions(prev => prev.filter(sub => sub._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      if (error.response?.data?.message) {
        setError(`Failed to delete: ${error.response.data.message}`);
      } else {
        setError('Failed to delete subscription. Please try again.');
      }
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'all') return true;
    if (filter === 'active') return sub.status === 'Active';
    if (filter === 'expired') return sub.status === 'Expired';
    if (filter === 'cancelled') return sub.status === 'Cancelled';
    return sub.category === filter;
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'nextRenewalDate') {
      return new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate);
    }
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    if (sortBy === 'serviceName') {
      return a.serviceName.localeCompare(b.serviceName);
    }
    return 0;
  });

  const handleExportCSV = () => {
    exportFilteredSubscriptionsToCSV(subscriptions, filter, sortBy);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Loading your subscriptions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout pageTitle="Dashboard" showAddButton={true}>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-300 text-sm flex-1">{error}</p>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and track all your subscriptions in one place
          </p>
        </div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SummaryCards
            subscriptions={subscriptions}
            forecast={forecast}
          />
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          {/* Mobile Filter Toggle */}
          <div className="sm:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {sortedSubscriptions.length} subscription{sortedSubscriptions.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Filter Controls */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block p-4`}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Select */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Filter</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Subscriptions</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Music">Music</option>
                  <option value="Software">Software</option>
                  <option value="Cloud">Cloud</option>
                  <option value="News">News</option>
                </select>
              </div>

              {/* Sort Select */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="nextRenewalDate">Renewal Date</option>
                  <option value="amount">Amount</option>
                  <option value="serviceName">Name</option>
                </select>
              </div>

              {/* Export Button */}
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <SubscriptionTable
            subscriptions={sortedSubscriptions}
            onUpdate={handleUpdateSubscription}
            onDelete={handleDeleteSubscription}
          />
        </motion.div>

        {/* Charts Section */}
        {subscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10"
          >
            <SpendingCharts subscriptions={subscriptions} />
          </motion.div>
        )}
      </main>
    </Layout>
  );
};

export default Dashboard;