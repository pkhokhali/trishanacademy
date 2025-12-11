import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'admin'

    // Check if admin exists
    const admin = await Admin.findOne({ username })
    
    if (!admin) {
      return NextResponse.json({
        exists: false,
        message: `Admin user '${username}' does not exist. Create it using POST /api/admin/setup`,
        username
      })
    }

    return NextResponse.json({
      exists: true,
      username: admin.username,
      createdAt: admin.createdAt,
      message: 'Admin user exists'
    })
  } catch (error) {
    console.error('Check admin error:', error)
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

