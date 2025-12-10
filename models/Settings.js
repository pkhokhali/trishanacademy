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
      hero: {
        title: String,
        subtitle: String,
        backgroundImage: String,
        backgroundColor: String,
        backgroundGradient: String,
        badgeText: String
      },
      stats: {
        sectionTitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          number: String,
          label: String,
          iconColor: String
        }]
      },
      features: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          title: String,
          description: String,
          icon: String
        }]
      },
      programs: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          title: String,
          description: String,
          icon: String
        }]
      },
      testimonials: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          name: String,
          role: String,
          text: String,
          initials: String
        }]
      },
      cta: {
        title: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        buttonText: String
      }
    },
    about: {
      hero: {
        title: String,
        subtitle: String,
        backgroundImage: String,
        backgroundColor: String,
        backgroundGradient: String
      },
      mission: {
        title: String,
        content: String,
        backgroundColor: String,
        backgroundImage: String
      },
      vision: {
        title: String,
        content: String,
        backgroundColor: String,
        backgroundImage: String
      },
      history: {
        sectionTitle: String,
        content: String,
        backgroundColor: String,
        backgroundImage: String
      },
      values: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          title: String,
          description: String,
          icon: String
        }]
      },
      achievements: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          number: String,
          label: String
        }]
      }
    },
    programs: {
      hero: {
        title: String,
        subtitle: String,
        backgroundImage: String,
        backgroundColor: String,
        backgroundGradient: String
      },
      academic: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          title: String,
          grade: String,
          description: String,
          features: [String],
          icon: String
        }]
      },
      extracurricular: {
        sectionTitle: String,
        subtitle: String,
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          title: String,
          description: String,
          icon: String
        }]
      }
    },
    contact: {
      hero: {
        title: String,
        subtitle: String,
        backgroundImage: String,
        backgroundColor: String,
        backgroundGradient: String
      },
      form: {
        title: String,
        backgroundColor: String,
        backgroundImage: String
      },
      info: {
        backgroundColor: String,
        backgroundImage: String,
        address: String,
        phone: String,
        email: String,
        officeHours: String
      },
      map: {
        backgroundColor: String,
        backgroundImage: String
      }
    },
    gallery: {
      hero: {
        title: String,
        subtitle: String,
        backgroundImage: String,
        backgroundColor: String,
        backgroundGradient: String
      },
      filter: {
        backgroundColor: String
      },
      stats: {
        backgroundColor: String,
        backgroundImage: String,
        items: [{
          number: String,
          label: String
        }]
      }
    }
  }
}, {
  timestamps: true
})

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema)

export default Settings

