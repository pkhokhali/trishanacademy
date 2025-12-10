# Where Admin Account is Created

## When you trigger: `POST https://trishanacademy.edu.np/api/admin/setup`

The admin account will be created in the following location:

---

## MongoDB Location

### Cluster
- **Cluster Name:** `pkhokhali`
- **Provider:** MongoDB Atlas

### Database
- **Database Name:** `pkhokhali`
- **Source:** Extracted from your `MONGODB_URI` environment variable

**Your Connection String:**
```
mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/pkhokhali?retryWrites=true&w=majority
                                                                    ^^^^^^^^^^^^
                                                                    Database Name
```

### Collection
- **Collection Name:** `admins` (automatically pluralized by Mongoose from model name `Admin`)

---

## Full Path

```
MongoDB Atlas
└── Cluster: pkhokhali
    └── Database: pkhokhali
        └── Collection: admins
            └── Document: { username: "admin", password: "hashed_password", ... }
```

---

## How to Verify

### Option 1: MongoDB Atlas Dashboard

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster: `pkhokhali`
3. Click **"Browse Collections"**
4. Select database: `pkhokhali`
5. Open collection: `admins`
6. You should see the admin document with:
   ```json
   {
     "_id": "...",
     "username": "admin",
     "password": "$2a$10$...",  // Hashed password
     "createdAt": "2025-12-10T...",
     "updatedAt": "2025-12-10T..."
   }
   ```

### Option 2: Check API Response

After calling `/api/admin/setup`, you'll get:
```json
{
  "message": "Admin user created successfully",
  "username": "admin"
}
```

---

## Important Notes

1. **Database is determined by MONGODB_URI:**
   - The database name comes from your `MONGODB_URI` environment variable
   - Currently set to: `pkhokhali`
   - If you change the database name in the connection string, the admin will be created in the new database

2. **Collection is automatic:**
   - Mongoose automatically creates the `admins` collection (pluralized from model name `Admin`)
   - No need to create it manually

3. **Password is hashed:**
   - The password is automatically hashed using bcrypt before saving
   - You'll never see the plain password in the database

4. **Environment Variable:**
   - The location depends on `MONGODB_URI` set in Vercel Dashboard
   - Make sure it points to the correct database

---

## Current Configuration

Based on your setup:

| Item | Value |
|------|-------|
| **Cluster** | `pkhokhali` |
| **Database** | `pkhokhali` |
| **Collection** | `admins` |
| **Model Name** | `Admin` |
| **Username** | `admin` |
| **Password** | `admin123` (hashed in database) |

---

## Troubleshooting

### Admin not appearing in database?

1. **Check MONGODB_URI in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `MONGODB_URI` has the correct database name

2. **Check MongoDB Atlas:**
   - Verify you're looking at the correct database
   - Check if the collection `admins` exists
   - Refresh the collections view

3. **Check API response:**
   - If you get "Admin user already exists", check the `admins` collection
   - The admin might already be there

---

## Summary

✅ **When you call `/api/admin/setup`:**
- Account is created in: **MongoDB Atlas**
- Cluster: **pkhokhali**
- Database: **pkhokhali** (from your MONGODB_URI)
- Collection: **admins** (auto-created by Mongoose)
- Document: Admin user with hashed password

The exact location is determined by your `MONGODB_URI` environment variable set in Vercel!

