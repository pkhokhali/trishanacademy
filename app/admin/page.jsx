'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { 
  Settings, 
  Navigation, 
  Image, 
  Link as LinkIcon, 
  MapPin, 
  Save, 
  LogOut,
  Home,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Upload,
  X,
  Camera,
  Plus,
  Trash2,
  FileText,
  BookOpen,
  Mail,
  Users
} from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import ComprehensivePageEditor from '@/components/ComprehensivePageEditor'

export default function Admin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('content')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Content State
  const [content, setContent] = useState({
    schoolName: 'Trishan Academy',
    tagline: 'Shaping Future Leaders',
    heroTitle: 'Empowering Future Leaders',
    heroSubtitle: 'Trishan Academy is dedicated to nurturing young minds through innovative education, personalized learning, and holistic development.',
    aboutText: '',
    contactEmail: 'info@trishanacademy.edu',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Education Street, Learning City, LC 12345'
  })

  // Navigation State
  const [navigation, setNavigation] = useState([
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/programs', label: 'Programs' },
    { path: '/contact', label: 'Contact' }
  ])

  // Social Links State
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: ''
  })

  // Images State
  const [images, setImages] = useState({
    logo: '',
    favicon: '',
    heroImage: ''
  })

  // Google Maps State
  const [googleMaps, setGoogleMaps] = useState({
    embedUrl: '',
    address: ''
  })

  // Gallery State
  const [gallery, setGallery] = useState([])

  // Page Content State - Comprehensive structure
  const [pageContent, setPageContent] = useState({
    home: {
      hero: { title: '', subtitle: '', backgroundImage: '', backgroundColor: '', backgroundGradient: '', badgeText: '' },
      stats: { sectionTitle: '', backgroundColor: '', backgroundImage: '', items: [] },
      features: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] },
      programs: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] },
      testimonials: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] },
      cta: { title: '', subtitle: '', backgroundColor: '', backgroundImage: '', buttonText: '' }
    },
    about: {
      hero: { title: '', subtitle: '', backgroundImage: '', backgroundColor: '', backgroundGradient: '' },
      mission: { title: '', content: '', backgroundColor: '', backgroundImage: '' },
      vision: { title: '', content: '', backgroundColor: '', backgroundImage: '' },
      history: { sectionTitle: '', content: '', backgroundColor: '', backgroundImage: '' },
      values: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] },
      achievements: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] }
    },
    programs: {
      hero: { title: '', subtitle: '', backgroundImage: '', backgroundColor: '', backgroundGradient: '' },
      academic: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] },
      extracurricular: { sectionTitle: '', subtitle: '', backgroundColor: '', backgroundImage: '', items: [] }
    },
    contact: {
      hero: { title: '', subtitle: '', backgroundImage: '', backgroundColor: '', backgroundGradient: '' },
      form: { title: '', backgroundColor: '', backgroundImage: '' },
      info: { backgroundColor: '', backgroundImage: '', address: '', phone: '', email: '', officeHours: '' },
      map: { backgroundColor: '', backgroundImage: '' }
    },
    gallery: {
      hero: { title: '', subtitle: '', backgroundImage: '', backgroundColor: '', backgroundGradient: '' },
      filter: { backgroundColor: '' },
      stats: { backgroundColor: '', backgroundImage: '', items: [] }
    }
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/login')
      return
    }

    // Load existing data
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data) {
        if (data.content) setContent(data.content)
        if (data.navigation) setNavigation(data.navigation)
        if (data.socialLinks) setSocialLinks(data.socialLinks)
        if (data.images) setImages(data.images)
        if (data.googleMaps) setGoogleMaps(data.googleMaps)
        if (data.gallery) setGallery(data.gallery)
        if (data.pageContent) {
          // Deep merge function to preserve nested structure
          const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item)
          
          const mergeDeep = (target, source) => {
            if (!source) return target
            const output = { ...target }
            if (isObject(target) && isObject(source)) {
              Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                  if (!(key in target) || !isObject(target[key])) {
                    output[key] = { ...source[key] }
                  } else {
                    output[key] = mergeDeep(target[key], source[key])
                  }
                } else if (Array.isArray(source[key])) {
                  // Handle arrays - use source if it has items, otherwise keep target
                  output[key] = source[key].length > 0 ? source[key] : (target[key] || [])
                } else {
                  // For strings and other primitives, use source if it has value
                  output[key] = source[key] || target[key] || ''
                }
              })
            }
            return output
          }
          
          // Merge loaded data with default structure
          try {
            const merged = mergeDeep(pageContent, data.pageContent)
            setPageContent(merged)
            console.log('Loaded page content:', merged)
          } catch (error) {
            console.error('Error merging page content:', error)
            // Fallback: use loaded data directly if merge fails
            setPageContent(data.pageContent)
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/login')
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          content,
          navigation,
          socialLinks,
          images,
          googleMaps,
          gallery,
          pageContent
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (response.ok) {
        setImages(prev => ({ ...prev, [type]: data.url }))
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    }
  }

  const addNavItem = () => {
    setNavigation([...navigation, { path: '', label: '' }])
  }

  const removeNavItem = (index) => {
    setNavigation(navigation.filter((_, i) => i !== index))
  }

  const updateNavItem = (index, field, value) => {
    const updated = [...navigation]
    updated[index][field] = value
    setNavigation(updated)
  }

  const addGalleryItem = () => {
    setGallery([...gallery, { title: '', description: '', category: 'events', image: '' }])
  }

  const removeGalleryItem = (index) => {
    setGallery(gallery.filter((_, i) => i !== index))
  }

  const updateGalleryItem = (index, field, value) => {
    const updated = [...gallery]
    updated[index][field] = value
    setGallery(updated)
  }

  const handleGalleryImageUpload = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', 'gallery')

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (response.ok) {
        const updated = [...gallery]
        updated[index].image = data.url
        setGallery(updated)
        setMessage({ type: 'success', text: 'Gallery image uploaded successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    }
  }

  const handlePageImageUpload = async (file, identifier) => {
    if (!file) return null

    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', `page-${identifier}`)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        return data.url
      } else {
        setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
        return null
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
      return null
    }
  }

  const [activePageTab, setActivePageTab] = useState('home')

  const tabs = [
    { id: 'content', label: 'General', icon: Settings },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'social', label: 'Social Links', icon: LinkIcon },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'maps', label: 'Google Maps', icon: MapPin }
  ]

  // Handle page tab switching - set default to home when pages tab is clicked
  useEffect(() => {
    if (activeTab === 'pages') {
      setActiveTab('pages-home')
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Message Banner */}
      {message.text && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4`}>
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Pages Tab */}
        {(activeTab === 'pages' || activeTab.startsWith('pages-')) && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Page Content Management</h2>
            
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-4">
                {['home', 'about', 'programs', 'contact', 'gallery'].map((page) => (
                  <button
                    key={page}
                    onClick={() => setActiveTab(`pages-${page}`)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === `pages-${page}` || (activeTab === 'pages' && page === 'home')
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Comprehensive Page Editors */}
            {(activeTab === 'pages' || activeTab === 'pages-home') && (
              <ComprehensivePageEditor
                pageName="home"
                pageData={pageContent.home || {}}
                onUpdate={(updated) => setPageContent({ ...pageContent, home: updated })}
                onImageUpload={handlePageImageUpload}
              />
            )}

            {activeTab === 'pages-about' && (
              <ComprehensivePageEditor
                pageName="about"
                pageData={pageContent.about || {}}
                onUpdate={(updated) => setPageContent({ ...pageContent, about: updated })}
                onImageUpload={handlePageImageUpload}
              />
            )}

            {activeTab === 'pages-programs' && (
              <ComprehensivePageEditor
                pageName="programs"
                pageData={pageContent.programs || {}}
                onUpdate={(updated) => setPageContent({ ...pageContent, programs: updated })}
                onImageUpload={handlePageImageUpload}
              />
            )}

            {activeTab === 'pages-contact' && (
              <ComprehensivePageEditor
                pageName="contact"
                pageData={pageContent.contact || {}}
                onUpdate={(updated) => setPageContent({ ...pageContent, contact: updated })}
                onImageUpload={handlePageImageUpload}
              />
            )}

            {activeTab === 'pages-gallery' && (
              <ComprehensivePageEditor
                pageName="gallery"
                pageData={pageContent.gallery || {}}
                onUpdate={(updated) => setPageContent({ ...pageContent, gallery: updated })}
                onImageUpload={handlePageImageUpload}
              />
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Content Management</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Name</label>
                <input
                  type="text"
                  value={content.schoolName}
                  onChange={(e) => setContent({ ...content, schoolName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={content.tagline}
                  onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
                <textarea
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Text</label>
                <textarea
                  value={content.aboutText}
                  onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={content.contactEmail}
                  onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={content.contactPhone}
                  onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={content.address}
                  onChange={(e) => setContent({ ...content, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Navigation Menu</h2>
              <button
                onClick={addNavItem}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {navigation.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Path</label>
                      <input
                        type="text"
                        value={item.path}
                        onChange={(e) => updateNavItem(index, 'path', e.target.value)}
                        placeholder="/about"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                        placeholder="About"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeNavItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Gallery Management</h2>
              <button
                onClick={addGalleryItem}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Gallery Item</span>
              </button>
            </div>

            <div className="space-y-6">
              {gallery.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Item {index + 1}</h3>
                    <button
                      onClick={() => removeGalleryItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                        placeholder="Annual Science Fair"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select
                        value={item.category || 'events'}
                        onChange={(e) => updateGalleryItem(index, 'category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="events">Events</option>
                        <option value="activities">Activities</option>
                        <option value="classroom">Classroom</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateGalleryItem(index, 'description', e.target.value)}
                        rows="3"
                        placeholder="Students showcasing innovative projects"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGalleryImageUpload(e, index)}
                          className="hidden"
                          id={`gallery-upload-${index}`}
                        />
                        <label
                          htmlFor={`gallery-upload-${index}`}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer flex items-center space-x-2"
                        >
                          <Upload className="h-5 w-5" />
                          <span>Upload Image</span>
                        </label>
                        {item.image && (
                          <div className="relative">
                            <NextImage 
                              src={item.image} 
                              alt={item.title || 'Gallery'} 
                              width={200} 
                              height={150} 
                              className="rounded-lg border border-gray-300" 
                              unoptimized 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {gallery.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No gallery items yet. Add your first item!</p>
                  <button
                    onClick={addGalleryItem}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Gallery Item
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Links</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Facebook className="h-6 w-6 text-blue-600" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Instagram className="h-6 w-6 text-pink-600" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourpage"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Youtube className="h-6 w-6 text-red-600" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/yourchannel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Linkedin className="h-6 w-6 text-blue-700" />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Image Management</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Logo</span>
                  </label>
                  {images.logo && (
                    <NextImage src={images.logo} alt="Logo" width={64} height={64} className="h-16 w-auto" unoptimized />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Favicon</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'favicon')}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label
                    htmlFor="favicon-upload"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Favicon</span>
                  </label>
                  {images.favicon && (
                    <NextImage src={images.favicon} alt="Favicon" width={32} height={32} className="h-8 w-8" unoptimized />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImage')}
                    className="hidden"
                    id="hero-upload"
                  />
                  <label
                    htmlFor="hero-upload"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Hero Image</span>
                  </label>
                  {images.heroImage && (
                    <NextImage src={images.heroImage} alt="Hero" width={256} height={128} className="h-32 w-auto rounded-lg" unoptimized />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Maps Tab */}
        {activeTab === 'maps' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Google Maps Integration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Embed URL</label>
                <input
                  type="url"
                  value={googleMaps.embedUrl}
                  onChange={(e) => setGoogleMaps({ ...googleMaps, embedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Get the embed URL from Google Maps → Share → Embed a map
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address (for display)</label>
                <input
                  type="text"
                  value={googleMaps.address}
                  onChange={(e) => setGoogleMaps({ ...googleMaps, address: e.target.value })}
                  placeholder="123 Education Street, Learning City, LC 12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {googleMaps.embedUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <iframe
                      src={googleMaps.embedUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

