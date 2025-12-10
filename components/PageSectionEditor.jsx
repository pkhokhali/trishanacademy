'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { Upload, X, Plus, Trash2, Palette, Image as ImageIcon } from 'lucide-react'
import RichTextEditor from './RichTextEditor'

export default function PageSectionEditor({ 
  section, 
  sectionKey, 
  onUpdate, 
  onImageUpload,
  title = 'Section'
}) {
  const [localSection, setLocalSection] = useState(section || {})

  const updateField = (field, value) => {
    const updated = { ...localSection, [field]: value }
    setLocalSection(updated)
    onUpdate(sectionKey, updated)
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    const url = await onImageUpload(file, `${sectionKey}-${field}`)
    if (url) {
      updateField(field, url)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {/* Background Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Background Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={localSection.backgroundColor || '#ffffff'}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={localSection.backgroundColor || ''}
            onChange={(e) => updateField('backgroundColor', e.target.value)}
            placeholder="#ffffff or CSS color"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Background Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'backgroundImage')}
            className="hidden"
            id={`bg-image-${sectionKey}`}
          />
          <label
            htmlFor={`bg-image-${sectionKey}`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Background</span>
          </label>
          {localSection.backgroundImage && (
            <div className="relative">
              <NextImage 
                src={localSection.backgroundImage} 
                alt="Background" 
                width={100} 
                height={60} 
                className="rounded border border-gray-300" 
                unoptimized 
              />
              <button
                onClick={() => updateField('backgroundImage', '')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Background Gradient */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Background Gradient (CSS gradient string)
        </label>
        <input
          type="text"
          value={localSection.backgroundGradient || ''}
          onChange={(e) => updateField('backgroundGradient', e.target.value)}
          placeholder="linear-gradient(to right, #667eea, #764ba2)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  )
}

