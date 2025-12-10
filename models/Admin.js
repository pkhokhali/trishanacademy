import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

// Create default admin if it doesn't exist
if (typeof window === 'undefined') {
  Admin.findOne({ username: 'admin' }).then(async (admin) => {
    if (!admin) {
      const defaultAdmin = new Admin({
        username: 'admin',
        password: 'admin123' // Change this in production!
      })
      await defaultAdmin.save()
      console.log('Default admin created: username: admin, password: admin123')
    }
  }).catch(err => console.error('Error creating default admin:', err))
}

export default Admin

