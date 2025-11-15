import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const AddSubscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    serviceName: '',
    amount: '',
    category: 'Entertainment',
    renewalType: 'Monthly',
    nextRenewalDate: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Service icons mapping
  const serviceIcons = {
    'Netflix': '🎬',
    'Spotify': '🎵',
    'Amazon Prime': '📦',
    'Disney+': '🏰',
    'YouTube': '📺',
    'Apple Music': '🍎',
    'Adobe': '🎨',
    'Microsoft': '🪟',
    'Google': '🔍',
    'Zoom': '📹',
    'Dropbox': '📁',
    'Canva': '✏️',
    'HBO': '🎭',
    'Hulu': '📱',
    'Twitch': '🎮',
    'Pandora': '🎶',
    'SoundCloud': '🎧',
    'Tidal': '🌊',
    'Apple TV': '📱',
    'Paramount': '⭐',
    'Peacock': '🦚',
    'Crunchyroll': '🍜',
    'Funimation': '🎌',
    'Shudder': '👻',
    'Mubi': '🎭',
    'Criterion': '🎬',
    'Vudu': '📺',
    'Fandango': '🎫',
    'IMDb TV': '🎭',
    'Tubi': '📺',
    'Pluto TV': '🪐',
    'Crackle': '🍿',
    'Xumo': '📺',
    'Roku': '📺',
    'Sling': '📺',
    'Philo': '📺',
    'fuboTV': '⚽',
    'YouTube TV': '📺',
    'Hulu Live': '📺',
    'DirecTV': '📺',
    'Dish': '📺',
    'Spectrum': '📺',
    'Comcast': '📺',
    'Verizon': '📺',
    'AT&T': '📺',
    'T-Mobile': '📺',
    'Sprint': '📺',
    'Boost': '📺',
    'Cricket': '📺',
    'Metro': '📺',
    'Visible': '📺',
    'Mint': '📺',
    'Google Fi': '📺',
    'Republic': '📺',
    'US Mobile': '📺',
    'Red Pocket': '📺',
    'Tello': '📺',
    'Twigby': '📺',
    'Ting': '📺',
    'Consumer Cellular': '📺',
    'Jitterbug': '📺',
    'GreatCall': '📺',
    'Lively': '📺',
    'Bay Alarm': '📺',
    'ADT': '📺',
    'Vivint': '📺',
    'SimpliSafe': '📺',
    'Ring': '📺',
    'Nest': '📺',
    'Arlo': '📺',
    'Blink': '📺',
    'Wyze': '📺',
    'Eufy': '📺',
    'TP-Link': '📺',
    'Netgear': '📺',
    'Linksys': '📺',
    'ASUS': '📺',
    'D-Link': '📺',
    'Belkin': '📺',
    'AmpliFi': '📺',
    'Ubiquiti': '📺',
    'MikroTik': '📺',
    'Cisco': '📺',
    'Juniper': '📺',
    'Fortinet': '📺',
    'Palo Alto': '📺',
    'Check Point': '📺',
    'SonicWall': '📺',
    'Sophos': '📺',
    'Kaspersky': '📺',
    'McAfee': '📺',
    'Norton': '📺',
    'Bitdefender': '📺',
    'Avast': '📺',
    'AVG': '📺',
    'Malwarebytes': '📺',
    'ESET': '📺',
    'Trend Micro': '📺',
    'Webroot': '📺',
    'VIPRE': '📺',
    'Comodo': '📺',
    'F-Secure': '📺',
    'G Data': '📺',
    'Emsisoft': '📺',
    'Adaware': '📺',
    'BullGuard': '📺',
    'K7': '📺',
    'Quick Heal': '📺',
    'Panda': '📺',
    'ZoneAlarm': '📺',
    'TotalAV': '📺',
    'PC Matic': '📺',
    'VIPRE': '📺',
    'Comodo': '📺',
    'F-Secure': '📺',
    'G Data': '📺',
    'Emsisoft': '📺',
    'Adaware': '📺',
    'BullGuard': '📺',
    'K7': '📺',
    'Quick Heal': '📺',
    'Panda': '📺',
    'ZoneAlarm': '📺',
    'TotalAV': '📺',
    'PC Matic': '📺'
  };

  // Quick add templates for common services
  const quickAddTemplates = [
    {
      name: 'Netflix',
      amount: 499,
      category: 'Entertainment',
      renewalType: 'Monthly',
      icon: '🎬'
    },
    {
      name: 'Spotify Premium',
      amount: 129,
      category: 'Music',
      renewalType: 'Monthly',
      icon: '🎵'
    },
    {
      name: 'Amazon Prime',
      amount: 1499,
      category: 'Entertainment',
      renewalType: 'Yearly',
      icon: '📦'
    },
    {
      name: 'Adobe Creative Cloud',
      amount: 1999,
      category: 'Software',
      renewalType: 'Monthly',
      icon: '🎨'
    },
    {
      name: 'Microsoft 365',
      amount: 6999,
      category: 'Software',
      renewalType: 'Yearly',
      icon: '🪟'
    },
    {
      name: 'Google Drive',
      amount: 199,
      category: 'Cloud',
      renewalType: 'Monthly',
      icon: '🔍'
    },
    {
      name: 'Disney+ Hotstar',
      amount: 1499,
      category: 'Entertainment',
      renewalType: 'Yearly',
      icon: '🏰'
    },
    {
      name: 'Apple Music',
      amount: 99,
      category: 'Music',
      renewalType: 'Monthly',
      icon: '🍎'
    },
    {
      name: 'Zoom Pro',
      amount: 1499,
      category: 'Software',
      renewalType: 'Monthly',
      icon: '📹'
    },
    {
      name: 'YouTube Premium',
      amount: 129,
      category: 'Entertainment',
      renewalType: 'Monthly',
      icon: '📺'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.nextRenewalDate) {
      newErrors.nextRenewalDate = 'Renewal date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuickAdd = (template) => {
    setFormData(prev => ({
      ...prev,
      serviceName: template.name,
      amount: template.amount,
      category: template.category,
      renewalType: template.renewalType
    }));
    
    // Clear any existing errors
    setErrors({});
    
    toast.info(`${template.name} template loaded!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/subscriptions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Subscription added successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error adding subscription:', error);
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to add subscription. Please try again.' });
      }
      
      toast.error('Failed to add subscription. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const getServiceIcon = (serviceName) => {
    // Try exact match first
    if (serviceIcons[serviceName]) {
      return serviceIcons[serviceName];
    }
    
    // Try partial matches
    const lowerName = serviceName.toLowerCase();
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
        return icon;
      }
    }
    
    // Default icons based on category
    const categoryIcons = {
      'Entertainment': '🎬',
      'Music': '🎵',
      'Software': '💻',
      'Cloud': '☁️',
      'News': '📰',
      'Other': '📱'
    };
    
    return categoryIcons[formData.category] || '📱';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Quick Add Templates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Quick Add Templates</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickAddTemplates.map((template, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAdd(template)}
                className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl p-4 hover:bg-white/90 dark:hover:bg-slate-600/90 hover:shadow-lg transition-all duration-200 text-slate-700 dark:text-slate-200 text-center shadow-sm"
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-slate-500">₹{template.amount}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200/50 dark:border-slate-700/50"
        >
          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-slate-700 mb-2">
                Service Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-2xl">{getServiceIcon(formData.serviceName)}</span>
                </div>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.serviceName ? 'border-red-400' : 'border-slate-300'
                  }`}
                  placeholder="e.g., Netflix, Spotify, Adobe"
                  disabled={isSubmitting}
                />
              </div>
              {errors.serviceName && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.amount ? 'border-red-400' : 'border-slate-300'
                }`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              >
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Music">🎵 Music</option>
                <option value="Software">💻 Software</option>
                <option value="Cloud">☁️ Cloud</option>
                <option value="News">📰 News</option>
                <option value="Utilities">⚡ Utilities</option>
                <option value="Health">🏥 Health</option>
                <option value="Education">📚 Education</option>
                <option value="Gaming">🎮 Gaming</option>
                <option value="Other">📱 Other</option>
              </select>
            </div>

            {/* Renewal Type */}
            <div>
              <label htmlFor="renewalType" className="block text-sm font-medium text-slate-700 mb-2">
                Renewal Type
              </label>
              <select
                id="renewalType"
                name="renewalType"
                value={formData.renewalType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              >
                <option value="Monthly">📅 Monthly</option>
                <option value="Yearly">🗓️ Yearly</option>
                <option value="Weekly">📆 Weekly</option>
                <option value="One-time">🎯 One-time</option>
              </select>
            </div>

            {/* Next Renewal Date */}
            <div>
              <label htmlFor="nextRenewalDate" className="block text-sm font-medium text-slate-700 mb-2">
                Next Renewal Date *
              </label>
              <input
                type="date"
                id="nextRenewalDate"
                name="nextRenewalDate"
                value={formData.nextRenewalDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.nextRenewalDate ? 'border-red-400' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.nextRenewalDate && (
                <p className="mt-1 text-sm text-red-600">{errors.nextRenewalDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isSubmitting}
              >
                <option value="Active">✅ Active</option>
                <option value="Expired">❌ Expired</option>
                <option value="Cancelled">🚫 Cancelled</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold bg-white/80 backdrop-blur-sm"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  'Add Subscription'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Toast Container */}
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
