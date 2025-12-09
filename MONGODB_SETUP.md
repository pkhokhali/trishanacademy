# MongoDB Atlas Setup for Trishan Academy

## Quick Setup

### Your MongoDB Atlas Connection String
```
mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/?retryWrites=true&w=majority
```

### Add Database Name
To use this connection with the Trishan Academy project, add the database name before the `?`:

**For `.env` file:**
```env
MONGODB_URI="mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority"
```

### Complete `.env` File
```env
MONGODB_URI="mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority"
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

## Important Notes

1. **Database Name**: The database `trishan-academy` will be created automatically when you first connect
2. **Multiple Databases**: You can have multiple databases in the same MongoDB Atlas cluster:
   - `clinic-management` (your existing database)
   - `trishan-academy` (new database for this project)
3. **Connection String Format**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database-name?options
   ```
4. **Security**: Keep your connection string secure and never commit it to version control

## Vercel Environment Variables

When deploying to Vercel, add these environment variables in your project settings:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `MONGODB_URI` (with database name included)
   - `JWT_SECRET` (strong random string)
   - `NODE_ENV` = `production`

## Testing Connection

After setting up, test the connection by running:
```bash
npm run server
```

You should see: `MongoDB connected successfully` and `Database: trishan-academy`

