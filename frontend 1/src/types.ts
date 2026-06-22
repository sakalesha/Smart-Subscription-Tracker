export interface User {
  id: string;
  name: string;
  email: string;
}

export type RenewalType = 'Monthly' | 'Yearly' | 'Weekly' | 'One-time';
export type SubscriptionStatus = 'Active' | 'Cancelled' | 'Expired';

export interface Subscription {
  _id: string;
  userId: string;
  userEmail: string;
  serviceName: string;
  amount: number;
  category: string;
  renewalType: RenewalType;
  nextRenewalDate: string;
  status: SubscriptionStatus;
  lastReminderDate: string | null;
  isTrial?: boolean;
  trialEndDate?: string;
  attachmentUrl?: string;
  cancellationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Stats {
  totalMonthlySpend: number;
  activeCount: number;
  cancelledCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface Recommendation {
  subscriptionId: string;
  serviceName: string;
  amount: number;
  monthlyAmount: number;
  category: string;
  keepScore: number;
  reason: string;
  action: 'KEEP' | 'CANCEL' | 'CONSIDER' | 'MONITOR';
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  potentialMonthlySavings: number;
}
