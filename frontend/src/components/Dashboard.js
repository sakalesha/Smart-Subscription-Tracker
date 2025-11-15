import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { exportFilteredSubscriptionsToCSV } from '../utils/csvExport';
import Navbar from './Navbar';
import SubscriptionTable from './SubscriptionTable';
import SummaryCards from './SummaryCards';
import SpendingCharts from './SpendingCharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nextRenewalDate');

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/subscriptions');
      setSubscriptions(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions');
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
      console.log('Attempting to delete subscription with ID:', id);
      const response = await api.delete(`/api/subscriptions/${id}`);
      console.log('Delete response:', response);
      setSubscriptions(prev => prev.filter(sub => sub._id !== id));
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error deleting subscription:', error);
      console.error('Error response:', error.response);
      if (error.response?.data?.message) {
        setError(`Failed to delete subscription: ${error.response.data.message}`);
      } else {
        setError('Failed to delete subscription. Please try again.');
      }
    }
  };

  // Filter subscriptions based on selected filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'all') return true;
    if (filter === 'active') return sub.status === 'Active';
    if (filter === 'expired') return sub.status === 'Expired';
    if (filter === 'cancelled') return sub.status === 'Cancelled';
    return sub.category === filter;
  });

  // Sort subscriptions
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="text-slate-600 text-xl font-medium">Loading dashboard...</div>
        </motion.div>
      </div>
    );
  }

  const handleExportCSV = () => {
    exportFilteredSubscriptionsToCSV(subscriptions, filter, sortBy);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Summary Cards */}
        <SummaryCards subscriptions={subscriptions} />

        {/* Filters and Sort */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm transition-all duration-200 text-slate-700 dark:text-slate-200"
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm transition-all duration-200 text-slate-700 dark:text-slate-200"
              >
                <option value="nextRenewalDate">Sort by Renewal Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="serviceName">Sort by Name</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                {sortedSubscriptions.length} subscription{sortedSubscriptions.length !== 1 ? 's' : ''} found
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Subscription Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <SpendingCharts subscriptions={subscriptions} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
