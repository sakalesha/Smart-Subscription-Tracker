// Test script to verify delete functionality
// Run this to test the delete API endpoint

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

async function testDeleteFunctionality() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    console.log('✅ Found test user:', testUser.email);

    // Find a subscription to delete
    const subscription = await Subscription.findOne({ userId: testUser._id });
    if (!subscription) {
      console.log('❌ No subscriptions found for test user');
      return;
    }
    console.log('✅ Found subscription to test:', subscription.serviceName);
    console.log('📋 Subscription ID:', subscription._id);
    console.log('📋 Subscription ID String:', subscription._id.toString());

    // Generate JWT token
    const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);
    console.log('🔑 Generated JWT token');

    // Test the delete API call
    const response = await fetch(`http://localhost:5000/api/subscriptions/${subscription._id.toString()}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Delete API Response Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Delete successful:', result.message);
      
      // Verify subscription was deleted
      const deletedSub = await Subscription.findById(subscription._id);
      if (!deletedSub) {
        console.log('✅ Subscription successfully removed from database');
      } else {
        console.log('❌ Subscription still exists in database');
      }
    } else {
      const error = await response.json();
      console.log('❌ Delete failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the test
testDeleteFunctionality();
