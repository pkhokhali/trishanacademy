import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'

export async function GET() {
  try {
    await connectDB()
    
    const settings = await Settings.findOne()
    
    if (!settings || !settings.gallery) {
      return NextResponse.json({ items: [] })
    }

    return NextResponse.json({ items: settings.gallery })
  } catch (error) {
    console.error('Gallery error:', error)
    return NextResponse.json(
      { message: 'Server error', items: [] },
      { status: 500 }
    )
  }
}

