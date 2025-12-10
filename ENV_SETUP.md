# Environment Variables Setup

## How Environment Variables Work

Next.js automatically loads environment variables from `.env` files during build and runtime. The files are loaded in this order (later files override earlier ones):

1. `.env` - Default for all environments
2. `.env.local` - Local overrides (gitignored)
3. `.env.development` - Development environment
4. `.env.production` - Production environment

---

## Local Development Setup

### Step 1: Copy the Example File

```bash
# Copy the example file to create your local .env file
cp .env.example .env.local
```

Or manually create `.env.local` with:

```env
MONGODB_URI=mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority
JWT_SECRET=THIS_is_my_school_project
NODE_ENV=development
```

### Step 2: Verify

The `.env.local` file is automatically gitignored, so it won't be committed to the repository.

---

## Vercel Deployment Setup

**Important:** For Vercel deployments, environment variables must be set in the Vercel Dashboard, not in `.env` files.

### Setting Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `trishanacademy`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   **Variable 1:**
   - **Name:** `MONGODB_URI`
   - **Value:** `mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority`
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name:** `JWT_SECRET`
   - **Value:** `THIS_is_my_school_project`
   - **Environment:** Select all (Production, Preview, Development)

5. **Redeploy** your application after adding variables

---

## Environment Variables Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.net/db?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for JWT tokens | `THIS_is_my_school_project` |
| `NODE_ENV` | Node environment | `production` or `development` |

---

## How Next.js Loads Environment Variables

Next.js automatically:
- ✅ Loads `.env.local` during `npm run dev`
- ✅ Loads `.env.production` during `npm run build`
- ✅ Makes variables starting with `NEXT_PUBLIC_` available to the browser
- ✅ Makes other variables available only to server-side code (API routes, server components)

**Note:** Variables in `next.config.js` `env` section are exposed to both client and server.

---

## Security Notes

⚠️ **Never commit `.env.local` or `.env` files to git!**

- ✅ `.env.example` is safe to commit (contains no secrets)
- ✅ `.env.local` is automatically gitignored
- ✅ Use Vercel Dashboard for production secrets
- ✅ Rotate secrets periodically

---

## Troubleshooting

### Variables not loading?

1. **Check file name:** Must be exactly `.env.local` (not `.env.local.txt`)
2. **Restart dev server:** After creating/modifying `.env.local`, restart with `npm run dev`
3. **Check Vercel:** For production, verify variables are set in Vercel Dashboard
4. **Redeploy:** After adding Vercel variables, trigger a new deployment

### Variables not available in browser?

- Variables without `NEXT_PUBLIC_` prefix are server-only
- Use `NEXT_PUBLIC_` prefix for client-side variables (not recommended for secrets)
- Server-side variables work in API routes and server components

---

## Quick Start

**Local Development:**
```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Edit .env.local with your values (already done if you copied)

# 3. Start dev server
npm run dev
```

**Vercel Production:**
1. Set environment variables in Vercel Dashboard
2. Redeploy application
3. Variables are automatically available during build and runtime

---

**Ready to go!** 🚀

