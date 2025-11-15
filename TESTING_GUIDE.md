# 🧪 Smart Subscription Tracker - Testing Guide

## 🚀 Quick Start Testing

### 1. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 2. Add Sample Data (Optional)
```bash
# Terminal 3 - Add sample data
cd backend
node scripts/addSampleData.js
```

### 3. Test Account
- **Email**: `test@example.com`
- **Password**: `TestPassword123`

---

## 📊 Sample Data Overview

### Summary Cards Expected Values:
- **Total Subscriptions**: 15
- **Active Subscriptions**: 13
- **Due Soon**: 3-4 (depends on current date)
- **Monthly Spending**: ~₹4,500-5,000

### Categories Distribution:
- **Entertainment**: 5 subscriptions (Netflix, Amazon Prime, Disney+, YouTube, HBO Max)
- **Music**: 3 subscriptions (Spotify, Apple Music, Pandora)
- **Software**: 4 subscriptions (Adobe, Microsoft 365, Zoom, Canva)
- **Cloud**: 2 subscriptions (Google Drive, Dropbox)
- **News**: 1 subscription (NY Times)

### Status Distribution:
- **Active**: 13 subscriptions
- **Expired**: 1 subscription (Pandora)
- **Cancelled**: 1 subscription (HBO Max)

---

## 🔍 Testing Scenarios

### A. Authentication Testing
1. **Register New Account**
   - Go to `/register`
   - Fill form with valid data
   - Verify success message and redirect to login

2. **Login with Test Account**
   - Use `test@example.com` / `TestPassword123`
   - Verify redirect to dashboard
   - Check user name in navbar

3. **Logout**
   - Click logout button
   - Verify redirect to login page

### B. Dashboard Features Testing

#### 1. Summary Cards
- Verify all 4 cards show correct numbers
- Check hover effects and animations
- Verify icons and colors

#### 2. Add Subscription
- Click "Add Subscription" button
- Test form validation:
  - Empty service name → error
  - Amount = 0 → error
  - No renewal date → error
- Fill valid data and submit
- Verify new subscription appears in table

#### 3. Table Operations
- **View**: Check all columns display correctly
- **Edit**: Click edit button, modify data, save
- **Delete**: Click delete, confirm, verify removal
- **Filter**: Test all filter options
- **Sort**: Test all sort options

#### 4. Charts & Analytics
- Verify bar chart shows monthly spending
- Verify pie chart shows category breakdown
- Check tooltips on hover
- Verify quick insights numbers

### C. Responsive Testing
- Resize browser window
- Test on mobile viewport
- Verify table horizontal scroll
- Check modal responsiveness

---

## 🎯 Specific Test Cases

### Test Case 1: Filter by Category
1. Select "Entertainment" from filter dropdown
2. **Expected**: Only 5 entertainment subscriptions shown
3. **Verify**: Summary cards update to reflect filtered data

### Test Case 2: Sort by Amount
1. Select "Sort by Amount" from sort dropdown
2. **Expected**: Subscriptions sorted by amount (highest first)
3. **Verify**: Microsoft 365 (₹6999) appears first

### Test Case 3: Add New Subscription
1. Click "Add Subscription"
2. Fill form:
   - Service: "Test Service"
   - Amount: 299
   - Category: "Software"
   - Renewal: "Monthly"
   - Date: Next month
3. Submit form
4. **Expected**: New subscription appears in table
5. **Verify**: Summary cards update

### Test Case 4: Edit Subscription
1. Click "Edit" on any subscription
2. Change amount from original to new value
3. Click "Save"
4. **Expected**: Table shows updated amount
5. **Verify**: Charts and summary cards recalculate

### Test Case 5: Delete Subscription
1. Click "Delete" on any subscription
2. Confirm deletion in dialog
3. **Expected**: Subscription removed from table
4. **Verify**: Summary cards update

---

## 🐛 Common Issues & Solutions

### Issue: Charts not showing
**Solution**: Add at least 2-3 subscriptions to see chart data

### Issue: Filter not working
**Solution**: Check browser console for errors, refresh page

### Issue: Edit not saving
**Solution**: Verify all required fields are filled

### Issue: Login fails
**Solution**: Check backend is running on port 5000

---

## 📱 Mobile Testing

### Test on Mobile Viewport (375px width):
1. **Navbar**: Should stack vertically
2. **Summary Cards**: Should be 2x2 grid
3. **Table**: Should have horizontal scroll
4. **Modal**: Should be full width
5. **Charts**: Should be responsive

---

## 🎨 UI/UX Testing

### Visual Elements:
- ✅ Cards have hover effects
- ✅ Buttons have loading states
- ✅ Forms show validation errors
- ✅ Modals have backdrop blur
- ✅ Charts have smooth animations

### Accessibility:
- ✅ All buttons have proper labels
- ✅ Form inputs have proper labels
- ✅ Color contrast is sufficient
- ✅ Keyboard navigation works

---

## 📈 Performance Testing

### Load Time:
- Initial page load: < 3 seconds
- Chart rendering: < 1 second
- Table updates: < 500ms
- Modal opening: < 200ms

### Memory Usage:
- Monitor browser dev tools
- Check for memory leaks
- Verify proper cleanup on logout

---

## 🔧 Debugging Tips

### Browser Dev Tools:
1. **Console**: Check for JavaScript errors
2. **Network**: Verify API calls are successful
3. **Application**: Check localStorage for auth data
4. **Performance**: Monitor rendering performance

### Common Console Errors:
- `401 Unauthorized`: Check JWT token
- `404 Not Found`: Check API endpoints
- `CORS Error`: Check backend CORS settings

---

## ✅ Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads with data
- [ ] Summary cards show correct numbers
- [ ] Add subscription works
- [ ] Edit subscription works
- [ ] Delete subscription works
- [ ] Filtering works for all options
- [ ] Sorting works for all options
- [ ] Charts render correctly
- [ ] Responsive design works
- [ ] Logout works
- [ ] Error handling works
- [ ] Loading states work
- [ ] Form validation works

---

## 🎉 Success Criteria

Your Smart Subscription Tracker is working correctly if:
1. ✅ All CRUD operations work smoothly
2. ✅ Charts display accurate data
3. ✅ Filtering and sorting work properly
4. ✅ Responsive design works on all devices
5. ✅ Authentication flow is secure
6. ✅ UI/UX is polished and professional
7. ✅ No console errors
8. ✅ Performance is smooth

**Happy Testing! 🚀**
