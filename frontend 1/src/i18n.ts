import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          dashboard: 'Dashboard',
          subscriptions: 'Subscriptions',
          analytics: 'Analytics',
          settings: 'Settings',
          totalMonthlySpend: 'Total Monthly Spend',
          upcomingBills: 'Upcoming Bills',
          addSubscription: 'Add Subscription',
        }
      },
      hi: {
        translation: {
          dashboard: 'डैशबोर्ड',
          subscriptions: 'सदस्यताएँ',
          analytics: 'एनालिटिक्स',
          settings: 'सेटिंग्स',
          totalMonthlySpend: 'कुल मासिक खर्च',
          upcomingBills: 'आने वाले बिल',
          addSubscription: 'सदस्यता जोड़ें',
        }
      }
    }
  });

export default i18n;
