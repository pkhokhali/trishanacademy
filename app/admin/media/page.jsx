'use client'

import { useState } from 'react'
import MediaLibrary from '@/components/admin/MediaLibrary'

export default function MediaPage() {
  return (
    <div className="h-full">
      <MediaLibrary
        isOpen={true}
        onClose={() => {}}
        onSelect={() => {}}
        multiple={false}
        standalone={true}
      />
    </div>
  )
}

