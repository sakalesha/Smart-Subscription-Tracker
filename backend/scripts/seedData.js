import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import SpendHistory from '../models/SpendHistory.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Clearing old demo data...');
    const existingDemoUser = await User.findOne({ email: 'demo@example.com' });
    if (existingDemoUser) {
      await Subscription.deleteMany({ userId: existingDemoUser._id });
      await SpendHistory.deleteMany({ userId: existingDemoUser._id });
      await User.deleteOne({ _id: existingDemoUser._id });
    }

    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      settings: {
        emailAlerts: true,
        dailySummary: true,
        upcomingRenewalsDays: 3,
        forecastThresholdPercent: 20,
        timezone: 'UTC'
      }
    });

    console.log('Creating subscriptions...');
    const now = new Date();
    
    const subs = [
      {
        serviceName: 'Netflix',
        amount: 499,
        category: 'Entertainment',
        renewalType: 'Monthly',
        status: 'Active',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), // Renewing in 2 days (Warning alert)
      },
      {
        serviceName: 'Spotify',
        amount: 119,
        category: 'Music',
        renewalType: 'Monthly',
        status: 'Active',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()), // Renewing today (Critical alert)
      },
      {
        serviceName: 'Amazon Prime',
        amount: 1499,
        category: 'Entertainment',
        renewalType: 'Yearly',
        status: 'Active',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth() + 3, 15),
      },
      {
        serviceName: 'Adobe Creative Cloud',
        amount: 1999,
        category: 'Software',
        renewalType: 'Monthly',
        status: 'Active',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15),
      },
      {
        serviceName: 'AWS',
        amount: 3500,
        category: 'Cloud',
        renewalType: 'Monthly',
        status: 'Active',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
      {
        serviceName: 'Gym Membership',
        amount: 2000,
        category: 'Health',
        renewalType: 'Monthly',
        status: 'Active',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5), // Renewing in 5 days
      },
      {
        serviceName: 'Old VPN',
        amount: 500,
        category: 'Utilities',
        renewalType: 'Monthly',
        status: 'Cancelled',
        nextRenewalDate: new Date(now.getFullYear(), now.getMonth() - 2, 10),
      }
    ];

    for (const sub of subs) {
      await Subscription.create({
        ...sub,
        userId: demoUser._id,
        userEmail: demoUser.email
      });
    }

    console.log('Creating spend history...');
    for (let i = 1; i <= 5; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYM = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Randomize spend history a bit
      const randomVariance = Math.floor(Math.random() * 1000) - 500;
      
      await SpendHistory.create({
        userId: demoUser._id,
        month: monthYM,
        totalSpend: 9616 + randomVariance,
        categoryBreakdown: {
          'Entertainment': 1998,
          'Music': 119,
          'Software': 1999,
          'Cloud': 3500,
          'Health': 2000
        }
      });
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
