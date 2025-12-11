import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Theme from '@/models/Theme'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/themes/:id - Get single theme
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    
    const theme = await Theme.findById(id).lean()
    
    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: theme
    })
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/themes/:id - Update theme
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    
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
    const theme = await Theme.findByIdAndUpdate(id, body, { new: true })
    
    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: theme
    })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/themes/:id - Delete theme
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    
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
    
    const theme = await Theme.findById(id)
    if (theme?.isDefault) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete default theme' },
        { status: 400 }
      )
    }
    
    await Theme.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting theme:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

