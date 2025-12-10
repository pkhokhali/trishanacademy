# MongoDB Database Structure

## Current Setup

Based on your MongoDB Atlas cluster:

### Cluster Information
- **Cluster Name:** `pkhokhali`
- **Database Name:** `pkhokhali`
- **Collection:** `admins`

---

## Required Database Structure

### Current Database: `pkhokhali`

Your connection string should be:

```
mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority
```

**Collections:**
- `admins` - Admin users (username, password)
- `settings` - Website settings (content, navigation, social links, images, maps)

---

## Database Collections

### 1. `admins` Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  password: String (required, hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**
```json
{
  "_id": "...",
  "username": "admin",
  "password": "$2a$10$hashedpassword...",
  "createdAt": "2025-12-10T...",
  "updatedAt": "2025-12-10T..."
}
```

---

### 2. `settings` Collection

**Schema:**
```javascript
{
  _id: ObjectId,
  content: {
    schoolName: String,
    tagline: String,
    heroTitle: String,
    heroSubtitle: String,
    aboutText: String,
    contactEmail: String,
    contactPhone: String,
    contactAddress: String
  },
  navigation: [
    {
      label: String,
      path: String
    }
  ],
  socialLinks: {
    facebook: String,
    instagram: String,
    youtube: String,
    linkedin: String
  },
  images: {
    logo: String,
    favicon: String,
    heroImage: String
  },
  maps: {
    embedUrl: String,
    address: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Fixing the Current Issue

Since the admin exists but login fails, the issue is likely:

1. **Database Mismatch:** The connection string points to a different database than where the admin was created
2. **Password Not Hashed:** The password in the database might not be properly hashed

### Solution: Reset Admin Password

Use the reset endpoint to update the password:

**Request:**
```bash
POST https://trishanacademy.edu.np/api/admin/reset
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Or in browser console:
```javascript
fetch('https://trishanacademy.edu.np/api/admin/reset', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err))
```

---

## Verify Database Connection

### Check Current Database

1. Go to MongoDB Atlas Dashboard
2. Click on your cluster `pkhokhali`
3. Click "Browse Collections"
4. Check which database contains the `admins` collection:
   - If it's in `test` → Update connection string to use `test`
   - If it's in `trishan-academy` → Keep current connection string

### Update Connection String in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `MONGODB_URI`:
   ```
   mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority
   ```
3. Redeploy the application

---

## Quick Fix Steps

1. **Check which database has the admin:**
   - Go to MongoDB Atlas → Browse Collections
   - Find which database contains `admins` collection

2. **Update MONGODB_URI in Vercel:**
   - Match the database name in the connection string

3. **Reset admin password:**
   ```bash
   POST /api/admin/reset
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

4. **Try login again:**
   - Username: `admin`
   - Password: `admin123`

---

## Current Database Structure

**Database:** `pkhokhali`

**Collections:**
- `admins` - Admin authentication
- `settings` - Website content and configuration

This is your production database structure.

