import mongoose from 'mongoose'

const themeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  isDefault: { type: Boolean, default: false },
  colors: {
    primary: { type: String, default: '#3B82F6' },
    secondary: { type: String, default: '#8B5CF6' },
    accent: { type: String, default: '#10B981' },
    neutral: { type: String, default: '#6B7280' },
    background: { type: String, default: '#FFFFFF' },
    text: { type: String, default: '#111827' }
  },
  fonts: {
    heading: { type: String, default: 'Inter' },
    body: { type: String, default: 'Inter' }
  },
  spacing: {
    base: { type: Number, default: 8 }
  },
  layout: {
    containerWidth: { type: String, default: '1280px' },
    headerHeight: { type: String, default: '80px' },
    footerHeight: { type: String, default: '200px' }
  },
  logo: { type: String },
  favicon: { type: String }
}, {
  timestamps: true
})

// Ensure only one default theme
themeSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await mongoose.model('Theme').updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false }
    )
  }
  next()
})

const Theme = mongoose.models.Theme || mongoose.model('Theme', themeSchema)

export default Theme

