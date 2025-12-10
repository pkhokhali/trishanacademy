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
  },
  gallery: [{
    title: String,
    description: String,
    category: String,
    image: String
  }],
  pageContent: {
    home: {
      heroTitle: String,
      heroSubtitle: String,
      features: [{
        title: String,
        description: String
      }],
      stats: [{
        number: String,
        label: String
      }],
      programs: [{
        title: String,
        description: String
      }],
      testimonials: [{
        name: String,
        role: String,
        text: String
      }]
    },
    about: {
      heroTitle: String,
      heroSubtitle: String,
      mission: String,
      vision: String,
      history: String,
      values: [{
        title: String,
        description: String
      }],
      achievements: [{
        number: String,
        label: String
      }]
    },
    programs: {
      heroTitle: String,
      heroSubtitle: String,
      academicPrograms: [{
        title: String,
        grade: String,
        description: String,
        features: [String]
      }],
      extracurricularPrograms: [{
        title: String,
        description: String
      }]
    },
    contact: {
      heroTitle: String,
      heroSubtitle: String,
      address: String,
      phone: String,
      email: String,
      officeHours: String
    },
    gallery: {
      heroTitle: String,
      heroSubtitle: String
    }
  }
}, {
  timestamps: true
})

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema)

export default Settings

