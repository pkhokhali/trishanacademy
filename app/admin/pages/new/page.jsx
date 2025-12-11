'use client'

import { useRouter } from 'next/navigation'
import PageEditor from '@/components/admin/PageEditor'

export default function NewPage() {
  const router = useRouter()
  
  return (
    <PageEditor 
      pageId={null} 
      onClose={() => router.push('/admin/pages')}
    />
  )
}

