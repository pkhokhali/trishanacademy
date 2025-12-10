# Environment Variables Guide

## Required Environment Variables

Your Next.js application requires the following environment variables:

### 1. `MONGODB_URI` (Required)
**Purpose:** MongoDB connection string for database access

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

**Your MongoDB Atlas Connection String:**
```
mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority
```

**Important Notes:**
- Database name: `pkhokhali`
- Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) for Vercel deployment
- The connection string should include the database name before the `?`

---

### 2. `JWT_SECRET` (Required)
**Purpose:** Secret key for signing and verifying JWT authentication tokens

**Format:** Any long, random string (minimum 32 characters recommended)

**Your JWT Secret:**
```
JWT_SECRET=THIS_is_my_school_project
```

⚠️ **Security Warning:** This secret is relatively short. For production, consider using a longer, more random secret (minimum 32 characters).

**How to Generate a Secure Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Or use an online generator
# https://randomkeygen.com/
```

**Security Notes:**
- ⚠️ **NEVER** commit this to version control
- Use a different secret for production vs development
- Make it at least 32 characters long
- Use a mix of letters, numbers, and special characters

---

## Setting Environment Variables

### For Local Development

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority
JWT_SECRET=THIS_is_my_school_project
```

**Note:** `.env.local` is automatically ignored by git (already in `.gitignore`)

---

### For Vercel Deployment

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your project: `trishanacademy`

2. **Navigate to Settings:**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Environment Variables:**
   
   **Variable 1:**
   - **Name:** `MONGODB_URI`
   - **Value:** `mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority`
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name:** `JWT_SECRET`
   - **Value:** `THIS_is_my_school_project`
   - **Environment:** Select all (Production, Preview, Development)

4. **Redeploy:**
   - After adding variables, go to **Deployments**
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

---

## Complete Environment Variables List

### Required Variables:
| Variable | Description | Value |
|----------|-------------|-------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret for JWT token signing | `THIS_is_my_school_project` |

### Optional Variables:
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` (auto-set by Next.js) |
| `PORT` | Server port | `3000` (auto-set by Next.js) |

---

## Verification

### Check if Variables are Set (Local):
```bash
# Check if .env.local exists
ls -la .env.local

# View variables (be careful - don't share secrets!)
cat .env.local
```

### Check if Variables are Set (Vercel):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both `MONGODB_URI` and `JWT_SECRET` are listed
3. Make sure they're enabled for the correct environments

---

## Troubleshooting

### Issue: "MONGODB_URI not found"
**Solution:** 
- Check that `.env.local` exists in the root directory
- Verify the variable name is exactly `MONGODB_URI` (case-sensitive)
- Restart your development server after adding variables

### Issue: "Invalid credentials" on login
**Solution:**
- Make sure `MONGODB_URI` is correctly set
- Verify the database name in the connection string
- Create the admin user using `/api/admin/setup` endpoint
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Issue: JWT token errors
**Solution:**
- Verify `JWT_SECRET` is set and is at least 32 characters
- Make sure the same secret is used across all environments
- Regenerate JWT_SECRET if compromised

---

## Security Best Practices

1. ✅ **Never commit `.env.local` to git** (already in `.gitignore`)
2. ✅ **Use different secrets for development and production**
3. ✅ **Rotate secrets periodically**
4. ✅ **Use strong, random secrets** (minimum 32 characters)
5. ✅ **Restrict MongoDB Atlas IP whitelist** in production (if possible)
6. ✅ **Use MongoDB Atlas database users** with limited permissions
7. ✅ **Enable MongoDB Atlas encryption** at rest and in transit

---

## Quick Setup Checklist

- [ ] Create `.env.local` file locally
- [ ] Add `MONGODB_URI` with your MongoDB Atlas connection string
- [ ] Add `JWT_SECRET` with value: `THIS_is_my_school_project`
- [ ] Add both variables to Vercel Environment Variables
- [ ] Redeploy on Vercel after adding variables
- [ ] Create admin user using `/api/admin/setup` endpoint
- [ ] Test login functionality

---

**Need Help?** Check the `ADMIN_SETUP.md` file for admin user creation instructions.

