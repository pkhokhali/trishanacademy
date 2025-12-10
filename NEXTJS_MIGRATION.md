# Next.js Migration Guide

This guide will help you migrate from Vite/React to Next.js for better Vercel deployment.

## Why Next.js?

- ✅ Built-in API routes (no separate Express server needed)
- ✅ Optimized for Vercel deployment
- ✅ Everything in one project
- ✅ Better SEO and performance
- ✅ Server-side rendering support

## Migration Steps

### Step 1: Backup Current Project
```bash
git add .
git commit -m "Backup before Next.js migration"
```

### Step 2: Install Next.js Dependencies
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install Next.js
npm install next@latest react@latest react-dom@latest
npm install mongoose bcryptjs jsonwebtoken multer axios lucide-react
npm install -D tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom @types/bcryptjs @types/jsonwebtoken @types/multer
```

### Step 3: Update package.json
Replace your current `package.json` with the Next.js version (see `package-nextjs.json`)

### Step 4: Create Next.js Structure

The project structure will change from:
```
src/
  pages/
  components/
  App.jsx
```

To:
```
app/
  page.jsx (Home)
  about/
    page.jsx
  programs/
    page.jsx
  contact/
    page.jsx
  login/
    page.jsx
  admin/
    page.jsx
  api/
    auth/
      login/
        route.js
    admin/
      settings/
        route.js
      upload/
        route.js
components/
  Navbar.jsx
  Footer.jsx
```

### Step 5: Update Configuration Files

1. **next.config.js** - Already created
2. **tailwind.config.js** - Update content paths
3. **postcss.config.js** - Keep as is
4. **vercel.json** - Update for Next.js

### Step 6: Convert Components

- Convert `src/App.jsx` routing to Next.js App Router
- Update imports (remove React Router)
- Convert API calls to use Next.js API routes

### Step 7: Convert API Routes

Express routes → Next.js API routes:
- `server/routes/auth.js` → `app/api/auth/login/route.js`
- `server/routes/admin.js` → `app/api/admin/settings/route.js`

## Quick Migration Script

I'll create all the necessary files for you. After migration:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Vercel Deployment

After migration, Vercel will:
- Auto-detect Next.js
- Deploy frontend and API routes together
- No separate backend deployment needed!

## Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

That's it! Everything works on Vercel.

