import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'
import { authenticate } from '@/lib/auth'

export async function POST(request) {
  try {
    const user = authenticate(request)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image')
    const type = formData.get('type')

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${type}-${timestamp}-${file.name}`
    const filepath = join(uploadsDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    const imageUrl = `/uploads/${filename}`

    // Update settings with image URL
    await connectDB()
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    if (type && ['logo', 'favicon', 'heroImage'].includes(type)) {
      settings.images[type] = imageUrl
      await settings.save()
    }

    return NextResponse.json({ url: imageUrl, message: 'Image uploaded successfully' })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

