// Sample data for testing the Smart Subscription Tracker Dashboard
// You can use this data to test the application

const sampleSubscriptions = [
  {
    serviceName: "Netflix",
    amount: 499,
    category: "Entertainment",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-15",
    status: "Active"
  },
  {
    serviceName: "Spotify Premium",
    amount: 129,
    category: "Music",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-20",
    status: "Active"
  },
  {
    serviceName: "Adobe Creative Cloud",
    amount: 1999,
    category: "Software",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-25",
    status: "Active"
  },
  {
    serviceName: "Amazon Prime",
    amount: 1499,
    category: "Entertainment",
    renewalType: "Yearly",
    nextRenewalDate: "2024-02-10",
    status: "Active"
  },
  {
    serviceName: "Microsoft 365",
    amount: 6999,
    category: "Software",
    renewalType: "Yearly",
    nextRenewalDate: "2024-03-15",
    status: "Active"
  },
  {
    serviceName: "Google Drive",
    amount: 199,
    category: "Cloud",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-12",
    status: "Active"
  },
  {
    serviceName: "Disney+ Hotstar",
    amount: 1499,
    category: "Entertainment",
    renewalType: "Yearly",
    nextRenewalDate: "2024-01-08",
    status: "Active"
  },
  {
    serviceName: "Apple Music",
    amount: 99,
    category: "Music",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-18",
    status: "Active"
  },
  {
    serviceName: "Zoom Pro",
    amount: 1499,
    category: "Software",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-22",
    status: "Active"
  },
  {
    serviceName: "The New York Times",
    amount: 199,
    category: "News",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-30",
    status: "Active"
  },
  {
    serviceName: "Dropbox Plus",
    amount: 999,
    category: "Cloud",
    renewalType: "Yearly",
    nextRenewalDate: "2024-04-05",
    status: "Active"
  },
  {
    serviceName: "YouTube Premium",
    amount: 129,
    category: "Entertainment",
    renewalType: "Monthly",
    nextRenewalDate: "2024-01-05",
    status: "Active"
  },
  {
    serviceName: "Canva Pro",
    amount: 1499,
    category: "Software",
    renewalType: "Yearly",
    nextRenewalDate: "2024-05-20",
    status: "Active"
  },
  {
    serviceName: "Pandora Premium",
    amount: 99,
    category: "Music",
    renewalType: "Monthly",
    nextRenewalDate: "2023-12-28",
    status: "Expired"
  },
  {
    serviceName: "HBO Max",
    amount: 199,
    category: "Entertainment",
    renewalType: "Monthly",
    nextRenewalDate: "2023-11-15",
    status: "Cancelled"
  }
];

// Test scenarios for different features:

const testScenarios = {
  // Test filtering
  filterTests: {
    all: "Should show all 15 subscriptions",
    active: "Should show 13 active subscriptions",
    expired: "Should show 1 expired subscription",
    cancelled: "Should show 1 cancelled subscription",
    entertainment: "Should show 5 entertainment subscriptions",
    music: "Should show 3 music subscriptions",
    software: "Should show 4 software subscriptions"
  },

  // Test sorting
  sortTests: {
    renewalDate: "Should sort by renewal date (earliest first)",
    amount: "Should sort by amount (highest first)",
    serviceName: "Should sort alphabetically by service name"
  },

  // Test calculations
  calculationTests: {
    totalSubscriptions: "Should show 15 total subscriptions",
    activeSubscriptions: "Should show 13 active subscriptions",
    dueSoon: "Should show subscriptions due within 7 days",
    monthlySpending: "Should calculate monthly equivalent spending"
  },

  // Test CRUD operations
  crudTests: {
    create: "Add a new subscription via modal",
    read: "View all subscriptions in table",
    update: "Edit subscription inline",
    delete: "Delete subscription with confirmation"
  }
};

// Instructions for testing
const testingInstructions = `
🧪 TESTING INSTRUCTIONS FOR SMART SUBSCRIPTION TRACKER

1. 🚀 START THE APPLICATION:
   - Backend: cd backend && npm start
   - Frontend: cd frontend && npm start

2. 👤 CREATE A TEST ACCOUNT:
   - Go to http://localhost:3000
   - Click "Register"
   - Use: test@example.com / TestPassword123
   - You'll be redirected to login

3. 📊 TEST DASHBOARD FEATURES:

   A. SUMMARY CARDS:
   - Total Subscriptions: Should show 0 initially
   - Add subscriptions to see numbers update
   - Test different renewal types (Monthly/Yearly)

   B. ADD SUBSCRIPTION:
   - Click "Add Subscription" button
   - Fill form with sample data
   - Test validation (empty fields, invalid amounts)
   - Submit and verify it appears in table

   C. TABLE OPERATIONS:
   - View subscriptions in table format
   - Test inline editing (click Edit button)
   - Test deletion (click Delete button)
   - Test filtering dropdown
   - Test sorting dropdown

   D. CHARTS:
   - Add multiple subscriptions to see charts
   - Test monthly spending bar chart
   - Test category breakdown pie chart
   - Test quick insights section

4. 🔍 SPECIFIC TEST CASES:

   Test Filtering:
   - Filter by "Active" → should show only active subscriptions
   - Filter by "Entertainment" → should show entertainment only
   - Filter by "All" → should show all subscriptions

   Test Sorting:
   - Sort by "Renewal Date" → earliest dates first
   - Sort by "Amount" → highest amounts first
   - Sort by "Name" → alphabetical order

   Test CRUD:
   - Create: Add Netflix ₹499/month
   - Read: Verify it appears in table
   - Update: Change amount to ₹599
   - Delete: Remove the subscription

5. 📱 RESPONSIVE TESTING:
   - Test on mobile (resize browser)
   - Test table horizontal scroll
   - Test modal responsiveness

6. 🎨 UI/UX TESTING:
   - Test hover effects on cards
   - Test button animations
   - Test loading states
   - Test error messages

7. 🔐 AUTHENTICATION TESTING:
   - Test logout functionality
   - Test protected routes (try accessing /dashboard without login)
   - Test token expiration handling
`;

export { sampleSubscriptions, testScenarios, testingInstructions };
