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
  timestamps: true,
  bufferCommands: false
})

// Hash password before saving (only if it's a new password or modified)
adminSchema.pre('save', async function(next) {
  // Only hash if password is modified and not already hashed
  if (!this.isModified('password')) return next()
  
  // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
  if (this.password.startsWith('$2')) {
    return next() // Already hashed, skip
  }
  
  // Hash the plain password
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

export default Admin

