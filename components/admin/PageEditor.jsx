'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Save, 
  Eye, 
  FileText, 
  Image, 
  Layout, 
  Video, 
  Type, 
  Square,
  Film,
  Code,
  Minus,
  Columns,
  Plus,
  Trash2,
  Copy,
  Move,
  Settings,
  X,
  Download,
  Upload,
  Clock,
  Globe,
  History
} from 'lucide-react'
import MediaLibrary from './MediaLibrary'
import RichTextEditor from '../RichTextEditor'
import RevisionHistory from './RevisionHistory'

const BLOCK_TYPES = [
  { id: 'richtext', label: 'Rich Text', icon: Type },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'gallery', label: 'Gallery', icon: Layout },
  { id: 'carousel', label: 'Carousel', icon: Film },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'button', label: 'Button', icon: Square },
  { id: 'form', label: 'Form', icon: FileText },
  { id: 'html', label: 'HTML', icon: Code },
  { id: 'spacer', label: 'Spacer', icon: Minus },
  { id: 'columns', label: 'Columns', icon: Columns },
  { id: 'hero', label: 'Hero Section', icon: Image },
  { id: 'background-image', label: 'Background Image', icon: Image }
]

export default function PageEditor({ pageId, onClose }) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaLibraryMode, setMediaLibraryMode] = useState(null) // 'select' or 'upload'
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [showRevisions, setShowRevisions] = useState(false)

  useEffect(() => {
    if (pageId) {
      loadPage()
    } else {
      // New page
      setPage({
        title: '',
        slug: '',
        status: 'draft',
        contentBlocks: [],
        meta: {
          title: '',
          description: '',
          canonical: '',
          robots: { index: true, follow: true }
        },
        settings: {
          layout: 'default',
          theme: 'default',
          showHeader: true,
          showFooter: true
        }
      })
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const loadPage = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}`)
      const data = await res.json()
      if (data.success) {
        setPage(data.data)
        setUndoStack([JSON.stringify(data.data)])
      }
    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePage = async () => {
    if (!page) return
    
    // Validate required fields
    if (!page.title || page.title.trim() === '') {
      alert('Please enter a page title')
      return
    }
    
    if (!page.slug || page.slug.trim() === '') {
      alert('Please enter a page slug (e.g., "about", "contact")')
      return
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(page.slug)) {
      alert('Slug must contain only lowercase letters, numbers, and hyphens (e.g., "my-page")')
      return
    }
    
    setSaving(true)
    try {
      const url = pageId ? `/api/pages/${pageId}` : '/api/pages'
      const method = pageId ? 'PUT' : 'POST'
      
      // Ensure contentBlocks is an array
      const pageToSave = {
        ...page,
        contentBlocks: Array.isArray(page.contentBlocks) ? page.contentBlocks : []
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageToSave)
      })
      
      const data = await res.json()
      if (data.success) {
        if (!pageId) {
          // Redirect to edit page
          window.location.href = `/admin/pages/${data.data._id}`
        } else {
          // Save to undo stack
          setUndoStack(prev => [...prev, JSON.stringify(page)])
          setRedoStack([])
          // Reload page data to get updated version
          loadPage()
        }
        alert(`Page saved successfully! ${page.status === 'published' ? 'View it at /pages/' + page.slug : 'Remember to publish it to make it visible.'}`)
      } else {
        alert(data.error || 'Error saving page')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      props: getDefaultBlockProps(type),
      order: page.contentBlocks.length
    }
    
    const updatedPage = {
      ...page,
      contentBlocks: [...page.contentBlocks, newBlock]
    }
    
    setPage(updatedPage)
    setSelectedBlock(newBlock.id)
    saveToUndoStack(updatedPage)
  }

  const getDefaultBlockProps = (type) => {
    const defaults = {
      richtext: { content: '', align: 'left' },
      image: { url: '', alt: '', caption: '', link: '', size: 'full', align: 'center' },
      gallery: { images: [], columns: 3, spacing: 4, lightbox: true },
      carousel: { 
        slides: [], 
        autoplay: true, 
        autoplaySpeed: 3000, 
        transition: 'slide', 
        loop: true,
        arrows: true,
        dots: true,
        slideSpeed: 500
      },
      video: { url: '', autoplay: false, loop: false, controls: true },
      button: { label: 'Button', url: '', target: '_self', style: 'primary', size: 'md' },
      form: { fields: [], successMessage: 'Thank you for your submission!' },
      html: { content: '', sanitize: true },
      spacer: { height: 40 },
      columns: { columns: 2, content: [] },
      hero: { 
        title: '', 
        subtitle: '', 
        backgroundImage: '', 
        backgroundColor: '', 
        backgroundGradient: '',
        overlay: { enabled: false, color: '#000000', opacity: 0.5 },
        height: '100vh',
        align: 'center'
      },
      'background-image': { 
        image: '', 
        size: 'cover', 
        position: 'center', 
        overlay: { enabled: false, color: '#000000', opacity: 0.5 }
      }
    }
    return defaults[type] || {}
  }

  const updateBlock = (blockId, props) => {
    const updatedPage = {
      ...page,
      contentBlocks: page.contentBlocks.map(block =>
        block.id === blockId ? { ...block, props: { ...block.props, ...props } } : block
      )
    }
    setPage(updatedPage)
    saveToUndoStack(updatedPage)
  }

  const deleteBlock = (blockId) => {
    if (!confirm('Are you sure you want to delete this block?')) return
    
    const updatedPage = {
      ...page,
      contentBlocks: page.contentBlocks.filter(block => block.id !== blockId)
    }
    setPage(updatedPage)
    setSelectedBlock(null)
    saveToUndoStack(updatedPage)
  }

  const duplicateBlock = (blockId) => {
    const block = page.contentBlocks.find(b => b.id === blockId)
    if (!block) return
    
    const newBlock = {
      ...block,
      id: `block-${Date.now()}`,
      order: block.order + 1
    }
    
    const updatedPage = {
      ...page,
      contentBlocks: [
        ...page.contentBlocks.slice(0, block.order + 1),
        newBlock,
        ...page.contentBlocks.slice(block.order + 1).map(b => ({ ...b, order: b.order + 1 }))
      ]
    }
    setPage(updatedPage)
    saveToUndoStack(updatedPage)
  }

  const moveBlock = (blockId, direction) => {
    const index = page.contentBlocks.findIndex(b => b.id === blockId)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= page.contentBlocks.length) return
    
    const blocks = [...page.contentBlocks]
    const [removed] = blocks.splice(index, 1)
    blocks.splice(newIndex, 0, removed)
    
    const updatedPage = {
      ...page,
      contentBlocks: blocks.map((b, i) => ({ ...b, order: i }))
    }
    setPage(updatedPage)
    saveToUndoStack(updatedPage)
  }

  const saveToUndoStack = (pageState) => {
    setUndoStack(prev => [...prev.slice(-49), JSON.stringify(pageState)])
    setRedoStack([])
  }

  const undo = () => {
    if (undoStack.length <= 1) return
    const current = undoStack.pop()
    setRedoStack(prev => [...prev, current])
    const previous = undoStack[undoStack.length - 1]
    setPage(JSON.parse(previous))
  }

  const redo = () => {
    if (redoStack.length === 0) return
    const next = redoStack.pop()
    setUndoStack(prev => [...prev, JSON.stringify(page)])
    setPage(JSON.parse(next))
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        savePage()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!page) return null

  const selectedBlockData = page.contentBlocks.find(b => b.id === selectedBlock)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Block Palette */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-700">Blocks</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {BLOCK_TYPES.map((blockType) => {
            const Icon = blockType.icon
            return (
              <button
                key={blockType.id}
                onClick={() => addBlock(blockType.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg mb-1"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{blockType.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              placeholder="Page Title"
              className="text-xl font-bold border-none outline-none"
            />
            <span className="text-sm text-gray-500">/{page.slug || 'page-slug'}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Preview Mode */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1 rounded ${previewMode === 'desktop' ? 'bg-white shadow' : ''}`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`px-3 py-1 rounded ${previewMode === 'tablet' ? 'bg-white shadow' : ''}`}
              >
                Tablet
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 rounded ${previewMode === 'mobile' ? 'bg-white shadow' : ''}`}
              >
                Mobile
              </button>
            </div>
            <button
              onClick={savePage}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 overflow-y-auto p-8"
          style={{
            maxWidth: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
            margin: '0 auto'
          }}
        >
          {page.contentBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Plus className="w-12 h-12 mb-4" />
              <p className="mb-2">Add blocks from the left sidebar to build your page</p>
              <p className="text-sm text-gray-500">
                Don&apos;t forget to set a slug and publish the page to make it visible!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {page.contentBlocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isSelected={selectedBlock === block.id}
                  onSelect={() => setSelectedBlock(block.id)}
                  onUpdate={(props) => updateBlock(block.id, props)}
                  onDelete={() => deleteBlock(block.id)}
                  onDuplicate={() => duplicateBlock(block.id)}
                  onMove={(dir) => moveBlock(block.id, dir)}
                  onOpenMediaLibrary={(mode) => {
                    setMediaLibraryMode(mode)
                    setShowMediaLibrary(true)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-700">Settings</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {showRevisions ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Revision History</h3>
                <button
                  onClick={() => setShowRevisions(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <RevisionHistory
                pageId={pageId}
                onRestore={() => {
                  loadPage()
                  setShowRevisions(false)
                }}
              />
            </div>
          ) : selectedBlockData ? (
            <BlockSettings
              block={selectedBlockData}
              onUpdate={(props) => updateBlock(selectedBlockData.id, props)}
              onOpenMediaLibrary={(mode) => {
                setMediaLibraryMode(mode)
                setShowMediaLibrary(true)
              }}
            />
          ) : (
            <PageSettings
              page={page}
              onUpdate={(updates) => setPage({ ...page, ...updates })}
              onShowRevisions={() => setShowRevisions(true)}
            />
          )}
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          if (selectedBlockData && mediaLibraryMode) {
            const updates = {}
            if (mediaLibraryMode === 'image') {
              updates.url = media.url || (Array.isArray(media) ? media[0]?.url : '')
            } else if (mediaLibraryMode === 'gallery') {
              updates.images = Array.isArray(media) ? media : [media]
            } else if (mediaLibraryMode === 'carousel') {
              updates.slides = Array.isArray(media) ? media : [media]
            }
            updateBlock(selectedBlockData.id, updates)
          }
          setShowMediaLibrary(false)
        }}
        multiple={mediaLibraryMode === 'gallery' || mediaLibraryMode === 'carousel'}
      />
    </div>
  )
}

// Block Renderer Component
function BlockRenderer({ block, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onMove, onOpenMediaLibrary }) {
  const renderBlock = () => {
    switch (block.type) {
      case 'richtext':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: block.props.content }} />
          </div>
        )
      case 'image':
        return block.props.url ? (
          <figure className={block.props.align === 'center' ? 'text-center' : ''}>
            <img 
              src={block.props.url} 
              alt={block.props.alt}
              className={`${block.props.size === 'full' ? 'w-full' : 'max-w-full'}`}
            />
            {block.props.caption && (
              <figcaption className="text-sm text-gray-600 mt-2">{block.props.caption}</figcaption>
            )}
          </figure>
        ) : (
          <div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-400">
            No image selected
          </div>
        )
      case 'gallery':
        return (
          <div className={`grid gap-4 grid-cols-${block.props.columns || 3}`}>
            {block.props.images?.map((img, i) => (
              <img key={i} src={img.url || img} alt="" className="w-full h-48 object-cover rounded" />
            ))}
          </div>
        )
      case 'carousel':
        return (
          <div className="relative">
            <div className="flex overflow-x-auto">
              {block.props.slides?.map((slide, i) => (
                <div key={i} className="min-w-full">
                  <img src={slide.url || slide} alt="" className="w-full h-64 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )
      case 'button':
        return (
          <a
            href={block.props.url}
            target={block.props.target}
            className={`inline-block px-6 py-3 rounded-lg ${
              block.props.style === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {block.props.label}
          </a>
        )
      case 'spacer':
        return <div style={{ height: `${block.props.height || 40}px` }} />
      case 'html':
        return <div dangerouslySetInnerHTML={{ __html: block.props.content }} />
      default:
        return <div className="p-4 border border-gray-200 rounded">{block.type} block</div>
    }
  }

  return (
    <div
      className={`relative border-2 rounded-lg p-4 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-3 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          {block.type}
        </div>
      )}
      {renderBlock()}
      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMove('up') }}
            className="p-1 bg-white rounded shadow hover:bg-gray-100"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMove('down') }}
            className="p-1 bg-white rounded shadow hover:bg-gray-100"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className="p-1 bg-white rounded shadow hover:bg-gray-100"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1 bg-red-500 text-white rounded shadow hover:bg-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// Block Settings Component
function BlockSettings({ block, onUpdate, onOpenMediaLibrary }) {
  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold text-gray-700 capitalize">{block.type} Settings</h4>
      
      {block.type === 'richtext' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <RichTextEditor
            value={block.props.content || ''}
            onChange={(content) => onUpdate({ content })}
          />
        </div>
      )}
      
      {block.type === 'image' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <button
              onClick={() => onOpenMediaLibrary('image')}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Select Image
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
            <input
              type="text"
              value={block.props.alt || ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
            <input
              type="text"
              value={block.props.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </>
      )}
      
      {block.type === 'gallery' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <button
            onClick={() => onOpenMediaLibrary('gallery')}
            className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Select Images
          </button>
        </div>
      )}
      
      {block.type === 'carousel' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slides</label>
            <button
              onClick={() => onOpenMediaLibrary('carousel')}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Select Images
            </button>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.props.autoplay || false}
                onChange={(e) => onUpdate({ autoplay: e.target.checked })}
              />
              Autoplay
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Autoplay Speed (ms)</label>
            <input
              type="number"
              value={block.props.autoplaySpeed || 3000}
              onChange={(e) => onUpdate({ autoplaySpeed: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </>
      )}
      
      {block.type === 'spacer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
          <input
            type="number"
            value={block.props.height || 40}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

// Page Settings Component
function PageSettings({ page, onUpdate, onShowRevisions }) {
  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">Page Settings</h4>
          {onShowRevisions && (
            <button
              onClick={onShowRevisions}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="View revision history"
            >
              <History className="w-4 h-4" />
              History
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={page.slug || ''}
              onChange={(e) => {
                // Auto-format slug: lowercase, replace spaces with hyphens
                const formatted = e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                onUpdate({ slug: formatted })
              }}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="page-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /pages/{page.slug || 'page-slug'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={page.status || 'draft'}
              onChange={(e) => onUpdate({ status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft (not visible to public)</option>
              <option value="published">Published (visible to public)</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
            {page.status === 'draft' && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ This page is a draft and won&apos;t be visible until published
              </p>
            )}
            {page.status === 'published' && page.slug && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Page is live at: <a href={`/pages/${page.slug}`} target="_blank" className="underline">/pages/{page.slug}</a>
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-4">SEO</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
            <input
              type="text"
              value={page.meta?.title || ''}
              onChange={(e) => onUpdate({ meta: { ...page.meta, title: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <textarea
              value={page.meta?.description || ''}
              onChange={(e) => onUpdate({ meta: { ...page.meta, description: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

