import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function POST(request) {
  try {
    const connection = await connectDB()
    const dbName = connection.connection.db.databaseName
    console.log(`📝 Creating admin in database: ${dbName}`)
    
    const { username = 'admin', password = 'admin123' } = await request.json()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username })
    
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists', username },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await Admin.create({
      username,
      password: hashedPassword
    })

    return NextResponse.json({
      message: 'Admin user created successfully',
      username: admin.username,
      database: dbName,
      collection: 'admins'
    })
  } catch (error) {
    console.error('Setup error:', error)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

