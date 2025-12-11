import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Theme from '@/models/Theme'
import { verifyToken } from '@/lib/auth'

// GET /api/themes - List all themes
export async function GET(request) {
  try {
    await connectDB()
    
    const themes = await Theme.find().sort({ isDefault: -1, createdAt: -1 }).lean()
    
    return NextResponse.json({
      success: true,
      data: themes
    })
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/themes - Create theme
export async function POST(request) {
  try {
    await connectDB()
    
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const theme = new Theme(body)
    
    await theme.save()
    
    return NextResponse.json({
      success: true,
      data: theme
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

