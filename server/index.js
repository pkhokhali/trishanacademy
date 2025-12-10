import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// MongoDB Connection
// MongoDB Atlas connection string format:
// mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
// For existing connection, just add the database name before the query parameters
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trishan-academy'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
    console.log(`Database: ${mongoose.connection.name}`)
  })
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000

// Start server only after MongoDB connection is established
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API available at http://localhost:${PORT}/api`)
  })
})

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
  console.log('Server will not start until MongoDB is connected')
})

