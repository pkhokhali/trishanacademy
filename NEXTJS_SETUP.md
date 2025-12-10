# Next.js Setup & Deployment Guide

## ✅ Migration Complete!

Your project has been successfully migrated to Next.js 14! Everything is now ready for Vercel deployment.

## 📁 Project Structure

```
school-website/
├── app/
│   ├── layout.jsx          # Root layout (Navbar + Footer)
│   ├── page.jsx            # Home page
│   ├── about/page.jsx      # About page
│   ├── programs/page.jsx   # Programs page
│   ├── contact/page.jsx    # Contact page
│   ├── login/
│   │   ├── layout.jsx      # Login layout (no Navbar/Footer)
│   │   └── page.jsx         # Login page
│   ├── admin/
│   │   ├── layout.jsx      # Admin layout (no Navbar/Footer)
│   │   └── page.jsx         # Admin dashboard
│   ├── api/
│   │   ├── auth/login/route.js
│   │   ├── admin/settings/route.js
│   │   ├── admin/upload/route.js
│   │   └── health/route.js
│   └── globals.css          # Global styles
├── components/
│   ├── Navbar.jsx          # Navigation component
│   └── Footer.jsx          # Footer component
├── lib/
│   ├── mongodb.js          # MongoDB connection
│   └── auth.js             # Authentication utilities
├── models/
│   ├── Admin.js            # Admin user model
│   └── Settings.js         # Settings model
├── public/
│   └── uploads/            # Uploaded images
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json           # Dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local` File
Create a `.env.local` file in the root directory:
```env
MONGODB_URI="mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority"
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Build for Production
```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Complete Next.js migration"
git push
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `pkhokhali/trishanacademy`
4. Vercel will auto-detect Next.js ✅

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables, add:

**Key:** `MONGODB_URI`  
**Value:** `mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority`

**Key:** `JWT_SECRET`  
**Value:** (generate a strong random string)

**Key:** `NODE_ENV`  
**Value:** `production`

### Step 4: Deploy!
Click **"Deploy"** and wait for the build to complete.

## ✨ What's Different?

### Before (Vite + Express):
- Frontend: `npm run dev` (port 3000)
- Backend: `npm run server` (port 5000)
- Two separate servers
- CORS configuration needed
- Separate deployments

### After (Next.js):
- Single server: `npm run dev` (port 3000)
- API routes built-in
- No CORS issues
- Single deployment to Vercel
- Serverless functions (auto-scaling)

## 🔐 Admin Access

- **URL:** `https://your-domain.vercel.app/login`
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change the default password in production!**

## 📝 Features

✅ All pages converted to Next.js  
✅ API routes working  
✅ Admin panel functional  
✅ Image uploads working  
✅ MongoDB integration  
✅ Authentication system  
✅ Ready for Vercel deployment  

## 🎉 You're All Set!

Your Next.js application is ready to deploy on Vercel. Everything will work seamlessly!

