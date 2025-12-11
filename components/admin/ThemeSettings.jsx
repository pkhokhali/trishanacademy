'use client'

import { useState, useEffect } from 'react'
import { Save, Palette, Type, Layout, Upload, X } from 'lucide-react'
import MediaLibrary from './MediaLibrary'

export default function ThemeSettings() {
  const [themes, setThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaLibraryMode, setMediaLibraryMode] = useState(null)

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/themes')
      const data = await res.json()
      if (data.success) {
        setThemes(data.data)
        const defaultTheme = data.data.find(t => t.isDefault) || data.data[0]
        if (defaultTheme) {
          setSelectedTheme(defaultTheme)
        }
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedTheme) return
    
    setSaving(true)
    try {
      const url = selectedTheme._id ? `/api/themes/${selectedTheme._id}` : '/api/themes'
      const method = selectedTheme._id ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTheme)
      })
      
      const data = await res.json()
      if (data.success) {
        alert('Theme saved successfully!')
        await fetchThemes()
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      alert('Error saving theme')
    } finally {
      setSaving(false)
    }
  }

  const updateTheme = (field, value) => {
    setSelectedTheme(prev => {
      const updated = { ...prev }
      const keys = field.split('.')
      let current = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  const createNewTheme = () => {
    const newTheme = {
      name: 'New Theme',
      slug: `theme-${Date.now()}`,
      isDefault: false,
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
      },
      spacing: {
        base: 8
      },
      layout: {
        containerWidth: '1280px',
        headerHeight: '80px',
        footerHeight: '200px'
      }
    }
    setSelectedTheme(newTheme)
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading themes...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
        <p className="mt-2 text-gray-600">Customize your website&apos;s appearance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Theme List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Themes</h2>
              <button
                onClick={createNewTheme}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + New
              </button>
            </div>
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme._id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-full text-left p-3 rounded-lg ${
                    selectedTheme?._id === theme._id
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="font-medium">{theme.name}</div>
                  {theme.isDefault && (
                    <div className="text-xs text-gray-500 mt-1">Default</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Editor */}
        <div className="lg:col-span-3">
          {selectedTheme ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <input
                      type="text"
                      value={selectedTheme.name || ''}
                      onChange={(e) => setSelectedTheme({ ...selectedTheme, name: e.target.value })}
                      className="text-2xl font-bold border-none outline-none bg-transparent"
                      placeholder="Theme Name"
                    />
                    <input
                      type="text"
                      value={selectedTheme.slug || ''}
                      onChange={(e) => setSelectedTheme({ ...selectedTheme, slug: e.target.value })}
                      className="text-sm text-gray-500 border-none outline-none bg-transparent mt-1"
                      placeholder="theme-slug"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTheme.isDefault || false}
                      onChange={(e) => setSelectedTheme({ ...selectedTheme, isDefault: e.target.checked })}
                    />
                    <span className="text-sm">Set as default</span>
                  </label>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Colors
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedTheme.colors || {}).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => updateTheme(`colors.${key}`, e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => updateTheme(`colors.${key}`, e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fonts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Fonts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heading Font
                      </label>
                      <input
                        type="text"
                        value={selectedTheme.fonts?.heading || ''}
                        onChange={(e) => updateTheme('fonts.heading', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Inter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Body Font
                      </label>
                      <input
                        type="text"
                        value={selectedTheme.fonts?.body || ''}
                        onChange={(e) => updateTheme('fonts.body', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Inter"
                      />
                    </div>
                  </div>
                </div>

                {/* Layout */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Layout
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Container Width
                      </label>
                      <input
                        type="text"
                        value={selectedTheme.layout?.containerWidth || ''}
                        onChange={(e) => updateTheme('layout.containerWidth', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="1280px"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Header Height
                      </label>
                      <input
                        type="text"
                        value={selectedTheme.layout?.headerHeight || ''}
                        onChange={(e) => updateTheme('layout.headerHeight', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="80px"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Footer Height
                      </label>
                      <input
                        type="text"
                        value={selectedTheme.layout?.footerHeight || ''}
                        onChange={(e) => updateTheme('layout.footerHeight', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="200px"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo & Favicon */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Branding
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <button
                        onClick={() => {
                          setMediaLibraryMode('logo')
                          setShowMediaLibrary(true)
                        }}
                        className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-left"
                      >
                        {selectedTheme.logo ? (
                          <div className="flex items-center gap-2">
                            <img src={selectedTheme.logo} alt="Logo" className="h-8" />
                            <span className="text-sm text-gray-600">Change Logo</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Select Logo</span>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                      </label>
                      <button
                        onClick={() => {
                          setMediaLibraryMode('favicon')
                          setShowMediaLibrary(true)
                        }}
                        className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 text-left"
                      >
                        {selectedTheme.favicon ? (
                          <div className="flex items-center gap-2">
                            <img src={selectedTheme.favicon} alt="Favicon" className="h-8 w-8" />
                            <span className="text-sm text-gray-600">Change Favicon</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Select Favicon</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div
                    className="p-8 rounded-lg border"
                    style={{
                      backgroundColor: selectedTheme.colors?.background || '#FFFFFF',
                      color: selectedTheme.colors?.text || '#111827'
                    }}
                  >
                    <div
                      className="mb-4"
                      style={{
                        fontFamily: selectedTheme.fonts?.heading || 'Inter',
                        color: selectedTheme.colors?.primary || '#3B82F6'
                      }}
                    >
                      <h2 className="text-2xl font-bold">Sample Heading</h2>
                    </div>
                    <div
                      style={{
                        fontFamily: selectedTheme.fonts?.body || 'Inter'
                      }}
                    >
                      <p className="mb-2">This is a sample paragraph showing how your theme will look.</p>
                      <button
                        className="px-4 py-2 rounded text-white"
                        style={{
                          backgroundColor: selectedTheme.colors?.primary || '#3B82F6'
                        }}
                      >
                        Primary Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Theme'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <Palette className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>No theme selected. Create a new theme or select an existing one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          if (mediaLibraryMode === 'logo') {
            updateTheme('logo', media.url || (Array.isArray(media) ? media[0]?.url : ''))
          } else if (mediaLibraryMode === 'favicon') {
            updateTheme('favicon', media.url || (Array.isArray(media) ? media[0]?.url : ''))
          }
          setShowMediaLibrary(false)
        }}
        multiple={false}
      />
    </div>
  )
}

