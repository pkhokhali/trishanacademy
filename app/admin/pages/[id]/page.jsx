'use client'

import { use } from 'react'
import PageEditor from '@/components/admin/PageEditor'
import { useRouter } from 'next/navigation'

export default function EditPage({ params }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const pageId = resolvedParams.id === 'new' ? null : resolvedParams.id

  return (
    <PageEditor 
      pageId={pageId} 
      onClose={() => router.push('/admin/pages')}
    />
  )
}

