import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticate } from '../middleware/auth.js'
import Settings from '../models/Settings.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Get settings
router.get('/settings', authenticate, async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
      await settings.save()
    }
    res.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update settings
router.post('/settings', authenticate, async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    if (req.body.content) settings.content = req.body.content
    if (req.body.navigation) settings.navigation = req.body.navigation
    if (req.body.socialLinks) settings.socialLinks = req.body.socialLinks
    if (req.body.images) settings.images = { ...settings.images, ...req.body.images }
    if (req.body.googleMaps) settings.googleMaps = req.body.googleMaps

    await settings.save()
    res.json({ message: 'Settings updated successfully', settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Upload image
router.post('/upload', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    
    // Update settings with image URL
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    const imageType = req.body.type
    if (imageType && ['logo', 'favicon', 'heroImage'].includes(imageType)) {
      settings.images[imageType] = imageUrl
      await settings.save()
    }

    res.json({ url: imageUrl, message: 'Image uploaded successfully' })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

