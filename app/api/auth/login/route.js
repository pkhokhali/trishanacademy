import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function POST(request) {
  try {
    await connectDB()
    
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Find admin user
    const admin = await Admin.findOne({ username })
    if (!admin) {
      console.log(`Login attempt failed: Admin user '${username}' not found`)
      return NextResponse.json(
        { message: 'Invalid credentials. Admin user does not exist. Please create admin user first using /api/admin/setup' },
        { status: 401 }
      )
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      console.log(`Login attempt failed: Incorrect password for user '${username}'`)
      return NextResponse.json(
        { message: 'Invalid credentials. Incorrect password.' },
        { status: 401 }
      )
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token, message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

