import mongoose from 'mongoose'

const contentBlockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['richtext', 'image', 'gallery', 'carousel', 'hero', 'form', 'html', 'button', 'spacer', 'columns', 'video', 'background-image']
  },
  props: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 }
}, { _id: false })

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft'
  },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
  menuGroup: { type: String, default: 'main' },
  menuTitle: { type: String }, // Override title in menu
  menuOrder: { type: Number, default: 0 },
  template: { type: String, default: 'default' },
  
  // SEO
  meta: {
    title: { type: String },
    description: { type: String },
    canonical: { type: String },
    robots: {
      index: { type: Boolean, default: true },
      follow: { type: Boolean, default: true }
    },
    ogImage: { type: String }
  },
  
  // Theme & Layout
  settings: {
    layout: { type: String, default: 'default' },
    theme: { type: String, default: 'default' },
    colors: {
      primary: { type: String },
      secondary: { type: String },
      background: { type: String }
    },
    fonts: {
      heading: { type: String },
      body: { type: String }
    },
    showHeader: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    backgroundImage: { type: String }
  },
  
  // Content blocks
  contentBlocks: [contentBlockSchema],
  
  // Publishing
  publishedAt: { type: Date },
  scheduledAt: { type: Date },
  
  // Permissions
  permissions: {
    roles: [{ type: String }], // Roles that can edit
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Specific users
  },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
})

// Indexes
pageSchema.index({ slug: 1 })
pageSchema.index({ status: 1 })
pageSchema.index({ parentId: 1 })
pageSchema.index({ menuGroup: 1, menuOrder: 1 })

const Page = mongoose.models.Page || mongoose.model('Page', pageSchema)

export default Page

