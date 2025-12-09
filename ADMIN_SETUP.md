# Admin Panel Setup Guide

## Overview
The admin panel allows you to manage all website content, navigation, social links, images, and Google Maps integration.

## Access
- **Login URL**: `/login` (not linked anywhere on the site - manual access only)
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
  
⚠️ **IMPORTANT**: Change the default password in production!

## Features

### 1. Content Management
- School name and tagline
- Hero section title and subtitle
- About page text
- Contact information (email, phone, address)

### 2. Navigation Management
- Add/remove navigation menu items
- Edit paths and labels
- Dynamic menu updates

### 3. Social Media Links
- Facebook URL
- Instagram URL
- YouTube URL
- LinkedIn URL

### 4. Image Management
- Upload logo
- Upload favicon
- Upload hero image
- All images are stored in `server/uploads/`

### 5. Google Maps Integration
- Add Google Maps embed URL
- Display address

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

**MongoDB Atlas Connection:**
If you're using MongoDB Atlas (cloud MongoDB), add the database name to your connection string before the query parameters (`?`).

**Your Connection String:**
```
mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/?retryWrites=true&w=majority
```

**Add Database Name:**
Insert the database name (`trishan-academy`) before the `?`:
```
mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority
```

**Using Existing MongoDB Connection:**
If you already have other databases in the same MongoDB Atlas cluster (like `clinic-management`), you can use the same connection string but with a different database name. MongoDB allows multiple databases in the same cluster.

**Example:**
- Your existing connection: `mongodb+srv://...mongodb.net/clinic-management?retryWrites=true&w=majority`
- For this project, use: `mongodb+srv://...mongodb.net/trishan-academy?retryWrites=true&w=majority`
- Same MongoDB cluster, different database name

### 3. MongoDB Setup
No need to install MongoDB locally - you're using MongoDB Atlas (cloud). Just make sure your connection string is correct in the `.env` file.

### 4. Run the Application

**Development (Frontend + Backend):**
```bash
npm run dev:full
```

**Or separately:**
- Frontend: `npm run dev` (runs on http://localhost:3000)
- Backend: `npm run server` (runs on http://localhost:5000)

### 5. Access Admin Panel
1. Navigate to `http://localhost:3000/login`
2. Login with default credentials
3. Start managing your content!

## Production Deployment

### For Vercel (Frontend)
The frontend can be deployed to Vercel as usual. The `vercel.json` is already configured.

**Setting Environment Variables in Vercel:**
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:
   - `MONGODB_URI`: `mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority`
   - `JWT_SECRET`: (generate a strong random string)
   - `NODE_ENV`: `production`

### For Backend
You'll need to deploy the backend separately to a service like:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS
- Vercel (as a serverless function - requires additional setup)

Make sure to:
1. Set environment variables in your hosting platform
2. Use your MongoDB Atlas connection string with the database name
3. Change JWT_SECRET to a strong random string
4. Update API URLs in the frontend if needed

## Security Notes
- Change default admin password immediately
- Use strong JWT_SECRET in production
- Enable HTTPS in production
- Consider adding rate limiting
- Add additional authentication methods if needed

## File Structure
```
school-website/
├── server/
│   ├── index.js          # Express server
│   ├── routes/
│   │   ├── auth.js      # Authentication routes
│   │   └── admin.js     # Admin routes
│   ├── models/
│   │   ├── Admin.js     # Admin user model
│   │   └── Settings.js   # Settings model
│   ├── middleware/
│   │   └── auth.js      # Authentication middleware
│   └── uploads/         # Uploaded images
└── src/
    └── pages/
        ├── Login.jsx    # Login page
        └── Admin.jsx    # Admin dashboard
```

