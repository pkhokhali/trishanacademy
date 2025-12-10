import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  content: {
    schoolName: String,
    tagline: String,
    heroTitle: String,
    heroSubtitle: String,
    aboutText: String,
    contactEmail: String,
    contactPhone: String,
    address: String
  },
  navigation: [{
    path: String,
    label: String
  }],
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
  googleMaps: {
    embedUrl: String,
    address: String
  }
}, {
  timestamps: true
})

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema)

export default Settings

