import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Award, 
  GraduationCap, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react'

const Home = () => {
  const features = [
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

  const stats = [
    { number: '5000+', label: 'Students Enrolled' },
    { number: '200+', label: 'Expert Teachers' },
    { number: '95%', label: 'Success Rate' },
    { number: '25+', label: 'Years of Excellence' }
  ]

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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                🎓 Premier Educational Institution
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Empowering Future
              <span className="block gradient-text">Leaders</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Excellence Academy is dedicated to nurturing young minds through innovative 
              education, personalized learning, and holistic development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2"
              >
                <span>Enroll Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg border-2 border-primary-600 hover:bg-primary-50 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Excellence Academy</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide an exceptional educational experience that prepares students for success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive educational programs designed for every stage of learning
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border-2 border-primary-100 hover:border-primary-300 transition-all hover:shadow-xl group"
              >
                <div className="bg-primary-600 w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{program.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                <Link
                  to="/programs"
                  className="text-primary-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Parents & Students Say
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Hear from our community about their experience at Excellence Academy
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-primary-50 mb-6 leading-relaxed">
                  "Excellence Academy has transformed my child's learning experience. 
                  The teachers are dedicated, and the curriculum is outstanding."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {i === 1 ? 'SM' : i === 2 ? 'JD' : 'RK'}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {i === 1 ? 'Sarah Mitchell' : i === 2 ? 'John Davis' : 'Rachel Kim'}
                    </div>
                    <div className="text-primary-200 text-sm">Parent</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Excellence Academy today and give your child the gift of exceptional education
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

