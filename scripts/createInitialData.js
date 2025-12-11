import connectDB from '../lib/mongodb.js'
import Page from '../models/Page.js'
import Menu from '../models/Menu.js'
import Theme from '../models/Theme.js'
import User from '../models/User.js'

async function createInitialData() {
  try {
    await connectDB()
    console.log('Connected to database')
    
    // Create default theme
    const existingTheme = await Theme.findOne({ isDefault: true })
    if (!existingTheme) {
      const theme = new Theme({
        name: 'Default Theme',
        slug: 'default',
        isDefault: true,
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#10B981',
          neutral: '#6B7280',
          background: '#FFFFFF',
          text: '#111827'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      })
      await theme.save()
      console.log('✅ Created default theme')
    }
    
    // Create main menu
    const existingMenu = await Menu.findOne({ slug: 'main' })
    if (!existingMenu) {
      const menu = new Menu({
        name: 'Main Menu',
        slug: 'main',
        location: 'header',
        items: []
      })
      await menu.save()
      console.log('✅ Created main menu')
    }
    
    // Create sample home page
    const existingHome = await Page.findOne({ slug: 'home' })
    if (!existingHome) {
      const homePage = new Page({
        title: 'Home',
        slug: 'home',
        status: 'published',
        menuTitle: 'Home',
        menuOrder: 0,
        contentBlocks: [
          {
            id: 'block-1',
            type: 'hero',
            props: {
              title: 'Welcome to Our School',
              subtitle: 'Empowering Future Leaders',
              backgroundImage: '/dummy-images/school-hero.jpg',
              height: '100vh',
              align: 'center',
              overlay: { enabled: true, color: '#000000', opacity: 0.4 }
            },
            order: 0
          },
          {
            id: 'block-2',
            type: 'richtext',
            props: {
              content: '<h2>About Our School</h2><p>We are dedicated to providing quality education and nurturing young minds.</p>',
              align: 'left'
            },
            order: 1
          }
        ],
        meta: {
          title: 'Home - Our School',
          description: 'Welcome to our school website',
          robots: { index: true, follow: true }
        }
      })
      await homePage.save()
      console.log('✅ Created sample home page')
    }
    
    console.log('✅ Initial data created successfully!')
  } catch (error) {
    console.error('Error creating initial data:', error)
  } finally {
    process.exit(0)
  }
}

createInitialData()

