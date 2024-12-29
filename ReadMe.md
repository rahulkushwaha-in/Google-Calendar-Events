# Google Calendar Event Manager

A full-stack web application that integrates with Google Calendar to manage events. Users can create, view, update, and delete events that sync between the application and their Google Calendar.

## Features

- 🔐 Google OAuth Authentication
- 📅 Two-way sync with Google Calendar
- ✨ Create, Read, Update, Delete (CRUD) events
- 🔄 Real-time updates
- 📱 Responsive design

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB
- Passport.js
- Google Calendar API

## Setup Instructions

1. Clone the repository
```bash
git clone [https://github.com/rahulkushwaha-in/Google-Calendar-Events]
cd project
```

2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```
3. Configure Environment Variables
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
PORT=3000
```
4. Run the Application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd ..
npm run dev
```
5. Open your web browser and navigate to `http://localhost:5173` to access the


## Prerequisites
Node.js 14+
MongoDB
Google Calendar API credentials
npm or yarn

## Google Calendar API Setup
Go to Google Cloud Console
Create a new project
Enable Google Calendar API
Configure OAuth consent screen
Create OAuth 2.0 credentials
Add authorized redirect URIs
```bash
http://localhost:3000/auth/google/callback
```

