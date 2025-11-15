# 🚀 Smart Subscription Tracker

A modern, full-stack web application for managing and tracking subscription services with advanced features like dark mode, CSV export, renewal countdowns, and mobile-responsive design.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-blue?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-purple?logo=framer)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Dark/Light Mode Toggle** - Seamless theme switching with system preference detection
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Smooth Animations** - Framer Motion powered interactions
- **Glass Morphism Effects** - Modern backdrop blur and transparency
- **Gradient Backgrounds** - Beautiful color schemes throughout

### 📊 **Subscription Management**
- **Add/Edit/Delete Subscriptions** - Full CRUD operations
- **Smart Categories** - Entertainment, Music, Software, Cloud, News, etc.
- **Quick Add Templates** - Pre-configured popular services
- **Service Icons** - Visual representation for each subscription
- **Status Tracking** - Active, Expired, Cancelled states

### 📈 **Analytics & Insights**
- **Summary Cards** - Total subscriptions, active count, monthly spending
- **Interactive Charts** - Monthly spending trends and category breakdowns
- **Renewal Countdown** - Color-coded badges showing days until renewal
- **Spending Analytics** - Visual insights into subscription costs

### 📱 **Mobile-First Design**
- **Progressive Disclosure** - Shows essential info first on mobile
- **Touch-Optimized** - Perfect for mobile interactions
- **Responsive Tables** - Smart column hiding on smaller screens
- **Mobile Navigation** - Icon-only navigation on mobile devices

### 💾 **Data Management**
- **CSV Export** - Export filtered and sorted subscription data
- **Data Persistence** - Local storage for theme preferences
- **Real-time Updates** - Instant UI updates on data changes
- **Error Handling** - Graceful error states and user feedback

## 🛠️ **Tech Stack**

### **Frontend**
- **React 19.2.0** - Latest React with modern hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful, responsive charts
- **Axios** - HTTP client for API calls
- **React Toastify** - Elegant notifications

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Cron Jobs** - Automated renewal reminders

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Git** - Version control

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-subscription-tracker.git
   cd smart-subscription-tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   MONGODB_URI=mongodb://localhost:27017/subscription-tracker
   PORT=5000
   JWT_SECRET=your-secret-key
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 **Screenshots**

### **Dashboard**
- Clean, modern interface with summary cards
- Interactive charts showing spending patterns
- Responsive design that works on all devices

### **Dark Mode**
- Seamless theme switching
- Consistent dark theme across all components
- System preference detection

### **Mobile Experience**
- Touch-optimized interface
- Progressive disclosure of information
- Smooth animations and transitions

## 🎯 **Key Features in Detail**

### **🌙 Dark/Light Mode**
- Automatic system preference detection
- Persistent theme storage
- Smooth transitions between themes
- Consistent color scheme throughout

### **📊 Analytics Dashboard**
- Monthly spending trends
- Category-wise breakdown
- Interactive charts with hover effects
- Quick insights and statistics

### **⏰ Renewal Countdown**
- Color-coded badges based on urgency
- Real-time countdown calculations
- Visual indicators for due dates
- Smart status management

### **📤 CSV Export**
- Export filtered and sorted data
- Professional CSV formatting
- One-click download functionality
- Date formatting for Indian locale

### **📱 Mobile Responsiveness**
- Progressive disclosure of information
- Touch-optimized interactions
- Responsive table layouts
- Mobile-first design approach

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **Subscriptions**
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Blue (#3B82F6) to Teal (#14B8A6)
- **Secondary**: Slate grays for text and backgrounds
- **Accent**: Green for success, Red for errors, Orange for warnings
- **Dark Mode**: Slate-900 to Slate-50 gradient

### **Typography**
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable font stack
- **Code**: Monospace for technical content

### **Components**
- **Cards**: Rounded corners (rounded-xl), subtle shadows
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs with focus states
- **Tables**: Responsive, mobile-friendly layouts

## 🚀 **Deployment**

### **Frontend (Vercel/Netlify)**
```bash
cd frontend
npm run build
# Deploy the build folder
```

### **Backend (Heroku/Railway)**
```bash
cd backend
# Set environment variables
# Deploy with your preferred platform
```

### **Database (MongoDB Atlas)**
- Create a MongoDB Atlas cluster
- Update MONGODB_URI in environment variables
- Configure network access and database user

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS approach
- **Framer Motion** - For smooth animations
- **Recharts** - For beautiful chart components
- **MongoDB** - For the flexible database solution

## 📞 **Contact**

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- **Email**: your.email@example.com

---

<div align="center">
  <p>Made with ❤️ and lots of ☕</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
