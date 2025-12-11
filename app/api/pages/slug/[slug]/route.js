import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Page from '@/models/Page'

export const dynamic = 'force-dynamic'

// GET /api/pages/slug/:slug - Get page by slug (public)
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { slug } = params
    
    const page = await Page.findOne({ 
      slug,
      status: { $in: ['published', 'scheduled'] }
    }).lean()
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Check if scheduled page should be visible
    if (page.status === 'scheduled' && page.scheduledAt) {
      const now = new Date()
      if (new Date(page.scheduledAt) > now) {
        return NextResponse.json(
          { success: false, error: 'Page not yet published' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

