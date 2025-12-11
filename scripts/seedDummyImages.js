import connectDB from '../lib/mongodb.js'
import Media from '../models/Media.js'
import fs from 'fs'
import path from 'path'

const dummyImages = [
  {
    filename: 'school-hero.jpg',
    originalFilename: 'school-hero.jpg',
    url: '/dummy-images/school-hero.jpg',
    alt: 'School building exterior',
    caption: 'Our beautiful school campus',
    tags: ['hero', 'building', 'exterior'],
    isDummy: true
  },
  {
    filename: 'teacher-portrait.jpg',
    originalFilename: 'teacher-portrait.jpg',
    url: '/dummy-images/teacher-portrait.jpg',
    alt: 'Teacher in classroom',
    caption: 'Dedicated teacher helping students',
    tags: ['teacher', 'portrait', 'classroom'],
    isDummy: true
  },
  {
    filename: 'classroom.jpg',
    originalFilename: 'classroom.jpg',
    url: '/dummy-images/classroom.jpg',
    alt: 'Modern classroom',
    caption: 'State-of-the-art learning environment',
    tags: ['classroom', 'interior', 'learning'],
    isDummy: true
  },
  {
    filename: 'students-library.jpg',
    originalFilename: 'students-library.jpg',
    url: '/dummy-images/students-library.jpg',
    alt: 'Students in library',
    caption: 'Students studying in the library',
    tags: ['students', 'library', 'study'],
    isDummy: true
  },
  {
    filename: 'science-lab.jpg',
    originalFilename: 'science-lab.jpg',
    url: '/dummy-images/science-lab.jpg',
    alt: 'Science laboratory',
    caption: 'Fully equipped science laboratory',
    tags: ['science', 'lab', 'equipment'],
    isDummy: true
  },
  {
    filename: 'sports-field.jpg',
    originalFilename: 'sports-field.jpg',
    url: '/dummy-images/sports-field.jpg',
    alt: 'Sports field',
    caption: 'Athletic facilities for students',
    tags: ['sports', 'field', 'athletics'],
    isDummy: true
  }
]

async function seedDummyImages() {
  try {
    await connectDB()
    console.log('Connected to database')
    
    // Check if dummy images already exist
    const existing = await Media.findOne({ isDummy: true })
    if (existing) {
      console.log('Dummy images already exist. Skipping...')
      return
    }
    
    // Create dummy image entries
    for (const img of dummyImages) {
      const media = new Media({
        ...img,
        mimeType: 'image/jpeg',
        size: 0, // Placeholder
        width: 1920,
        height: 1080
      })
      await media.save()
      console.log(`Created dummy image: ${img.filename}`)
    }
    
    console.log('✅ Dummy images seeded successfully!')
    console.log('Note: You need to add actual image files to public/dummy-images/ directory')
  } catch (error) {
    console.error('Error seeding dummy images:', error)
  } finally {
    process.exit(0)
  }
}

seedDummyImages()

