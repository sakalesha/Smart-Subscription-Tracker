import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Navbar from './Navbar';

const AddSubscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    amount: '',
    category: 'Entertainment',
    renewalType: 'Monthly',
    nextRenewalDate: '',
    status: 'Active',
    aiCategory: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const serviceIcons = {
    'Netflix': '🎬', 'Spotify': '🎵', 'Amazon Prime': '📦', 'Disney+': '🏰',
    'YouTube': '📺', 'Apple Music': '🍎', 'Adobe': '🎨', 'Microsoft': '🪟',
    'Google': '🔍', 'Zoom': '📹', 'Dropbox': '📁', 'Canva': '✏️'
  };

  const quickAddTemplates = [
    { name: 'Netflix', amount: 499, category: 'Entertainment', renewalType: 'Monthly', icon: '🎬' },
    { name: 'Spotify Premium', amount: 129, category: 'Music', renewalType: 'Monthly', icon: '🎵' },
    { name: 'Amazon Prime', amount: 1499, category: 'Entertainment', renewalType: 'Yearly', icon: '📦' },
    { name: 'Adobe Creative Cloud', amount: 1999, category: 'Software', renewalType: 'Monthly', icon: '🎨' },
    { name: 'Microsoft 365', amount: 6999, category: 'Software', renewalType: 'Yearly', icon: '🪟' },
    { name: 'Google Drive', amount: 199, category: 'Cloud', renewalType: 'Monthly', icon: '🔍' },
    { name: 'Disney+ Hotstar', amount: 1499, category: 'Entertainment', renewalType: 'Yearly', icon: '🏰' },
    { name: 'YouTube Premium', amount: 129, category: 'Entertainment', renewalType: 'Monthly', icon: '📺' }
  ];

  const categories = [
    { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'Music', label: 'Music', icon: '🎵' },
    { value: 'Software', label: 'Software', icon: '💻' },
    { value: 'Cloud', label: 'Cloud Storage', icon: '☁️' },
    { value: 'News', label: 'News', icon: '📰' },
    { value: 'Utilities', label: 'Utilities', icon: '⚡' },
    { value: 'Health', label: 'Health & Fitness', icon: '🏥' },
    { value: 'Education', label: 'Education', icon: '📚' },
    { value: 'Gaming', label: 'Gaming', icon: '🎮' },
    { value: 'Other', label: 'Other', icon: '📱' }
  ];

  const renewalTypes = [
    { value: 'Monthly', label: 'Monthly', icon: '📅' },
    { value: 'Yearly', label: 'Yearly', icon: '🗓️' },
    { value: 'Weekly', label: 'Weekly', icon: '📆' },
    { value: 'One-time', label: 'One-time', icon: '🎯' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceName.trim()) newErrors.serviceName = 'Service name is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.nextRenewalDate) newErrors.nextRenewalDate = 'Renewal date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    if (formData.serviceName.length < 2) return;
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await api.post('/api/ai/categorize', { serviceName: formData.serviceName });
        if (response.data.category && response.data.confidence > 0.5) {
          setFormData(prev => ({ ...prev, category: response.data.category, aiCategory: response.data.category }));
        }
      } catch (error) {
        console.error('AI Categorization error:', error);
      }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.serviceName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleQuickAdd = (template) => {
    setFormData(prev => ({
      ...prev,
      serviceName: template.name,
      amount: template.amount,
      category: template.category,
      renewalType: template.renewalType
    }));
    setErrors({});
    toast.info(`${template.name} loaded!`, { position: "top-right", autoClose: 2000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await api.post('/api/subscriptions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      if (response.status === 200 || response.status === 201) {
        const { warnings } = response.data;
        if (warnings && warnings.length > 0) {
          warnings.forEach(warning => {
            toast.warning(warning.message, { position: "top-center", autoClose: 5000 });
          });
        }
        toast.success('Subscription added successfully!', { position: "top-right", autoClose: 3000 });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to add subscription. Please try again.' });
      }
      toast.error('Failed to add subscription. Please try again.', { position: "top-right", autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceIcon = (serviceName) => {
    if (serviceIcons[serviceName]) return serviceIcons[serviceName];
    const lowerName = serviceName.toLowerCase();
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) return icon;
    }
    const cat = categories.find(c => c.value === formData.category);
    return cat?.icon || '📱';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Add Subscription</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track a new subscription service</p>
        </div>

        {/* Quick Templates */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Templates</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Hide
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickAddTemplates.map((template, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAdd(template)}
                    className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                  >
                    <span className="text-2xl mb-2">{template.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">{template.name}</span>
                    <span className="text-xs text-slate-400 mt-1">₹{template.amount}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          {/* Error Banner */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-xl">{getServiceIcon(formData.serviceName)}</span>
                </div>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.serviceName ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                  placeholder="e.g., Netflix, Spotify"
                />
              </div>
              {errors.serviceName && <p className="mt-1.5 text-sm text-red-600">{errors.serviceName}</p>}
            </div>

            {/* Amount & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.amount ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <p className="mt-1.5 text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Renewal Type & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Renewal</label>
                <select
                  name="renewalType"
                  value={formData.renewalType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {renewalTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Next Renewal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="nextRenewalDate"
                  value={formData.nextRenewalDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.nextRenewalDate ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.nextRenewalDate && <p className="mt-1.5 text-sm text-red-600">{errors.nextRenewalDate}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
              <div className="flex gap-3">
                {['Active', 'Expired', 'Cancelled'].map(status => (
                  <label
                    key={status}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                      formData.status === status
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    {status === 'Active' && '✅'}
                    {status === 'Expired' && '❌'}
                    {status === 'Cancelled' && '🚫'}
                    <span className="text-sm font-medium">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Category Notice */}
            {formData.aiCategory && formData.aiCategory !== formData.category && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 px-4 py-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl"
              >
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm text-violet-700 dark:text-violet-300">AI suggested: {formData.aiCategory}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all text-sm shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Subscription
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AddSubscription;