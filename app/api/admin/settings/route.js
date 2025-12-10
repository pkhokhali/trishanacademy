import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'
import { authenticate } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = authenticate(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
      await settings.save()
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const user = authenticate(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const body = await request.json()

    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    if (body.content) settings.content = body.content
    if (body.navigation) settings.navigation = body.navigation
    if (body.socialLinks) settings.socialLinks = body.socialLinks
    if (body.images) settings.images = { ...settings.images, ...body.images }
    if (body.googleMaps) settings.googleMaps = body.googleMaps
    if (body.gallery) settings.gallery = body.gallery

    await settings.save()
    return NextResponse.json({ message: 'Settings updated successfully', settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

