 # 💰 WealthAI - AI-Powered Wealth Management System

> A modern, intelligent personal finance management platform that provides AI-driven financial advice tailored to your unique financial situation.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://your-app-url.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg)](https://firebase.google.com/)

![WealthAI Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=WealthAI+Dashboard)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Security](#security)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

WealthAI is a comprehensive personal finance management application that combines traditional financial tracking with cutting-edge AI technology. Users can track their income, expenses, and financial goals while receiving personalized financial advice from an AI advisor powered by Google's Gemini API.

### Key Highlights

- 🤖 **AI-Powered Advice**: Get personalized financial recommendations based on your actual financial data
- 💰 **Real-time Calculations**: Automatic computation of savings rate, expense ratios, and financial health metrics
- 🔒 **Secure & Private**: Firebase authentication with strict Firestore security rules ensuring data privacy
- 📊 **Visual Dashboard**: Clean, intuitive interface displaying your complete financial overview
- 🌐 **Responsive Design**: Seamlessly works across desktop, tablet, and mobile devices

## ✨ Features

### 🔐 Authentication & Security
- Email/Password authentication via Firebase Auth
- Protected routes with automatic redirection
- Session persistence across browser refreshes
- UID-based data isolation in Firestore

### 📝 Financial Profile Management
- Comprehensive onboarding flow for new users
- Track monthly income, expenses, and EMI payments
- Set and monitor short-term and long-term financial goals
- Editable profile with real-time updates

### 📊 Smart Dashboard
- **Financial Metrics Display**
  - Monthly income, expenses, and EMI tracking
  - Calculated monthly savings
  - Savings rate percentage
  - Expense and EMI ratios
- **Intelligent Insights**
  - Automated alerts for overspending
  - Savings rate recommendations
  - EMI-to-income ratio warnings
  - Goal achievement tracking

### 💬 AI Financial Advisor
- Context-aware chatbot powered by Google Gemini Pro
- Personalized advice based on your financial profile
- Conversation history maintenance
- Indian financial market expertise (PPF, SIP, Mutual Funds)
- Natural language query processing

### 🎨 User Experience
- Clean, modern UI with gradient designs
- Smooth animations and transitions
- Loading states and error handling
- Suggested conversation starters
- Real-time typing indicators

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI component library
- **React Router DOM 6.20.1** - Client-side routing
- **Vite 5.0.8** - Build tool and dev server
- **CSS3** - Custom styling (no frameworks)

### Backend & Database
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase SDK 10.7.1** - Firebase integration

### AI & APIs
- **Google Gemini Pro API** - AI-powered financial advice
- **Generative Language API** - Natural language processing

### Deployment & DevOps
- **Vercel** - Hosting and deployment
- **Git** - Version control
- **npm** - Package management

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git**
- A **Firebase** account
- A **Google AI Studio** account (for Gemini API)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/wealth-management-app.git

# Navigate to project directory
cd wealth-management-app

# Install dependencies
npm install

# Set up environment variables (see Configuration section)
# Create .env file and add your credentials

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/wealth-management-app.git
cd wealth-management-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- React Router DOM
- Firebase SDK
- Vite and build tools

### Step 3: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password sign-in method
4. Create a **Firestore Database** (start in test mode)
5. Register your web app and copy the configuration

### Step 4: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

⚠️ **Important**: Never commit the `.env` file to version control!

### Firestore Security Rules

Apply these security rules in Firebase Console → Firestore Database → Rules:

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

## 📖 Usage

### Creating an Account

1. Navigate to the signup page
2. Enter your email and password
3. Complete the onboarding form with your financial details
4. Access your personalized dashboard

### Managing Your Finances

1. **Dashboard**: View your financial overview and metrics
2. **Profile**: Update your income, expenses, EMI, and goals
3. **AI Chat**: Ask questions and get personalized financial advice

### AI Chat Examples

```
"How can I save more money each month?"
"Should I invest in mutual funds or fixed deposits?"
"What's the best way to pay off my loans?"
"Help me create a budget for buying a car"
```

## 📁 Project Structure

```
wealth-management-app/
├── public/                      # Static assets
├── src/
│   ├── components/              # Reusable React components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── ProtectedRoute.jsx  # Route protection HOC
│   ├── context/                 # React Context providers
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── pages/                   # Page components
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Registration page
│   │   ├── Onboarding.jsx      # User onboarding form
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Profile.jsx         # Profile management
│   │   └── Chat.jsx            # AI chatbot interface
│   ├── services/                # External service integrations
│   │   ├── firebase.js         # Firebase configuration
│   │   ├── firestoreService.js # Firestore database operations
│   │   └── geminiService.js    # Gemini AI integration
│   ├── styles/                  # CSS stylesheets
│   │   ├── index.css           # Global styles
│   │   ├── Auth.css            # Authentication pages
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── Profile.css         # Profile page styles
│   │   ├── Chat.css            # Chat interface styles
│   │   ├── Navbar.css          # Navigation styles
│   │   └── Onboarding.css      # Onboarding form styles
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Application entry point
├── .env                         # Environment variables (not in repo)
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML template
├── package.json                 # Project dependencies
├── vite.config.js              # Vite configuration
└── README.md                    # Project documentation
```

## 🔌 API Integration

### Firebase Firestore

**Data Structure:**
```javascript
users/{userId}/
  ├── name: string
  ├── email: string
  ├── income: number
  ├── expenses: number
  ├── emi: number
  ├── shortTermGoals: string
  ├── longTermGoals: string
  ├── createdAt: timestamp
  └── updatedAt: timestamp
```

### Gemini AI API

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

**Features:**
- Context injection with user financial data
- Conversation history management
- Temperature: 0.7 (balanced creativity)
- Max tokens: 1024

## 🔒 Security

### Authentication
- Firebase Authentication with email/password
- JWT-based session management
- Protected routes with automatic redirection

### Data Privacy
- User-specific data isolation via Firestore rules
- UID-based document access control
- Server-side timestamp for audit trails

### Environment Security
- API keys stored in environment variables
- `.env` file excluded from version control
- Production keys managed via Vercel

### Best Practices
- Input validation on all forms
- XSS protection via React's built-in escaping
- HTTPS-only in production
- Regular dependency updates

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Post-Deployment

1. **Update Firebase Authorized Domains**
   - Firebase Console → Authentication → Settings
   - Add your Vercel domain: `your-app.vercel.app`

2. **Test Production Build**
   - Create test account
   - Verify all features work
   - Check browser console for errors

 
 



## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Vite](https://vitejs.dev/)
- [Vercel](https://vercel.com/)

---

Made with ❤️ by [Your Name]

⭐ Star this repo if you found it helpful!
