import { notFound } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import Page from '@/models/Page'
import PageRenderer from '@/components/PageRenderer'

export async function generateMetadata({ params }) {
  await connectDB()
  const { slug } = params
  
  const page = await Page.findOne({ 
    slug,
    status: { $in: ['published', 'scheduled'] }
  }).lean()
  
  if (!page) {
    return {
      title: 'Page Not Found'
    }
  }
  
  // Check if scheduled page should be visible
  if (page.status === 'scheduled' && page.scheduledAt) {
    const now = new Date()
    if (new Date(page.scheduledAt) > now) {
      return {
        title: 'Page Not Found'
      }
    }
  }
  
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      images: page.meta?.ogImage ? [page.meta.ogImage] : []
    },
    robots: {
      index: page.meta?.robots?.index !== false,
      follow: page.meta?.robots?.follow !== false
    }
  }
}

export default async function DynamicPage({ params }) {
  await connectDB()
  const { slug } = params
  
  const page = await Page.findOne({ 
    slug,
    status: { $in: ['published', 'scheduled'] }
  }).lean()
  
  if (!page) {
    notFound()
  }
  
  // Check if scheduled page should be visible
  if (page.status === 'scheduled' && page.scheduledAt) {
    const now = new Date()
    if (new Date(page.scheduledAt) > now) {
      notFound()
    }
  }
  
  return <PageRenderer page={page} />
}

