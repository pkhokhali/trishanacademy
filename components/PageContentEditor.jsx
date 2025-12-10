'use client'

import { useState, useEffect } from 'react'
import { Edit2, Save, X, Eye, EyeOff } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import NextImage from 'next/image'

export default function PageContentEditor({ pageName, onSave }) {
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [previewMode, setPreviewMode] = useState(true)

  useEffect(() => {
    loadPageContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName])

  const loadPageContent = async () => {
    try {
      const response = await fetch('/api/settings')
      const settings = await response.json()
      const content = settings.pageContent?.[pageName] || {}
      setPageData(content)
      setEditData(content)
      setLoading(false)
    } catch (error) {
      console.error('Error loading page content:', error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pageContent: {
            [pageName]: editData
          }
        })
      })

      if (response.ok) {
        setPageData(editData)
        setEditing(false)
        if (onSave) onSave()
        alert('Content saved successfully!')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content')
    }
  }

  const updateField = (section, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  if (loading) {
    return <div className="p-8 text-center">Loading page content...</div>
  }

  // Render preview of current page content
  const renderPreview = () => {
    if (!pageData) return <p className="text-gray-500 italic">No content available</p>

    return (
      <div className="space-y-8">
        {/* Hero Section Preview */}
        {pageData.hero && (
          <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-primary-50 to-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Hero Section</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Title:</label>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {pageData.hero.title || <span className="text-gray-400 italic">Not set</span>}
                </p>
              </div>
              {pageData.hero.subtitle && (
                <div>
                  <label className="text-xs font-medium text-gray-600">Subtitle:</label>
                  <div 
                    className="text-gray-700 mt-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageData.hero.subtitle }}
                  />
                </div>
              )}
              {pageData.hero.backgroundImage && (
                <div>
                  <label className="text-xs font-medium text-gray-600">Background Image:</label>
                  <NextImage 
                    src={pageData.hero.backgroundImage} 
                    alt="Hero background" 
                    width={300} 
                    height={150} 
                    className="mt-2 rounded border"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Section Preview */}
        {pageData.stats && pageData.stats.items && pageData.stats.items.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Stats Section</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pageData.stats.items.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section Preview */}
        {pageData.features && pageData.features.items && pageData.features.items.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Features Section</h3>
            {pageData.features.sectionTitle && (
              <h4 className="text-md font-semibold mb-3">{pageData.features.sectionTitle}</h4>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {pageData.features.items.map((feature, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h5 className="font-semibold text-gray-900">{feature.title}</h5>
                  <div 
                    className="text-sm text-gray-600 mt-2 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other sections can be added similarly */}
      </div>
    )
  }

  // Render edit form
  const renderEditForm = () => {
    return (
      <div className="space-y-6">
        {/* Hero Section Editor */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editData.hero?.title || ''}
                onChange={(e) => updateField('hero', 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
              <RichTextEditor
                value={editData.hero?.subtitle || ''}
                onChange={(value) => updateField('hero', 'subtitle', value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={editData.hero?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateField('hero', 'backgroundColor', e.target.value)}
                  className="w-16 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={editData.hero?.backgroundColor || ''}
                  onChange={(e) => updateField('hero', 'backgroundColor', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section Editor */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Stats Section</h3>
          <div className="space-y-4">
            {(editData.stats?.items || []).map((stat, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Number</label>
                    <input
                      type="text"
                      value={stat.number || ''}
                      onChange={(e) => {
                        const newItems = [...(editData.stats?.items || [])]
                        newItems[index] = { ...stat, number: e.target.value }
                        setEditData(prev => ({
                          ...prev,
                          stats: { ...prev.stats, items: newItems }
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newItems = [...(editData.stats?.items || [])]
                        newItems[index] = { ...stat, label: e.target.value }
                        setEditData(prev => ({
                          ...prev,
                          stats: { ...prev.stats, items: newItems }
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setEditData(prev => ({
                  ...prev,
                  stats: {
                    ...prev.stats,
                    items: [...(prev.stats?.items || []), { number: '', label: '' }]
                  }
                }))
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
            >
              Add Stat Item
            </button>
          </div>
        </div>

        {/* Features Section Editor */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Features Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={editData.features?.sectionTitle || ''}
                onChange={(e) => updateField('features', 'sectionTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {(editData.features?.items || []).map((feature, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => {
                        const newItems = [...(editData.features?.items || [])]
                        newItems[index] = { ...feature, title: e.target.value }
                        setEditData(prev => ({
                          ...prev,
                          features: { ...prev.features, items: newItems }
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <RichTextEditor
                      value={feature.description || ''}
                      onChange={(value) => {
                        const newItems = [...(editData.features?.items || [])]
                        newItems[index] = { ...feature, description: value }
                        setEditData(prev => ({
                          ...prev,
                          features: { ...prev.features, items: newItems }
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setEditData(prev => ({
                  ...prev,
                  features: {
                    ...prev.features,
                    items: [...(prev.features?.items || []), { title: '', description: '' }]
                  }
                }))
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
            >
              Add Feature
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Edit2 className="h-5 w-5" />
              <span>Edit Content</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditing(false)
                  setEditData(pageData)
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {previewMode && !editing && renderPreview()}
        {editing && renderEditForm()}
        {!previewMode && !editing && (
          <div className="text-center py-12 text-gray-500">
            Preview is hidden. Click &quot;Show Preview&quot; to view current content.
          </div>
        )}
      </div>
    </div>
  )
}

