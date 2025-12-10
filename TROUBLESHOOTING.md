# Troubleshooting Guide

## Login Not Working / No Response

### 1. Check if Backend Server is Running

The backend server must be running for the login to work. 

**Check:**
```bash
# In a terminal, run:
npm run server
```

You should see:
```
MongoDB connected successfully
Database: trishan-academy
Server running on port 5000
API available at http://localhost:5000/api
```

### 2. Verify Backend is Accessible

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"Server is running"}
```

If you get an error, the backend is not running.

### 3. Check Environment Variables

Make sure you have a `.env` file in the root directory with:
```env
MONGODB_URI="mongodb+srv://Vercel-Admin-pkhokhali:ciRg6aLDUjm3b8uu@pkhokhali.iaciobg.mongodb.net/trishan-academy?retryWrites=true&w=majority"
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### 4. Check MongoDB Connection

The server needs to connect to MongoDB before it starts. Check the console for:
- ✅ `MongoDB connected successfully` - Good!
- ❌ `MongoDB connection error` - Check your connection string

### 5. Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors:
- Network errors (CORS, connection refused)
- API errors
- JavaScript errors

### 6. Common Issues

**Issue: "Cannot connect to server"**
- **Solution**: Make sure backend server is running (`npm run server`)

**Issue: "Network Error"**
- **Solution**: Check if port 5000 is available and not blocked by firewall

**Issue: "Invalid credentials"**
- **Solution**: Default credentials are:
  - Username: `admin`
  - Password: `admin123`

**Issue: MongoDB connection error**
- **Solution**: 
  1. Check your MongoDB Atlas connection string
  2. Make sure the database name is included: `/trishan-academy`
  3. Verify your MongoDB Atlas cluster is running
  4. Check if your IP is whitelisted in MongoDB Atlas

### 7. Running Both Frontend and Backend

**Option 1: Run separately (recommended for debugging)**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

**Option 2: Run together**
```bash
npm run dev:full
```

### 8. Test Login Endpoint Directly

You can test the login API directly using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 9. Check Default Admin User

The default admin user is created automatically on first server start. If it's not working:

1. Check MongoDB Atlas dashboard
2. Look for `trishan-academy` database
3. Check `admins` collection
4. Verify a user with username `admin` exists

### 10. Reset Admin Password (if needed)

If you need to reset the admin password, you can:
1. Delete the admin user from MongoDB
2. Restart the server (it will create a new default admin)
3. Or manually create one using MongoDB Compass

## Still Having Issues?

1. Check all console logs (both browser and server)
2. Verify all dependencies are installed: `npm install`
3. Make sure Node.js version is compatible (v16+)
4. Check if ports 3000 and 5000 are available

