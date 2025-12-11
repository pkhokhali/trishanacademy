'use client'

import { useEffect, useState } from 'react'

export default function PageRenderer({ page }) {
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">The page you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  if (!page.contentBlocks || page.contentBlocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{page.title || 'Empty Page'}</h1>
          <p className="text-gray-600">This page has no content yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {page.contentBlocks
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((block, index) => (
          <BlockRenderer key={block.id || `block-${index}`} block={block} />
        ))}
    </div>
  )
}

function BlockRenderer({ block }) {
  switch (block.type) {
    case 'richtext':
      return (
        <div 
          className="prose max-w-none p-8"
          dangerouslySetInnerHTML={{ __html: block.props?.content || '' }}
        />
      )
    
    case 'image':
      if (!block.props?.url) return null
      return (
        <figure className={`p-8 ${block.props?.align === 'center' ? 'text-center' : ''}`}>
          <img
            src={block.props.url}
            alt={block.props.alt || ''}
            className={`${
              block.props.size === 'full' ? 'w-full' : 'max-w-full'
            } ${block.props.align === 'left' ? 'float-left mr-4' : ''} ${
              block.props.align === 'right' ? 'float-right ml-4' : ''
            }`}
          />
          {block.props.caption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center">
              {block.props.caption}
            </figcaption>
          )}
        </figure>
      )
    
    case 'gallery':
      if (!block.props?.images || block.props.images.length === 0) return null
      return (
        <div className={`grid gap-4 p-8 grid-cols-${block.props.columns || 3}`}>
          {block.props.images.map((img, i) => (
            <img
              key={i}
              src={img.url || img}
              alt={img.alt || ''}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      )
    
    case 'carousel':
      if (!block.props?.slides || block.props.slides.length === 0) return null
      return (
        <CarouselBlock block={block} />
      )
    
    case 'video':
      if (!block.props?.url) return null
      return (
        <div className="p-8">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={block.props.url}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )
    
    case 'button':
      return (
        <div className="p-8 text-center">
          <a
            href={block.props?.url || '#'}
            target={block.props?.target || '_self'}
            className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
              block.props?.style === 'primary'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {block.props?.label || 'Button'}
          </a>
        </div>
      )
    
    case 'spacer':
      return (
        <div style={{ height: `${block.props?.height || 40}px` }} />
      )
    
    case 'html':
      return (
        <div 
          className="p-8"
          dangerouslySetInnerHTML={{ __html: block.props?.content || '' }}
        />
      )
    
    case 'hero':
      return (
        <HeroBlock block={block} />
      )
    
    case 'columns':
      return (
        <div className={`grid grid-cols-${block.props?.columns || 2} gap-4 p-8`}>
          {block.props?.content?.map((col, i) => (
            <div key={i}>
              {col.blocks?.map((subBlock, j) => (
                <BlockRenderer key={j} block={subBlock} />
              ))}
            </div>
          ))}
        </div>
      )
    
    default:
      return null
  }
}

function CarouselBlock({ block }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = block.props?.slides || []

  useEffect(() => {
    if (!block.props?.autoplay) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (block.props?.loop) {
          return (prev + 1) % slides.length
        }
        return prev < slides.length - 1 ? prev + 1 : prev
      })
    }, block.props?.autoplaySpeed || 3000)
    
    return () => clearInterval(interval)
  }, [block.props?.autoplay, block.props?.autoplaySpeed, block.props?.loop, slides.length])

  if (slides.length === 0) return null

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full relative">
              <img
                src={slide.url || slide}
                alt={slide.alt || ''}
                className="w-full h-96 object-cover"
              />
              {slide.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <div dangerouslySetInnerHTML={{ __html: slide.caption }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {block.props?.arrows && slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full"
          >
            →
          </button>
        </>
      )}
      
      {block.props?.dots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full ${
                i === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function HeroBlock({ block }) {
  const props = block.props || {}
  const style = {
    minHeight: props.height || '100vh',
    backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
    backgroundColor: props.backgroundColor || undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }

  if (props.overlay?.enabled) {
    style.position = 'relative'
  }

  return (
    <div style={style}>
      {props.overlay?.enabled && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: props.overlay.color || '#000000',
            opacity: props.overlay.opacity || 0.5
          }}
        />
      )}
      <div className="relative z-10 text-center p-8 max-w-4xl mx-auto">
        {props.title && (
          <h1 className="text-5xl font-bold text-white mb-4">{props.title}</h1>
        )}
        {props.subtitle && (
          <p className="text-xl text-white">{props.subtitle}</p>
        )}
      </div>
    </div>
  )
}

