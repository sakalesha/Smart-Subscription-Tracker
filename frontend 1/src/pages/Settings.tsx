import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  CreditCard, 
  Mail,
  ChevronRight,
  Check,
  Save,
  Trash2,
  AlertTriangle,
  Monitor,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, currency, monthlyBudget, toggleTheme, setCurrency, setMonthlyBudget } = useSettings();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'Billing', icon: CreditCard },
    { name: 'Preferences', icon: Globe },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setMonthlyBudget(parseFloat(tempBudget) || 0);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-display tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and app preferences</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                activeTab === tab.name 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </div>
              {activeTab === tab.name && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="neumorphic-card p-8"
          >
            {activeTab === 'Profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 border-2 border-dashed border-indigo-200 dark:border-indigo-800">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Profile Picture</h3>
                    <p className="text-sm text-slate-500 mb-4">PNG, JPG up to 5MB</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toast.success('Profile picture upload simulation')}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        Upload New
                      </button>
                      <button 
                        onClick={() => toast.error('Profile picture removed')}
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="input-field" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Bio</label>
                    <textarea 
                      className="input-field min-h-[100px] resize-none" 
                      placeholder="Tell us a bit about yourself..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-6">Email Notifications</h3>
                {[
                  { label: 'Renewal Reminders', desc: 'Get notified 3 days before a subscription renews', checked: true },
                  { label: 'Spending Alerts', desc: 'Alert me when my monthly spend exceeds ₹5,000', checked: false },
                  { label: 'New Features', desc: 'Updates about new tools and improvements', checked: true },
                  { label: 'Security Alerts', desc: 'Important notifications about your account security', checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-4 neumorphic-inset">
                    <div>
                      <h4 className="font-bold text-sm">{item.label}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300",
                      item.checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    )}>
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300",
                        item.checked ? "left-7" : "left-1"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="input-field" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="input-field" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-rose-600 mb-4">Danger Zone</h3>
                  <div className="p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-rose-900 dark:text-rose-400">Delete Account</h4>
                        <p className="text-sm text-rose-700 dark:text-rose-500 mt-1">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
                          toast.error('Account deletion simulation');
                        }
                      }}
                      className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-colors whitespace-nowrap"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Budget Management</h3>
                  <div className="p-6 neumorphic-inset rounded-2xl space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Monthly Subscription Budget</h4>
                        <p className="text-xs text-slate-500">Set a limit to track your spending efficiency</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          {currencies.find(c => c.code === currency)?.symbol || '$'}
                        </span>
                        <input 
                          type="number" 
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="input-field pl-10" 
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="p-4 neumorphic-card flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                        <div>
                          <p className="text-sm font-bold">•••• •••• •••• 4242</p>
                          <p className="text-xs text-slate-500">Expires 12/24</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">Primary</span>
                    </div>
                    <button 
                      onClick={() => toast.success('Add payment method simulation')}
                      className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all"
                    >
                      + Add New Payment Method
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Preferences' && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">App Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={toggleTheme}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200",
                        theme === 'light' 
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                          : "border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                          <Sun className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Light Mode</p>
                          <p className="text-xs text-slate-500">Classic bright appearance</p>
                        </div>
                      </div>
                      {theme === 'light' && <Check className="w-5 h-5 text-indigo-600" />}
                    </button>

                    <button 
                      onClick={toggleTheme}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200",
                        theme === 'dark' 
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                          : "border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Moon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">Dark Mode</p>
                          <p className="text-xs text-slate-500">Easier on the eyes at night</p>
                        </div>
                      </div>
                      {theme === 'dark' && <Check className="w-5 h-5 text-indigo-600" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold">Currency & Region</h3>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Preferred Currency</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => setCurrency(curr.code as any)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                            currency === curr.code 
                              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                              : "border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                          )}
                        >
                          <span className="text-2xl font-bold text-indigo-600">{curr.symbol}</span>
                          <span className="text-xs font-bold">{curr.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4">
              <button 
                onClick={() => {
                  setTempBudget(monthlyBudget.toString());
                  toast('Changes reset', { icon: '🔄' });
                }}
                className="btn-secondary"
              >
                Reset Changes
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
                {isSaving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
