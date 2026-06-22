import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    emailAlerts: true,
    dailySummary: false,
    upcomingRenewalsDays: 3,
    forecastThresholdPercent: 20,
    timezone: 'UTC'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/users/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingChange = (name, value) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await api.put('/api/users/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfile = () => (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Profile Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200" 
            defaultValue={user?.name}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
          <input 
            type="email" 
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200" 
            defaultValue={user?.email}
            disabled
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Timezone</label>
        <select 
          value={settings.timezone}
          onChange={(e) => handleSettingChange('timezone', e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 outline-none"
        >
          <option value="UTC">(UTC) Coordinated Universal Time</option>
          <option value="IST">(IST) Indian Standard Time</option>
          <option value="EST">(EST) Eastern Standard Time</option>
          <option value="PST">(PST) Pacific Standard Time</option>
        </select>
      </div>

      <div className="pt-4">
        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8 max-w-2xl">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Alert Settings</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800 dark:text-white">Email Alerts</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Receive critical alerts via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={settings.emailAlerts} onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800 dark:text-white">Daily Summary</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">A daily digest of upcoming renewals</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={settings.dailySummary} onChange={(e) => handleSettingChange('dailySummary', e.target.checked)} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800 dark:text-white">Upcoming Renewals (days before)</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">When to notify you before a bill is due</p>
          </div>
          <input 
            type="number" 
            min="1"
            max="30"
            className="w-20 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-center outline-none"
            value={settings.upcomingRenewalsDays}
            onChange={(e) => handleSettingChange('upcomingRenewalsDays', Number(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800 dark:text-white">Forecast Threshold (%)</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Alert me if my forecasted spend increases by this amount</p>
          </div>
          <div className="relative">
            <input 
              type="number" 
              min="1"
              max="100"
              className="w-20 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-center outline-none"
              value={settings.forecastThresholdPercent}
              onChange={(e) => handleSettingChange('forecastThresholdPercent', Number(e.target.value))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">%</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Recipients</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200" 
            defaultValue={user?.email}
            disabled
          />
          <p className="text-xs text-slate-500 mt-1.5">Alerts will be sent to the primary account email.</p>
        </div>

      </div>

      <div className="pt-6">
        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );

  return (
    <Layout pageTitle="Settings">
      <div className="max-w-4xl mx-auto py-6">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          
          {/* Settings Tabs Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 px-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto hide-scrollbar">
              {['Profile', 'Notifications', 'Integrations', 'Preferences'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

          {/* Settings Content */}
          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'Profile' && renderProfile()}
                {activeTab === 'Notifications' && renderNotifications()}
                {activeTab === 'Integrations' && (
                  <div className="text-center py-12 text-slate-500">
                    Integration settings coming soon.
                  </div>
                )}
                {activeTab === 'Preferences' && (
                  <div className="text-center py-12 text-slate-500">
                    Additional preferences coming soon.
                  </div>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Settings;
