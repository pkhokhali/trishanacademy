import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Revision from '@/models/Revision'
import Page from '@/models/Page'

// GET /api/pages/:id/revisions - Get all revisions for a page
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    
    const revisions = await Revision.find({ pageId: id })
      .populate('createdBy', 'username fullName')
      .sort({ version: -1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: revisions
    })
  } catch (error) {
    console.error('Error fetching revisions:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/pages/:id/revisions/restore - Restore a revision
export async function POST(request, { params }) {
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
    
    const body = await request.json()
    const { revisionId } = body
    
    const revision = await Revision.findById(revisionId)
    if (!revision || revision.pageId.toString() !== id) {
      return NextResponse.json(
        { success: false, error: 'Revision not found' },
        { status: 404 }
      )
    }
    
    const page = await Page.findById(id)
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Restore from revision
    page.title = revision.title
    page.slug = revision.slug
    page.status = revision.status
    page.contentBlocks = revision.contentBlocks
    page.settings = revision.settings
    page.meta = revision.meta
    page.version = (page.version || 1) + 1
    
    await page.save()
    
    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error restoring revision:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

