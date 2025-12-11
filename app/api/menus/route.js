import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Menu from '@/models/Menu'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/menus - List all menus
export async function GET(request) {
  try {
    await connectDB()
    
    const menus = await Menu.find().sort({ createdAt: -1 }).lean()
    
    return NextResponse.json({
      success: true,
      data: menus
    })
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/menus - Create menu
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
    const { name, slug, items = [], location = 'header' } = body
    
    const menu = new Menu({
      name,
      slug,
      items,
      location
    })
    
    await menu.save()
    
    return NextResponse.json({
      success: true,
      data: menu
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

