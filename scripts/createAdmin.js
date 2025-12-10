import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })
dotenv.config()

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

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

async function createAdmin() {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log('✅ Connected to MongoDB')

    const username = 'admin'
    const password = 'admin123'

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username })
    
    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('Username: ' + username)
      console.log('Password: (Already set)')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('\nTo reset password, delete the admin user and run this script again.')
      await mongoose.connection.close()
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await Admin.create({
      username,
      password: hashedPassword
    })

    console.log('\n✅ Admin user created successfully!')
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   ADMIN LOGIN CREDENTIALS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Username: ' + username)
    console.log('Password: ' + password)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n⚠️  IMPORTANT: Change this password after first login!')
    console.log('\n✅ Setup complete! You can now login at /login')
    
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    if (error.code === 11000) {
      console.log('\n⚠️  Admin user already exists with this username')
    }
    await mongoose.connection.close()
    process.exit(1)
  }
}

createAdmin()

