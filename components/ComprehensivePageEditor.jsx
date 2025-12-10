'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { Upload, X, Plus, Trash2, Palette, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import RichTextEditor from './RichTextEditor'

export default function ComprehensivePageEditor({ 
  pageName,
  pageData, 
  onUpdate,
  onImageUpload
}) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const updateSection = (sectionKey, field, value) => {
    const updated = {
      ...pageData,
      [sectionKey]: {
        ...pageData[sectionKey],
        [field]: value
      }
    }
    onUpdate(updated)
  }

  const updateSectionItem = (sectionKey, itemIndex, field, value) => {
    const section = pageData[sectionKey] || {}
    const items = [...(section.items || [])]
    items[itemIndex] = { ...items[itemIndex], [field]: value }
    updateSection(sectionKey, 'items', items)
  }

  const addSectionItem = (sectionKey) => {
    const section = pageData[sectionKey] || {}
    const items = [...(section.items || [])]
    items.push({ title: '', description: '', image: '' })
    updateSection(sectionKey, 'items', items)
  }

  const removeSectionItem = (sectionKey, itemIndex) => {
    const section = pageData[sectionKey] || {}
    const items = [...(section.items || [])]
    items.splice(itemIndex, 1)
    updateSection(sectionKey, 'items', items)
  }

  const handleImageUpload = async (e, sectionKey, field) => {
    const file = e.target.files[0]
    if (!file) return

    const url = await onImageUpload(file, `${pageName}-${sectionKey}-${field}`)
    if (url) {
      updateSection(sectionKey, field, url)
    }
  }

  const renderSectionEditor = (sectionKey, sectionTitle, fields = []) => {
    const section = pageData[sectionKey] || {}
    const isExpanded = expandedSections[sectionKey]

    return (
      <div key={sectionKey} className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">{sectionTitle}</h3>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {isExpanded && (
          <div className="p-6 space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={section.backgroundColor || '#ffffff'}
                  onChange={(e) => updateSection(sectionKey, 'backgroundColor', e.target.value)}
                  className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={section.backgroundColor || ''}
                  onChange={(e) => updateSection(sectionKey, 'backgroundColor', e.target.value)}
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
                  onChange={(e) => handleImageUpload(e, sectionKey, 'backgroundImage')}
                  className="hidden"
                  id={`bg-${pageName}-${sectionKey}`}
                />
                <label
                  htmlFor={`bg-${pageName}-${sectionKey}`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Background</span>
                </label>
                {section.backgroundImage && (
                  <div className="relative">
                    <NextImage 
                      src={section.backgroundImage} 
                      alt="Background" 
                      width={100} 
                      height={60} 
                      className="rounded border border-gray-300" 
                      unoptimized 
                    />
                    <button
                      onClick={() => updateSection(sectionKey, 'backgroundImage', '')}
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
                Background Gradient (CSS gradient)
              </label>
              <input
                type="text"
                value={section.backgroundGradient || ''}
                onChange={(e) => updateSection(sectionKey, 'backgroundGradient', e.target.value)}
                placeholder="linear-gradient(to right, #667eea, #764ba2)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Dynamic Fields */}
            {fields.map(field => {
              if (field.type === 'text') {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={section[field.key] || ''}
                      onChange={(e) => updateSection(sectionKey, field.key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )
              } else if (field.type === 'richtext') {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <RichTextEditor
                      value={section[field.key] || ''}
                      onChange={(value) => updateSection(sectionKey, field.key, value)}
                      placeholder={field.placeholder}
                    />
                  </div>
                )
              } else if (field.type === 'items') {
                return (
                  <div key={field.key}>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        {field.label}
                      </label>
                      <button
                        onClick={() => addSectionItem(sectionKey)}
                        className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Item</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(section.items || []).map((item, itemIndex) => (
                        <div key={itemIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Item {itemIndex + 1}</span>
                            <button
                              onClick={() => removeSectionItem(sectionKey, itemIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {field.itemFields.map(itemField => {
                            if (itemField.type === 'text') {
                              return (
                                <div key={itemField.key}>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {itemField.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={item[itemField.key] || ''}
                                    onChange={(e) => updateSectionItem(sectionKey, itemIndex, itemField.key, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                                  />
                                </div>
                              )
                            } else if (itemField.type === 'richtext') {
                              return (
                                <div key={itemField.key}>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {itemField.label}
                                  </label>
                                  <RichTextEditor
                                    value={item[itemField.key] || ''}
                                    onChange={(value) => updateSectionItem(sectionKey, itemIndex, itemField.key, value)}
                                  />
                                </div>
                              )
                            } else if (itemField.type === 'image') {
                              return (
                                <div key={itemField.key}>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {itemField.label}
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                          onImageUpload(file, `${pageName}-${sectionKey}-item-${itemIndex}-${itemField.key}`).then(url => {
                                            if (url) updateSectionItem(sectionKey, itemIndex, itemField.key, url)
                                          })
                                        }
                                      }}
                                      className="hidden"
                                      id={`img-${pageName}-${sectionKey}-${itemIndex}-${itemField.key}`}
                                    />
                                    <label
                                      htmlFor={`img-${pageName}-${sectionKey}-${itemIndex}-${itemField.key}`}
                                      className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs cursor-pointer"
                                    >
                                      Upload
                                    </label>
                                    {item[itemField.key] && (
                                      <NextImage 
                                        src={item[itemField.key]} 
                                        alt={itemField.label} 
                                        width={60} 
                                        height={60} 
                                        className="rounded border" 
                                        unoptimized 
                                      />
                                    )}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}
      </div>
    )
  }

  // Define sections based on page name
  const getPageSections = () => {
    const sections = {
      home: [
        { key: 'hero', title: 'Hero Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'badgeText', label: 'Badge Text', type: 'text' }
        ]},
        { key: 'stats', title: 'Stats Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'items', label: 'Stats Items', type: 'items', itemFields: [
            { key: 'number', label: 'Number', type: 'text' },
            { key: 'label', label: 'Label', type: 'text' },
            { key: 'iconColor', label: 'Icon Color', type: 'text' }
          ]}
        ]},
        { key: 'features', title: 'Features Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Features', type: 'items', itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'richtext' },
            { key: 'icon', label: 'Icon Name', type: 'text' }
          ]}
        ]},
        { key: 'programs', title: 'Programs Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Programs', type: 'items', itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'richtext' },
            { key: 'icon', label: 'Icon Name', type: 'text' }
          ]}
        ]},
        { key: 'testimonials', title: 'Testimonials Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Testimonials', type: 'items', itemFields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'role', label: 'Role', type: 'text' },
            { key: 'text', label: 'Testimonial Text', type: 'richtext' },
            { key: 'initials', label: 'Initials', type: 'text' }
          ]}
        ]},
        { key: 'cta', title: 'Call to Action Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'buttonText', label: 'Button Text', type: 'text' }
        ]}
      ],
      about: [
        { key: 'hero', title: 'Hero Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' }
        ]},
        { key: 'mission', title: 'Mission Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'content', label: 'Content', type: 'richtext' }
        ]},
        { key: 'vision', title: 'Vision Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'content', label: 'Content', type: 'richtext' }
        ]},
        { key: 'history', title: 'History Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'content', label: 'Content', type: 'richtext' }
        ]},
        { key: 'values', title: 'Values Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Values', type: 'items', itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'richtext' },
            { key: 'icon', label: 'Icon Name', type: 'text' }
          ]}
        ]},
        { key: 'achievements', title: 'Achievements Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Achievements', type: 'items', itemFields: [
            { key: 'number', label: 'Number', type: 'text' },
            { key: 'label', label: 'Label', type: 'text' }
          ]}
        ]}
      ],
      programs: [
        { key: 'hero', title: 'Hero Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' }
        ]},
        { key: 'academic', title: 'Academic Programs Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Academic Programs', type: 'items', itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'grade', label: 'Grade', type: 'text' },
            { key: 'description', label: 'Description', type: 'richtext' },
            { key: 'icon', label: 'Icon Name', type: 'text' }
          ]}
        ]},
        { key: 'extracurricular', title: 'Extracurricular Programs Section', fields: [
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' },
          { key: 'items', label: 'Extracurricular Programs', type: 'items', itemFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'richtext' },
            { key: 'icon', label: 'Icon Name', type: 'text' }
          ]}
        ]}
      ],
      contact: [
        { key: 'hero', title: 'Hero Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' }
        ]},
        { key: 'form', title: 'Contact Form Section', fields: [
          { key: 'title', label: 'Title', type: 'text' }
        ]},
        { key: 'info', title: 'Contact Information Section', fields: [
          { key: 'address', label: 'Address', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'officeHours', label: 'Office Hours', type: 'text' }
        ]},
        { key: 'map', title: 'Map Section', fields: []}
      ],
      gallery: [
        { key: 'hero', title: 'Hero Section', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'richtext' }
        ]},
        { key: 'filter', title: 'Filter Section', fields: []},
        { key: 'stats', title: 'Stats Section', fields: [
          { key: 'items', label: 'Stats Items', type: 'items', itemFields: [
            { key: 'number', label: 'Number', type: 'text' },
            { key: 'label', label: 'Label', type: 'text' }
          ]}
        ]}
      ]
    }

    return sections[pageName] || []
  }

  return (
    <div className="space-y-4">
      {getPageSections().map(section => 
        renderSectionEditor(section.key, section.title, section.fields)
      )}
    </div>
  )
}

