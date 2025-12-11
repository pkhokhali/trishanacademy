import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Media from '@/models/Media'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// GET /api/media - List all media
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    
    const query = {}
    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { originalFilename: { $regex: search, $options: 'i' } },
        { alt: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } }
      ]
    }
    if (tags && tags.length > 0) {
      query.tags = { $in: tags }
    }
    
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()
    
    const total = await Media.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: media,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/media - Upload media
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
    
    const formData = await request.formData()
    const files = formData.getAll('files')
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    
    const uploadedFiles = []
    
    for (const file of files) {
      if (!file || typeof file === 'string') continue
      
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const ext = path.extname(file.name)
      const filename = `${crypto.randomUUID()}${ext}`
      const filepath = path.join(uploadDir, filename)
      
      await writeFile(filepath, buffer)
      
      // Get image dimensions if it's an image
      let width, height
      if (file.type.startsWith('image/')) {
        const sharp = await import('sharp')
        const metadata = await sharp.default(buffer).metadata()
        width = metadata.width
        height = metadata.height
      }
      
      const media = new Media({
        filename,
        originalFilename: file.name,
        url: `/uploads/${filename}`,
        mimeType: file.type,
        size: buffer.length,
        width,
        height,
        uploadedBy: decoded.userId
      })
      
      await media.save()
      uploadedFiles.push(media)
    }
    
    return NextResponse.json({
      success: true,
      data: uploadedFiles.length === 1 ? uploadedFiles[0] : uploadedFiles
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

