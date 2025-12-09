import { BookOpen, Users, GraduationCap, Music, Palette, Sports, Code, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Programs = () => {
  const academicPrograms = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Elementary School',
      grade: 'Grades K-5',
      description: 'Building strong foundations in reading, writing, mathematics, science, and social studies through interactive and engaging methods.',
      features: [
        'Interactive Learning',
        'STEM Integration',
        'Reading Programs',
        'Art & Music'
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Middle School',
      grade: 'Grades 6-8',
      description: 'Expanding knowledge across all subjects while developing critical thinking, research skills, and independent learning.',
      features: [
        'Advanced Curriculum',
        'Project-Based Learning',
        'Technology Integration',
        'Leadership Development'
      ]
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: 'High School',
      grade: 'Grades 9-12',
      description: 'Comprehensive college-preparatory program with AP courses, career counseling, and personalized academic planning.',
      features: [
        'AP & Honors Courses',
        'College Preparation',
        'Career Counseling',
        'Internship Opportunities'
      ]
    }
  ]

  const extracurricularPrograms = [
    {
      icon: <Music className="h-8 w-8" />,
      title: 'Music & Arts',
      description: 'Explore creativity through music, visual arts, theater, and dance programs.'
    },
    {
      icon: <Sports className="h-8 w-8" />,
      title: 'Athletics',
      description: 'Competitive sports teams and physical fitness programs for all skill levels.'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'Technology',
      description: 'Coding clubs, robotics, and technology workshops to prepare for the digital future.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Language Programs',
      description: 'Learn new languages and explore different cultures through immersive programs.'
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: 'Visual Arts',
      description: 'Develop artistic skills through drawing, painting, sculpture, and digital art.'
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Comprehensive educational programs designed to nurture every aspect of student growth
          </p>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Academic <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Structured learning paths for every stage of education
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {academicPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-gray-100"
              >
                <div className="bg-gradient-to-br from-primary-600 to-primary-500 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                  {program.icon}
                </div>
                <div className="mb-2">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {program.grade}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{program.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="text-primary-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="text-primary-600 font-semibold flex items-center space-x-2 hover:space-x-3 transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extracurricular Programs */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Extracurricular <span className="gradient-text">Activities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enriching programs beyond the classroom to develop well-rounded individuals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extracurricularPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group"
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-14 h-14 rounded-lg flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Enroll?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover the perfect program for your child and start their journey to excellence
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span>Contact Us Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Programs

