import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function POST(request) {
  try {
    const connection = await connectDB()
    const dbName = connection.connection.db.databaseName
    console.log(`🔑 Resetting password in database: ${dbName}`)
    
    const { username = 'admin', password = 'admin123' } = await request.json()

    // Find existing admin
    const existingAdmin = await Admin.findOne({ username })
    
    if (!existingAdmin) {
      return NextResponse.json(
        { message: `Admin user '${username}' does not exist. Use /api/admin/setup to create it.` },
        { status: 404 }
      )
    }

    // Update password - pre-save hook will hash it automatically
    existingAdmin.password = password // Pass plain password, model will hash it
    await existingAdmin.save()

    return NextResponse.json({
      message: 'Admin password reset successfully',
      username: existingAdmin.username,
      database: dbName,
      collection: 'admins'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

