'use client'

import { Award, Users, Target, Heart, BookOpen, GraduationCap } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, setting high standards for our students and ourselves.'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Integrity',
      description: 'We uphold the highest ethical standards and foster a culture of honesty and respect.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Innovation',
      description: 'We embrace innovative teaching methods and technologies to enhance learning experiences.'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Diversity',
      description: 'We celebrate diversity and create an inclusive environment where everyone can thrive.'
    }
  ]

  const achievements = [
    { number: '25+', label: 'Years of Excellence' },
    { number: '5000+', label: 'Graduates' },
    { number: '50+', label: 'Awards Won' },
    { number: '95%', label: 'College Acceptance' }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Trishan Academy</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Empowering students to achieve their full potential through innovative education 
            and personalized learning experiences.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border-2 border-primary-100">
              <div className="bg-primary-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To provide a world-class education that nurtures intellectual curiosity, 
                fosters critical thinking, and prepares students to become responsible global 
                citizens and future leaders.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border-2 border-primary-100">
              <div className="bg-primary-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be recognized as a premier educational institution that transforms lives 
                through excellence in teaching, innovative programs, and a commitment to 
                holistic student development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Story</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Trishan Academy was founded in 1998 with a simple yet powerful vision: 
                to create an educational environment where every student can thrive and 
                reach their full potential.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Over the past 25 years, we have grown from a small institution to a 
                comprehensive educational center serving thousands of students. Our commitment 
                to academic excellence, combined with innovative teaching methods and a 
                supportive community, has made us a leader in education.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Today, Trishan Academy continues to evolve, embracing new technologies 
                and methodologies while maintaining our core values of excellence, integrity, 
                and student-centered learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-20 h-20 rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Achievements</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Celebrating milestones and successes that define our journey
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{achievement.number}</div>
                <div className="text-primary-100">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

