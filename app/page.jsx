'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  Award, 
  GraduationCap, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Sparkles,
  Zap,
  Heart,
  Target,
  Play,
  Calendar,
  Clock
} from 'lucide-react'

export default function Home() {
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPageContent()
  }, [])

  const loadPageContent = async () => {
    try {
      const response = await fetch('/api/settings', {
        cache: 'no-store' // Prevent caching
      })
      const settings = await response.json()
      
      // Merge pageContent.home with content object for backward compatibility
      const homePageContent = settings.pageContent?.home || {}
      const generalContent = settings.content || {}
      
      // Prioritize pageContent.home.hero, but fallback to content if needed
      // Always ensure hero object exists
      if (!homePageContent.hero) {
        homePageContent.hero = {}
      }
      
      // Use pageContent.home.hero as primary source, fallback to content
      homePageContent.hero = {
        ...homePageContent.hero,
        title: homePageContent.hero.title || generalContent.heroTitle || '',
        subtitle: homePageContent.hero.subtitle || generalContent.heroSubtitle || ''
      }
      
      console.log('Homepage loaded data:', homePageContent)
      console.log('Hero data:', homePageContent.hero)
      setPageData(homePageContent)
    } catch (error) {
      console.error('Error loading page content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default content if not loaded or not set
  const hero = pageData?.hero || {}
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Current hero object:', hero)
    console.log('Hero title:', hero.title)
    console.log('Hero subtitle:', hero.subtitle)
  }
  const statsData = pageData?.stats || {}
  const featuresData = pageData?.features || {}
  const programsData = pageData?.programs || {}
  const testimonialsData = pageData?.testimonials || {}

  const features = featuresData.items && featuresData.items.length > 0 
    ? featuresData.items.map((item, index) => ({
        icon: <BookOpen className="h-8 w-8" />,
        title: item.title || 'Feature',
        description: item.description || ''
      }))
    : [
        {
          icon: <BookOpen className="h-8 w-8" />,
          title: 'Quality Education',
          description: 'Comprehensive curriculum designed to foster critical thinking and creativity.'
        },
        {
          icon: <Users className="h-8 w-8" />,
          title: 'Expert Faculty',
          description: 'Dedicated teachers committed to student success and personal growth.'
        },
        {
          icon: <Award className="h-8 w-8" />,
          title: 'Academic Excellence',
          description: 'Consistently high achievement rates and outstanding student outcomes.'
        },
        {
          icon: <GraduationCap className="h-8 w-8" />,
          title: 'Holistic Development',
          description: 'Nurturing well-rounded individuals through diverse programs and activities.'
        }
      ]

  const stats = statsData.items && statsData.items.length > 0
    ? statsData.items.map((item, index) => ({
        number: item.number || '0',
        label: item.label || 'Stat',
        icon: <Users className="h-6 w-6" />,
        color: item.iconColor || 'from-blue-500 to-blue-600'
      }))
    : [
        { number: '5000+', label: 'Students Enrolled', icon: <Users className="h-6 w-6" />, color: 'from-blue-500 to-blue-600' },
        { number: '200+', label: 'Expert Teachers', icon: <GraduationCap className="h-6 w-6" />, color: 'from-purple-500 to-purple-600' },
        { number: '95%', label: 'Success Rate', icon: <TrendingUp className="h-6 w-6" />, color: 'from-green-500 to-green-600' },
        { number: '25+', label: 'Years of Excellence', icon: <Award className="h-6 w-6" />, color: 'from-orange-500 to-orange-600' }
      ]

  if (loading) {
    return <div className="pt-20 min-h-screen flex items-center justify-center">Loading...</div>
  }

  const programs = [
    {
      title: 'Elementary Education',
      description: 'Building strong foundations in core subjects with interactive learning.',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: 'Middle School',
      description: 'Expanding knowledge and developing critical thinking skills.',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'High School',
      description: 'Preparing students for college and future career success.',
      icon: <GraduationCap className="h-6 w-6" />
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : undefined,
          backgroundColor: hero.backgroundColor || undefined,
          background: hero.backgroundGradient || 'linear-gradient(to bottom right, #2563eb, #1e40af, #1e3a8a)'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-1/4 left-1/4 text-white/20 h-8 w-8 animate-pulse" />
          <Star className="absolute top-1/3 right-1/4 text-white/20 h-6 w-6 animate-pulse animation-delay-1000" />
          <Zap className="absolute bottom-1/4 left-1/3 text-white/20 h-7 w-7 animate-pulse animation-delay-2000" />
          <Heart className="absolute top-1/2 right-1/3 text-white/20 h-6 w-6 animate-pulse animation-delay-1500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="inline-block animate-bounce-slow">
              <span className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Premier Educational Institution</span>
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white">
              {hero.title || (
                <>
                  Empowering Future
                  <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-gradient">
                    Leaders
                  </span>
                </>
              )}
            </h1>
            {hero.subtitle ? (
              <div 
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: hero.subtitle }}
              />
            ) : (
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                Trishan Academy is dedicated to nurturing young minds through innovative 
                education, personalized learning, and holistic development.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/contact"
                className="group bg-white text-primary-600 px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 relative overflow-hidden"
              >
                <span className="relative z-10">Enroll Now</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/about"
                className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Watch Video</span>
              </Link>
            </div>
            
            {/* Quick Stats in Hero */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">25+</div>
                <div className="text-white/80 text-sm">Years Experience</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl font-bold text-white mb-1">5000+</div>
                <div className="text-white/80 text-sm">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-white/80 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundColor: statsData.backgroundColor || '#ffffff',
          backgroundImage: statsData.backgroundImage ? `url(${statsData.backgroundImage})` : undefined
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 via-transparent to-primary-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-24 relative"
        style={{
          backgroundColor: featuresData.backgroundColor || undefined,
          backgroundImage: featuresData.backgroundImage ? `url(${featuresData.backgroundImage})` : undefined,
          background: featuresData.backgroundImage ? undefined : (featuresData.backgroundColor || 'linear-gradient(to bottom, #f9fafb, #ffffff, #f9fafb)')
        }}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Why Choose <span className="gradient-text">Trishan Academy</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We provide an exceptional educational experience that prepares students for success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border border-gray-100 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                Our Offerings
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive educational programs designed for every stage of learning
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white via-primary-50/30 to-white p-8 rounded-3xl border-2 border-primary-100 hover:border-primary-400 transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{program.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                  <Link
                    href="/programs"
                    className="inline-flex items-center space-x-2 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-100/20 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pattern-dots"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                Testimonials
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              What Parents & Students Say
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Hear from our community about their experience at Trishan Academy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Mitchell', initials: 'SM', role: 'Parent', text: "Trishan Academy has transformed my child's learning experience. The teachers are dedicated, and the curriculum is outstanding. My daughter has grown so much!" },
              { name: 'John Davis', initials: 'JD', role: 'Parent', text: "The personalized attention and innovative teaching methods have made a huge difference. My son is more engaged and excited about learning than ever before." },
              { name: 'Rachel Kim', initials: 'RK', role: 'Parent', text: "We couldn't be happier with our choice. The holistic approach to education and the supportive community make Trishan Academy truly special." }
            ].map((testimonial, i) => (
              <div key={i} className="group bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 leading-relaxed text-lg italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center space-x-4 pt-4 border-t border-white/20">
                  <div className="w-14 h-14 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white/30">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{testimonial.name}</div>
                    <div className="text-primary-200 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6">
            <Target className="h-16 w-16 text-white/30 mx-auto animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join Trishan Academy today and give your child the gift of exceptional education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center space-x-3 bg-white text-primary-600 px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden"
            >
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Visit</span>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Open Enrollment</span>
            </div>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Limited Seats</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

