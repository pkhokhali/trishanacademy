import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

// Extract database name from connection string or use default
function getDatabaseName() {
  // If connection string includes database name, extract it
  const match = MONGODB_URI.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)
  if (match && match[1]) {
    return match[1]
  }
  // Default to 'pkhokhali' if not specified in connection string
  return 'pkhokhali'
}

const DATABASE_NAME = getDatabaseName()

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DATABASE_NAME, // Explicitly set database name
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`✅ Connected to MongoDB database: ${DATABASE_NAME}`)
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error(`❌ MongoDB connection error for database: ${DATABASE_NAME}`, e)
    throw e
  }

  return cached.conn
}

export default connectDB

