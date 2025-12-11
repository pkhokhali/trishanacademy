import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Menu from '@/models/Menu'
import { verifyToken } from '@/lib/auth'

// GET /api/menus/:id - Get single menu
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    
    const menu = await Menu.findById(id).lean()
    
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: menu
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/menus/:id - Update menu
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
    const menu = await Menu.findByIdAndUpdate(id, body, { new: true })
    
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: menu
    })
  } catch (error) {
    console.error('Error updating menu:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/menus/:id - Delete menu
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
    
    const menu = await Menu.findByIdAndDelete(id)
    
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

