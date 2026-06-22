import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [dismissedIds, setDismissedIds] = useState(() => {
    const saved = localStorage.getItem('dismissedAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/api/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedIds));
  }, [dismissedIds]);

  const handleDismiss = (id) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const handleMarkAllRead = () => {
    const allIds = alerts.map(a => a.id);
    setDismissedIds(prev => [...new Set([...prev, ...allIds])]);
  };

  const visibleAlerts = alerts.filter(alert => !dismissedIds.includes(alert.id));

  const filteredAlerts = visibleAlerts.filter(alert => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !alert.read;
    if (activeTab === 'Critical') return alert.type === 'Critical';
    return true;
  });

  const getAlertIcon = (type) => {
    if (type === 'Critical') {
      return (
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  return (
    <Layout pageTitle="System Alerts">
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {['All', 'Unread', 'Critical'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Alerts List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">You're all caught up!</p>
              <p className="mt-1">No {activeTab.toLowerCase()} alerts at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-base font-semibold text-slate-800 dark:text-white truncate pr-4">
                          {alert.title}
                        </h4>
                        <button 
                          onClick={() => handleDismiss(alert.id)}
                          className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Dismiss
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {alert.message}
                      </p>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        {new Date(alert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
      </div>
    </Layout>
  );
};

export default Alerts;
