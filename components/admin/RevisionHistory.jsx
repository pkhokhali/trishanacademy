'use client'

import { useState, useEffect } from 'react'
import { Clock, RotateCcw, Eye } from 'lucide-react'

export default function RevisionHistory({ pageId, onRestore }) {
  const [revisions, setRevisions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pageId) {
      fetchRevisions()
    }
  }, [pageId])

  const fetchRevisions = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}/revisions`)
      const data = await res.json()
      if (data.success) {
        setRevisions(data.data)
      }
    } catch (error) {
      console.error('Error fetching revisions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (revisionId) => {
    if (!confirm('Are you sure you want to restore this revision? This will replace the current page content.')) {
      return
    }

    try {
      const res = await fetch(`/api/pages/${pageId}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId })
      })
      const data = await res.json()
      if (data.success) {
        alert('Revision restored successfully!')
        if (onRestore) {
          onRestore()
        }
      }
    } catch (error) {
      console.error('Error restoring revision:', error)
      alert('Error restoring revision')
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading revisions...</div>
  }

  if (revisions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No revisions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {revisions.map((revision) => (
        <div
          key={revision._id}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Version {revision.version}</span>
                {revision.changeNote && (
                  <span className="text-sm text-gray-500">- {revision.changeNote}</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {revision.createdBy?.username || 'System'} • {new Date(revision.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRestore(revision._id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title="Restore this revision"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

