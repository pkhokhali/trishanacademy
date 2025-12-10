'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import { Camera, Image as ImageIcon, Video, Users, BookOpen, GraduationCap, Sparkles, Filter } from 'lucide-react'

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [galleryItems, setGalleryItems] = useState([])

  useEffect(() => {
    // Load gallery items from API
    loadGalleryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
      // Use default gallery items for demo
      setGalleryItems(getDefaultGalleryItems())
    }
  }

  const getDefaultGalleryItems = () => {
    return [
      { id: 1, category: 'events', title: 'Annual Science Fair', image: '/api/placeholder/600/400', description: 'Students showcasing innovative projects' },
      { id: 2, category: 'activities', title: 'Sports Day', image: '/api/placeholder/600/400', description: 'Annual sports competition' },
      { id: 3, category: 'classroom', title: 'Interactive Learning', image: '/api/placeholder/600/400', description: 'Students engaged in hands-on activities' },
      { id: 4, category: 'events', title: 'Graduation Ceremony', image: '/api/placeholder/600/400', description: 'Celebrating achievements' },
      { id: 5, category: 'activities', title: 'Art Exhibition', image: '/api/placeholder/600/400', description: 'Showcasing student creativity' },
      { id: 6, category: 'classroom', title: 'Lab Experiments', image: '/api/placeholder/600/400', description: 'Science laboratory sessions' },
      { id: 7, category: 'events', title: 'Cultural Festival', image: '/api/placeholder/600/400', description: 'Celebrating diversity and culture' },
      { id: 8, category: 'activities', title: 'Field Trip', image: '/api/placeholder/600/400', description: 'Educational excursions' },
      { id: 9, category: 'classroom', title: 'Group Projects', image: '/api/placeholder/600/400', description: 'Collaborative learning' },
    ]
  }

  const categories = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'events', label: 'Events', icon: Sparkles },
    { id: 'activities', label: 'Activities', icon: Users },
    { id: 'classroom', label: 'Classroom', icon: BookOpen },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="inline-block mb-6 animate-bounce-slow">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
              <Camera className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Our <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">Gallery</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Capturing moments of learning, growth, and achievement at Trishan Academy
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white border-b border-gray-200 sticky top-20 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No gallery items found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                    {item.image && item.image.startsWith('/') ? (
                      <NextImage
                        src={item.image}
                        alt={item.title || 'Gallery image'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-primary-400" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary-600 capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">{galleryItems.length}+</div>
              <div className="text-primary-100">Gallery Items</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Events Captured</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Activities</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Years of Memories</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

