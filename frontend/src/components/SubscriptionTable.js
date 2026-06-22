import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCountdownBadge } from '../utils/countdown';

const SubscriptionTable = ({ subscriptions, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (subscription) => {
    setEditingId(subscription._id);
    setEditData({
      serviceName: subscription.serviceName,
      amount: subscription.amount,
      category: subscription.category,
      renewalType: subscription.renewalType,
      nextRenewalDate: subscription.nextRenewalDate.split('T')[0],
      status: subscription.status
    });
  };

  const handleSave = async () => {
    try {
      await onUpdate(editingId, editData);
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Active':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          text: 'text-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-500'
        };
      case 'Expired':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          dot: 'bg-red-500'
        };
      case 'Cancelled':
        return {
          bg: 'bg-slate-100 dark:bg-slate-700/50',
          text: 'text-slate-600 dark:text-slate-400',
          dot: 'bg-slate-400'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          dot: 'bg-blue-500'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (subscriptions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center"
      >
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No subscriptions found</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Add your first subscription to get started tracking your spending.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Table Header - Desktop */}
      <div className="hidden md:block bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5">
          <div className="col-span-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</div>
          <div className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</div>
          <div className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</div>
          <div className="col-span-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Renewal</div>
          <div className="col-span-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</div>
          <div className="col-span-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {subscriptions.map((subscription, index) => {
          const statusStyles = getStatusStyles(subscription.status);
          const countdown = getCountdownBadge(subscription.nextRenewalDate, subscription.status);

          return (
            <motion.div
              key={subscription._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              {/* Service Name */}
              <div className="col-span-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${statusStyles.bg} ${statusStyles.text}`}>
                  {subscription.category === 'Entertainment' && '🎬'}
                  {subscription.category === 'Music' && '🎵'}
                  {subscription.category === 'Software' && '💻'}
                  {subscription.category === 'Cloud' && '☁️'}
                  {subscription.category === 'News' && '📰'}
                  {subscription.category === 'Other' && '📱'}
                  {!['Entertainment', 'Music', 'Software', 'Cloud', 'News', 'Other'].includes(subscription.category) && '📱'}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white text-sm">
                    {editingId === subscription._id ? (
                      <input
                        type="text"
                        value={editData.serviceName}
                        onChange={(e) => setEditData({...editData, serviceName: e.target.value})}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      subscription.serviceName
                    )}
                  </p>
                  <div className="flex items-center gap-2 md:hidden mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatAmount(subscription.amount)}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{subscription.category}</span>
                  </div>
                </div>
              </div>

              {/* Amount - Desktop */}
              <div className="col-span-2 hidden md:flex items-center">
                {editingId === subscription._id ? (
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatAmount(subscription.amount)}</span>
                )}
              </div>

              {/* Category - Desktop */}
              <div className="col-span-2 hidden md:flex items-center">
                {editingId === subscription._id ? (
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({...editData, category: e.target.value})}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Music">Music</option>
                    <option value="Software">Software</option>
                    <option value="Cloud">Cloud</option>
                    <option value="News">News</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {subscription.category}
                  </span>
                )}
              </div>

              {/* Renewal Date */}
              <div className="col-span-2 flex items-center">
                {editingId === subscription._id ? (
                  <input
                    type="date"
                    value={editData.nextRenewalDate}
                    onChange={(e) => setEditData({...editData, nextRenewalDate: e.target.value})}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{formatDate(subscription.nextRenewalDate)}</p>
                    {countdown && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{countdown.text}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="col-span-1 flex items-center justify-center">
                {editingId === subscription._id ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
                    {subscription.status}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-center gap-1">
                <AnimatePresence mode="wait">
                  {editingId === subscription._id ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <button
                        onClick={handleSave}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        title="Save"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        title="Cancel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(subscription._id)}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionTable;