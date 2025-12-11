import mongoose from 'mongoose'

const revisionSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
  version: { type: Number, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  status: { type: String },
  contentBlocks: { type: mongoose.Schema.Types.Mixed },
  settings: { type: mongoose.Schema.Types.Mixed },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changeNote: { type: String } // Optional note about what changed
}, {
  timestamps: true
})

// Indexes
revisionSchema.index({ pageId: 1, version: -1 })
revisionSchema.index({ createdAt: -1 })

const Revision = mongoose.models.Revision || mongoose.model('Revision', revisionSchema)

export default Revision

