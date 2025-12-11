import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Page from '@/models/Page'
import Revision from '@/models/Revision'
import { verifyToken } from '@/lib/auth'
import { checkPermission, canPublish } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

// GET /api/pages - List all pages
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')
    
    const query = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ]
    }
    
    const pages = await Page.find(query)
      .populate('createdBy', 'username fullName')
      .populate('updatedBy', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
    
    const total = await Page.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: pages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/pages - Create new page
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
    const { title, slug, status = 'draft', contentBlocks = [], ...rest } = body
    
    // Check create permission
    const createPermission = await checkPermission(decoded.userId, 'create:page')
    if (!createPermission.allowed) {
      return NextResponse.json(
        { success: false, error: createPermission.reason || 'Permission denied' },
        { status: 403 }
      )
    }
    
    // Check publish permission if status is published
    if (status === 'published') {
      const publishAllowed = await canPublish(decoded.userId)
      if (!publishAllowed) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to publish pages. Status set to draft.' },
          { status: 403 }
        )
      }
    }
    
    // Check if slug exists
    const existing = await Page.findOne({ slug })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Page with this slug already exists' },
        { status: 400 }
      )
    }
    
    const page = new Page({
      title,
      slug,
      status,
      contentBlocks,
      createdBy: decoded.userId,
      updatedBy: decoded.userId,
      ...rest
    })
    
    await page.save()
    
    // Create initial revision
    const revision = new Revision({
      pageId: page._id,
      version: 1,
      title: page.title,
      slug: page.slug,
      status: page.status,
      contentBlocks: page.contentBlocks,
      settings: page.settings,
      meta: page.meta,
      createdBy: decoded.userId,
      changeNote: 'Initial version'
    })
    await revision.save()
    
    return NextResponse.json({
      success: true,
      data: page
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

