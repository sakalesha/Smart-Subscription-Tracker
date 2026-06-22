import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../types';
import api from '../services/api';
import { isBefore, addDays, differenceInDays, addMonths, addWeeks, addYears, isAfter } from 'date-fns';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'renewal' | 'trial' | 'budget' | 'payment';
  date: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const checkSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      const subs: Subscription[] = response.data;
      const newNotifications: Notification[] = [];
      const today = new Date();

      for (const sub of subs) {
        if (sub.status !== 'Active') continue;

        const nextRenewal = new Date(sub.nextRenewalDate);
        
        // 1. Simulate Recurring Payments
        if (isBefore(nextRenewal, today)) {
          let newNextRenewal = nextRenewal;
          while (isBefore(newNextRenewal, today)) {
            if (sub.renewalType === 'Monthly') newNextRenewal = addMonths(newNextRenewal, 1);
            else if (sub.renewalType === 'Yearly') newNextRenewal = addYears(newNextRenewal, 1);
            else if (sub.renewalType === 'Weekly') newNextRenewal = addWeeks(newNextRenewal, 1);
            else break;
          }

          // Update subscription in "backend"
          await api.patch(`/subscriptions/${sub._id}`, { 
            nextRenewalDate: newNextRenewal.toISOString(),
            lastReminderDate: today.toISOString()
          });

          newNotifications.push({
            id: `payment-${sub._id}-${today.getTime()}`,
            title: 'Payment Processed',
            message: `Recurring payment of ${sub.amount} for ${sub.serviceName} has been processed.`,
            type: 'payment',
            date: new Date(),
            read: false
          });
        }

        // 2. Automated Reminders
        const daysUntilRenewal = differenceInDays(nextRenewal, today);

        // Renewal Alert (within 3 days)
        if (daysUntilRenewal >= 0 && daysUntilRenewal <= 3) {
          newNotifications.push({
            id: `renewal-${sub._id}-${sub.nextRenewalDate}`,
            title: 'Upcoming Renewal',
            message: `${sub.serviceName} renews in ${daysUntilRenewal === 0 ? 'today' : `${daysUntilRenewal} days`}.`,
            type: 'renewal',
            date: new Date(),
            read: false
          });
        }

        // Trial Alert (within 2 days)
        if (sub.isTrial && sub.trialEndDate) {
          const trialEnd = new Date(sub.trialEndDate);
          const daysUntilTrialEnd = differenceInDays(trialEnd, today);
          if (daysUntilTrialEnd >= 0 && daysUntilTrialEnd <= 2) {
            newNotifications.push({
              id: `trial-${sub._id}-${sub.trialEndDate}`,
              title: 'Trial Ending Soon',
              message: `Your trial for ${sub.serviceName} ends in ${daysUntilTrialEnd === 0 ? 'today' : `${daysUntilTrialEnd} days`}.`,
              type: 'trial',
              date: new Date(),
              read: false
            });
          }
        }
      }

      // Filter out duplicate notifications (by ID)
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
        
        // Show toast for new ones
        uniqueNew.forEach(n => {
          setTimeout(() => {
            toast(n.message, {
              icon: n.type === 'trial' ? '⏳' : n.type === 'payment' ? '💳' : '📅',
              duration: 5000,
            });
          }, 0);
        });

        return [...uniqueNew, ...prev].slice(0, 50); // Keep last 50
      });

    } catch (error) {
      console.error('Failed to check subscriptions for notifications', error);
    }
  };

  useEffect(() => {
    checkSubscriptions();
    // Check every hour
    const interval = setInterval(checkSubscriptions, 3600000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
