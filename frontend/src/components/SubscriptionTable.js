import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
      nextRenewalDate: subscription.nextRenewalDate.split('T')[0], // Format for date input
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
        console.log('Deleting subscription with ID:', id);
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Failed to delete subscription. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
    return `₹${amount}`;
  };

  if (subscriptions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-slate-200/50"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 mb-4"
        >
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </motion.div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No subscriptions found</h3>
        <p className="text-slate-600">Add your first subscription to get started!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600">
            <tr>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Service
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                Amount
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                Renewal Date
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                Countdown
              </th>
              <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
            {subscriptions.map((subscription, index) => (
              <motion.tr 
                key={subscription._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.1)' }}
                className="transition-colors duration-200"
              >
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  {editingId === subscription._id ? (
                    <input
                      type="text"
                      value={editData.serviceName}
                      onChange={(e) => setEditData({...editData, serviceName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{subscription.serviceName}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 sm:hidden">
                        {formatAmount(subscription.amount)} • {subscription.category}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  {editingId === subscription._id ? (
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 dark:text-slate-100">{formatAmount(subscription.amount)}</div>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {editingId === subscription._id ? (
                    <select
                      value={editData.category}
                      onChange={(e) => setEditData({...editData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Music">Music</option>
                      <option value="Software">Software</option>
                      <option value="Cloud">Cloud</option>
                      <option value="News">News</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {subscription.category}
                    </span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  {editingId === subscription._id ? (
                    <input
                      type="date"
                      value={editData.nextRenewalDate}
                      onChange={(e) => setEditData({...editData, nextRenewalDate: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 dark:text-slate-100">{formatDate(subscription.nextRenewalDate)}</div>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  {editingId === subscription._id ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {(() => {
                    const countdown = getCountdownBadge(subscription.nextRenewalDate, subscription.status);
                    return countdown ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${countdown.color} ${countdown.textColor}`}>
                        {countdown.text}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === subscription._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subscription._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SubscriptionTable;
