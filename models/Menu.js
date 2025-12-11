import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['page', 'link', 'custom'],
    default: 'page'
  },
  label: { type: String, required: true },
  path: { type: String },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
  target: { type: String, default: '_self' }, // _self or _blank
  cssClass: { type: String },
  order: { type: Number, default: 0 },
  parentId: { type: String, default: null }, // For nested menus
  visible: { type: Boolean, default: true },
  visibleToRoles: [{ type: String }] // Show only to specific roles
}, { _id: false })

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  items: [menuItemSchema],
  location: { type: String, default: 'header' } // header, footer, sidebar
}, {
  timestamps: true
})

const Menu = mongoose.models.Menu || mongoose.model('Menu', menuSchema)

export default Menu

