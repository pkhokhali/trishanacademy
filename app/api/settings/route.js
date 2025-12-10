import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'

export async function GET() {
  try {
    await connectDB()
    
    let settings = await Settings.findOne()
    
    if (!settings) {
      // Return default settings if none exist
      return Response.json({
        content: {
          schoolName: 'Trishan Academy',
          tagline: 'Empowering Future Leaders',
          heroTitle: '',
          heroSubtitle: '',
          aboutText: '',
          contactEmail: '',
          contactPhone: '',
          address: ''
        },
        navigation: [],
        socialLinks: {},
        images: {},
        googleMaps: {},
        gallery: [],
        pageContent: {}
      })
    }

    return Response.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return Response.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

