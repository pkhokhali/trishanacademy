import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalFilename: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true }, // in bytes
  width: { type: Number },
  height: { type: Number },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  tags: [{ type: String }],
  isDummy: { type: Boolean, default: false }, // Flag for dummy images
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

// Indexes
mediaSchema.index({ tags: 1 })
mediaSchema.index({ filename: 1 })
mediaSchema.index({ isDummy: 1 })

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema)

export default Media

