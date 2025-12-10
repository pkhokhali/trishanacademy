# API Code Analysis - Where Admin Account is Created

## Code Flow Analysis

### Step 1: API Route (`app/api/admin/setup/route.js`)

```javascript
// Line 8: Connects to MongoDB
await connectDB()

// Line 13: Checks if admin exists
const existingAdmin = await Admin.findOne({ username })

// Line 26: Creates admin account
const admin = await Admin.create({
  username,
  password: hashedPassword
})
```

**Key Points:**
- Uses `Admin` model imported from `@/models/Admin`
- Calls `Admin.create()` which saves to MongoDB

---

### Step 2: MongoDB Connection (`lib/mongodb.js`)

```javascript
// Line 3: Gets connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI

// Line 25: Connects to MongoDB
cached.promise = mongoose.connect(MONGODB_URI, opts)
```

**Key Points:**
- Database name is **extracted from MONGODB_URI**
- Connection string format: `mongodb+srv://...@cluster.net/DATABASE_NAME?...`
- Currently: `mongodb+srv://...@pkhokhali.iaciobg.mongodb.net/pkhokhali?...`
- **Database: `pkhokhali`** (from connection string)

---

### Step 3: Admin Model (`models/Admin.js`)

```javascript
// Line 26: Creates Mongoose model
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)
```

**Key Points:**
- Model name: `'Admin'` (singular)
- Mongoose **automatically pluralizes** model names for collections
- `'Admin'` → Collection name: `'admins'` (lowercase, plural)
- Collection is created automatically when first document is saved

---

## Exact Location (From Code)

### Database
**Source:** `lib/mongodb.js` line 3
```javascript
const MONGODB_URI = process.env.MONGODB_URI
// Extracts database name from connection string
// Format: mongodb+srv://...@cluster.net/DATABASE_NAME?...
// Current: ...@pkhokhali.iaciobg.mongodb.net/pkhokhali?...
```
**Result:** Database = `pkhokhali`

### Collection
**Source:** `models/Admin.js` line 26
```javascript
mongoose.model('Admin', adminSchema)
// Mongoose pluralizes: 'Admin' → 'admins'
// Collection name is always lowercase and plural
```
**Result:** Collection = `admins`

### Document
**Source:** `app/api/admin/setup/route.js` line 26
```javascript
const admin = await Admin.create({
  username,
  password: hashedPassword
})
// Creates document in 'admins' collection
```
**Result:** Document with `username` and hashed `password`

---

## Complete Path (From Code)

```
1. API Route: app/api/admin/setup/route.js
   └── Calls: connectDB() from lib/mongodb.js
       └── Connects to: process.env.MONGODB_URI
           └── Database: pkhokhali (extracted from URI)

2. API Route: app/api/admin/setup/route.js
   └── Uses: Admin model from models/Admin.js
       └── Model name: 'Admin'
           └── Collection: 'admins' (auto-pluralized by Mongoose)

3. API Route: app/api/admin/setup/route.js
   └── Creates: Admin.create({ username, password })
       └── Saves to: Database 'pkhokhali', Collection 'admins'
```

---

## Final Answer (From Code Analysis)

**When you call:** `POST /api/admin/setup`

**Account is created in:**
- **Database:** `pkhokhali` (from `process.env.MONGODB_URI` in `lib/mongodb.js`)
- **Collection:** `admins` (auto-pluralized from model name `'Admin'` in `models/Admin.js`)
- **Document:** Created by `Admin.create()` in `app/api/admin/setup/route.js` line 26

**MongoDB Path:**
```
MongoDB Atlas
└── Cluster: pkhokhali
    └── Database: pkhokhali  ← From MONGODB_URI connection string
        └── Collection: admins  ← Auto-pluralized from model 'Admin'
            └── Document: { username: "admin", password: "hashed", ... }
```

---

## Code References

| Location | File | Line | What it does |
|----------|------|------|--------------|
| Database | `lib/mongodb.js` | 3 | Gets `MONGODB_URI` from env |
| Database | `lib/mongodb.js` | 25 | Connects using URI (extracts DB name) |
| Collection | `models/Admin.js` | 26 | Creates model 'Admin' → collection 'admins' |
| Document | `app/api/admin/setup/route.js` | 26 | Creates admin document |

---

## Verification

To verify in code:
1. Check `process.env.MONGODB_URI` in Vercel → Contains database name
2. Check `models/Admin.js` line 26 → Model name 'Admin' → Collection 'admins'
3. Check `app/api/admin/setup/route.js` line 26 → Creates document

**Current Configuration (from code):**
- Database: `pkhokhali` (from MONGODB_URI)
- Collection: `admins` (from model name 'Admin')
- Model: `Admin` (defined in models/Admin.js)

