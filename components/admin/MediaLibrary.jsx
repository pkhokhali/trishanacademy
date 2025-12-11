'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Upload, 
  Search, 
  X, 
  Image as ImageIcon, 
  Check,
  Trash2,
  Edit2,
  Download
} from 'lucide-react'

export default function MediaLibrary({ isOpen, onClose, onSelect, multiple = false }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, search])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const res = await fetch(`/api/media?${params}`)
      const data = await res.json()
      if (data.success) {
        setMedia(data.data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        await fetchMedia()
      }
    } catch (error) {
      console.error('Error uploading:', error)
    } finally {
      setUploading(false)
      fileInputRef.current.value = ''
    }
  }

  const handleSelect = (item) => {
    if (multiple) {
      setSelected(prev => {
        const exists = prev.find(m => m._id === item._id)
        if (exists) {
          return prev.filter(m => m._id !== item._id)
        } else {
          return [...prev, item]
        }
      })
    } else {
      onSelect(item)
      onClose()
    }
  }

  const handleConfirm = () => {
    onSelect(selected)
    onClose()
    setSelected([])
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        await fetchMedia()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  if (!isOpen && !standalone) return null

  const containerClass = standalone ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  const contentClass = standalone ? "w-full h-full" : "bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col"

  return (
    <div className={containerClass}>
      <div className={contentClass} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Media Library</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleUpload}
              className="hidden"
            />
            {!standalone && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ImageIcon className="w-16 h-16 mb-4" />
              <p>No media found. Upload some files to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.map((item) => {
                const isSelected = selected.find(m => m._id === item._id)
                return (
                  <div
                    key={item._id}
                    className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden ${
                      isSelected ? 'border-blue-600' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    {item.mimeType?.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.alt || item.originalFilename}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelect(item)
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item._id)
                        }}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-xs text-gray-600 truncate">{item.originalFilename}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {multiple && (
          <div className="flex items-center justify-between p-6 border-t">
            <div className="text-sm text-gray-600">
              {selected.length} item{selected.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Select {selected.length > 0 && `(${selected.length})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

