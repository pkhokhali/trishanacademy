import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Page from '@/models/Page'
import Revision from '@/models/Revision'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { checkPermission, canPublish } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

// GET /api/pages/:id - Get single page
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    
    const page = await Page.findById(id)
      .populate('createdBy', 'username fullName')
      .populate('updatedBy', 'username fullName')
      .lean()
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/pages/:id - Update page
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
    const page = await Page.findById(id).populate('permissions.users')
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Check edit permission
    const editPermission = await checkPermission(decoded.userId, 'edit:page', page)
    if (!editPermission.allowed) {
      return NextResponse.json(
        { success: false, error: editPermission.reason || 'Permission denied' },
        { status: 403 }
      )
    }
    
    // Check publish permission if status is being changed to published
    if (body.status === 'published' && page.status !== 'published') {
      const publishAllowed = await canPublish(decoded.userId, page)
      if (!publishAllowed) {
        return NextResponse.json(
          { success: false, error: 'You do not have permission to publish pages' },
          { status: 403 }
        )
      }
    }
    
    // Save current version as revision
    const currentVersion = page.version || 1
    const revision = new Revision({
      pageId: page._id,
      version: currentVersion,
      title: page.title,
      slug: page.slug,
      status: page.status,
      contentBlocks: page.contentBlocks,
      settings: page.settings,
      meta: page.meta,
      createdBy: decoded.userId,
      changeNote: body.changeNote || 'Updated'
    })
    await revision.save()
    
    // Update page
    Object.assign(page, body)
    page.updatedBy = decoded.userId
    page.version = currentVersion + 1
    
    // Handle scheduled publishing
    if (body.status === 'scheduled' && body.scheduledAt) {
      page.scheduledAt = new Date(body.scheduledAt)
    } else if (body.status === 'published') {
      page.publishedAt = new Date()
      page.scheduledAt = null
    }
    
    await page.save()
    
    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/pages/:id - Delete page
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
    
    // Check delete permission
    const deletePermission = await checkPermission(decoded.userId, 'delete:page')
    if (!deletePermission.allowed) {
      return NextResponse.json(
        { success: false, error: deletePermission.reason || 'Permission denied' },
        { status: 403 }
      )
    }
    
    const page = await Page.findByIdAndDelete(id)
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Delete all revisions
    await Revision.deleteMany({ pageId: id })
    
    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

