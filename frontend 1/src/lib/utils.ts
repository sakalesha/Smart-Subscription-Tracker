import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR') {
  const locales: Record<string, string> = {
    'INR': 'en-IN',
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'AUD': 'en-AU',
    'CAD': 'en-CA',
    'BRL': 'pt-BR',
    'CNY': 'zh-CN'
  };

  return new Intl.NumberFormat(locales[currency] || 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}
