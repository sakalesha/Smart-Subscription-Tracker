// Script to add sample data to MongoDB
// Run this script to populate your database with test data

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const sampleData = [
  {
    serviceName: "Netflix",
    amount: 499,
    category: "Entertainment",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-15"),
    status: "Active"
  },
  {
    serviceName: "Spotify Premium",
    amount: 129,
    category: "Music",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-20"),
    status: "Active"
  },
  {
    serviceName: "Adobe Creative Cloud",
    amount: 1999,
    category: "Software",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-25"),
    status: "Active"
  },
  {
    serviceName: "Amazon Prime",
    amount: 1499,
    category: "Entertainment",
    renewalType: "Yearly",
    nextRenewalDate: new Date("2024-02-10"),
    status: "Active"
  },
  {
    serviceName: "Microsoft 365",
    amount: 6999,
    category: "Software",
    renewalType: "Yearly",
    nextRenewalDate: new Date("2024-03-15"),
    status: "Active"
  },
  {
    serviceName: "Google Drive",
    amount: 199,
    category: "Cloud",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-12"),
    status: "Active"
  },
  {
    serviceName: "Disney+ Hotstar",
    amount: 1499,
    category: "Entertainment",
    renewalType: "Yearly",
    nextRenewalDate: new Date("2024-01-08"),
    status: "Active"
  },
  {
    serviceName: "Apple Music",
    amount: 99,
    category: "Music",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-18"),
    status: "Active"
  },
  {
    serviceName: "Zoom Pro",
    amount: 1499,
    category: "Software",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-22"),
    status: "Active"
  },
  {
    serviceName: "The New York Times",
    amount: 199,
    category: "News",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-30"),
    status: "Active"
  },
  {
    serviceName: "Dropbox Plus",
    amount: 999,
    category: "Cloud",
    renewalType: "Yearly",
    nextRenewalDate: new Date("2024-04-05"),
    status: "Active"
  },
  {
    serviceName: "YouTube Premium",
    amount: 129,
    category: "Entertainment",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2024-01-05"),
    status: "Active"
  },
  {
    serviceName: "Canva Pro",
    amount: 1499,
    category: "Software",
    renewalType: "Yearly",
    nextRenewalDate: new Date("2024-05-20"),
    status: "Active"
  },
  {
    serviceName: "Pandora Premium",
    amount: 99,
    category: "Music",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2023-12-28"),
    status: "Expired"
  },
  {
    serviceName: "HBO Max",
    amount: 199,
    category: "Entertainment",
    renewalType: "Monthly",
    nextRenewalDate: new Date("2023-11-15"),
    status: "Cancelled"
  }
];

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test user
    const hashedPassword = await bcrypt.hash('TestPassword123', 10);
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    console.log('✅ Test user created:', testUser.email);

    // Add sample subscriptions
    const subscriptionsWithUserId = sampleData.map(sub => ({
      ...sub,
      userId: testUser._id
    }));

    const createdSubscriptions = await Subscription.insertMany(subscriptionsWithUserId);
    console.log(`✅ Added ${createdSubscriptions.length} sample subscriptions`);

    console.log('\n🎉 Sample data added successfully!');
    console.log('📧 Test Account: test@example.com');
    console.log('🔑 Password: TestPassword123');
    console.log('\n🚀 You can now test the dashboard with this account!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the script
addSampleData();
