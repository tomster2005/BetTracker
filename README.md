# Stake Analytics - Bet Tracker

A comprehensive betting analytics and tracking application with Firebase integration.

## Security Improvements Made

### 🔒 Critical Security Fixes

1. **Hardcoded Credentials Removed**
   - Firebase API keys and configuration moved to environment variables
   - Added fallback values for development
   - Created `.env.example` for proper setup

2. **Input Validation & Sanitization**
   - Added `sanitizeInput()` function to prevent XSS attacks
   - Added `validateNumericInput()` for number validation
   - Added `validateDateInput()` for date validation
   - All user inputs are now validated before processing

3. **Async/Await Consistency**
   - Fixed all database operations to use proper async/await
   - Ensures data consistency and prevents race conditions

## Setup Instructions

### 1. Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual Firebase credentials
# Never commit the .env file to version control
```

### 2. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore
3. Copy your Firebase config values to the `.env` file

### 3. Security Recommendations

#### For Production Deployment:
- **Never expose API keys in client-side code**
- Use Firebase Security Rules to restrict database access
- Enable HTTPS only
- Implement rate limiting
- Regular security audits

#### Firebase Security Rules Example:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## File Structure
```
Bet Tracker/
├── index.html          # Main application
├── auth.html           # Authentication page
├── config.js           # Configuration management
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Features
- 📊 Comprehensive betting analytics
- 💰 Multi-bankroll management
- 📈 Interactive charts and graphs
- 🔐 Secure user authentication
- 📱 Responsive design
- ☁️ Cloud data synchronization

## Security Features
- ✅ Input sanitization
- ✅ Data validation
- ✅ Environment variable configuration
- ✅ Secure authentication
- ✅ XSS protection
- ✅ Async operation handling

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development
1. Clone the repository
2. Set up environment variables
3. Configure Firebase
4. Open `index.html` in a web server (not file://)

## Production Deployment
1. Set `NODE_ENV=production`
2. Configure proper Firebase Security Rules
3. Enable HTTPS
4. Set up proper CORS policies
5. Implement rate limiting

## Support
For security issues, please report privately to the maintainer.