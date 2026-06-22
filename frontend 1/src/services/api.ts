import { Subscription, User } from '../types';

// Mock Data
let mockSubscriptions: Subscription[] = [
  {
    _id: '1',
    userId: 'user1',
    userEmail: 'demo@example.com',
    serviceName: 'Netflix',
    amount: 649,
    category: 'Entertainment',
    renewalType: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    lastReminderDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationUrl: 'https://www.netflix.com/cancelplan',
  },
  {
    _id: '2',
    userId: 'user1',
    userEmail: 'demo@example.com',
    serviceName: 'Spotify',
    amount: 119,
    category: 'Entertainment',
    renewalType: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    lastReminderDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cancellationUrl: 'https://www.spotify.com/account/overview/',
  },
  {
    _id: '3',
    userId: 'user1',
    userEmail: 'demo@example.com',
    serviceName: 'Adobe CC',
    amount: 4230,
    category: 'Software',
    renewalType: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    lastReminderDate: '2026-04-05',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    userId: 'user1',
    userEmail: 'demo@example.com',
    serviceName: 'YouTube Premium',
    amount: 129,
    category: 'Entertainment',
    renewalType: 'Monthly',
    nextRenewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    isTrial: true,
    trialEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    lastReminderDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockUser: User = {
  id: 'user1',
  name: 'Demo User',
  email: 'demo@example.com'
};

interface ApiService {
  post: (url: string, data: any) => Promise<any>;
  get: (url: string) => Promise<any>;
  put: (url: string, data: any) => Promise<any>;
  patch: (url: string, data: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
}

const api: ApiService = {
  post: async (url: string, data: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (url === '/users/login') {
      const { email, password } = data;
      // Allow specific dummy credentials or any non-empty password for demo
      if (email === 'admin@example.com' && password === 'password123') {
        return { data: { token: 'mock_token', user: mockUser } };
      }
      if (email && password) {
        return { data: { token: 'mock_token', user: { ...mockUser, email, name: email.split('@')[0] } } };
      }
      throw { response: { data: { message: 'Invalid credentials' } } };
    }

    if (url === '/users/register') {
      return { data: { token: 'mock_token', user: { ...mockUser, ...data } } };
    }
    
    if (url === '/subscriptions') {
      const newSub: Subscription = {
        ...data,
        _id: Math.random().toString(36).substr(2, 9),
        userId: mockUser.id,
        userEmail: mockUser.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastReminderDate: null,
      };
      mockSubscriptions.push(newSub);
      return { data: newSub };
    }
    
    throw new Error('Not implemented');
  },
  
  get: async (url: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url === '/subscriptions') {
      return { data: [...mockSubscriptions] };
    }
    
    throw new Error('Not implemented');
  },
  
  put: async (url: string, data: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url.startsWith('/subscriptions/')) {
      const id = url.split('/').pop();
      const index = mockSubscriptions.findIndex(s => s._id === id);
      if (index !== -1) {
        mockSubscriptions[index] = { ...mockSubscriptions[index], ...data };
        return { data: mockSubscriptions[index] };
      }
    }
    
    throw new Error('Not implemented');
  },
  
  patch: async (url: string, data: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url.startsWith('/subscriptions/')) {
      const id = url.split('/').pop();
      const index = mockSubscriptions.findIndex(s => s._id === id);
      if (index !== -1) {
        mockSubscriptions[index] = { ...mockSubscriptions[index], ...data, updatedAt: new Date().toISOString() };
        return { data: mockSubscriptions[index] };
      }
    }
    
    throw new Error('Not implemented');
  },
  
  delete: async (url: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url.startsWith('/subscriptions/')) {
      const id = url.split('/').pop();
      mockSubscriptions = mockSubscriptions.filter(s => s._id !== id);
      return { data: { message: 'Deleted' } };
    }
    
    throw new Error('Not implemented');
  }
};

export default api;
