import React, { useState, useEffect } from 'react'
import HomeLayout from './HomeLayout'

const HomePage = () => {
  const [isVisible] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const services = [
    {
      icon: '🌐',
      title: 'Web Development',
      description: 'Custom websites built with modern technologies and best practices for optimal performance.',
      features: ['React & Next.js', 'Responsive Design', 'SEO Optimized'],
      gradientClass: 'from-blue-500/20 to-cyan-500/20',
      borderGradientClass: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/50'
    },
    {
      icon: '🎨',
      title: 'UI / UX Design',
      description: 'Beautiful and intuitive designs that enhance user experience and drive engagement.',
      features: ['User Research', 'Prototyping', 'Design Systems'],
      gradientClass: 'from-purple-500/20 to-pink-500/20',
      borderGradientClass: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/50'
    },
    {
      icon: '📱',
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      features: ['React Native', 'iOS & Android', 'App Store Optimization'],
      gradientClass: 'from-green-500/20 to-emerald-500/20',
      borderGradientClass: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/50'
    },
    {
      icon: '🚀',
      title: 'SEO Optimization',
      description: 'Boost your online visibility and drive organic traffic with proven SEO strategies.',
      features: ['Keyword Research', 'Content Strategy', 'Analytics & Reporting'],
      gradientClass: 'from-orange-500/20 to-red-500/20',
      borderGradientClass: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/50'
    }
  ]

  const features = [
    {
      title: 'Fast & Reliable',
      description: 'Lightning-fast load times and 99.9% uptime guarantee',
      icon: '⚡',
      color: 'text-yellow-400'
    },
    {
      title: 'Secure & Scalable',
      description: 'Enterprise-grade security with scalable infrastructure',
      icon: '🔒',
      color: 'text-green-400'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock support to help you succeed',
      icon: '💬',
      color: 'text-blue-400'
    },
    {
      title: 'Cost Effective',
      description: 'Competitive pricing without compromising quality',
      icon: '💰',
      color: 'text-purple-400'
    }
  ]

  const stats = [
    { number: '500+', label: 'Projects Completed', icon: '✨' },
    { number: '200+', label: 'Happy Clients', icon: '😊' },
    { number: '10+', label: 'Years Experience', icon: '🎯' },
    { number: '50+', label: 'Team Members', icon: '👥' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'NovaRoSolution transformed our online presence. Their attention to detail and professionalism is unmatched.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Founder, DesignCo',
      content: 'The team delivered beyond our expectations. Our website traffic increased by 300% in just 3 months!',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      content: 'Outstanding service and support. They truly understand our business needs and deliver results.',
      rating: 5,
      avatar: '👩‍💼'
    }
  ]

  return (
    <HomeLayout>
      <div className="w-full min-h-screen text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
          <div 
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-red-500/30 via-pink-500/30 to-purple-500/30 blur-3xl transition-all duration-700 ease-out"
            style={{
              left: `${mousePosition.x / 20}px`,
              top: `${mousePosition.y / 20}px`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Section */}
        <section className={`relative w-full min-h-screen flex items-center justify-center px-4 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                ✨ Welcome to the Future of Digital Solutions
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                NovaRo
              </span>
              <span className="block bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Solution
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Transforming ideas into <span className="text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text font-semibold">digital excellence</span> with cutting-edge technology and innovative design
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-red-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="px-10 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
                Explore Services
              </button>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative w-full py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Our Impact
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:border-white/40 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                      {stat.icon}
                    </div>
                    <div className="text-5xl md:text-6xl font-black mb-3 text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-base md:text-lg font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative w-full py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">Our </span>
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Services</span>
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto">
                Comprehensive solutions tailored to your business needs
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full mt-6"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-7xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        {service.icon}
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradientClass} border-2 border-transparent group-hover:border-white/30 transition-all duration-500`}></div>
                    </div>
                    <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                          <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.gradientClass} flex items-center justify-center mr-3 text-white text-sm font-bold`}>
                            ✓
                          </span>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${service.borderGradientClass} font-bold hover:shadow-lg ${service.shadowColor} transition-all duration-300 transform group-hover:scale-105`}>
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative w-full py-24 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Why </span>
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">Choose Us</span>
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto">
                We deliver excellence in every project
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full mt-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:border-white/40 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  <div className="relative z-10">
                    <div className={`text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative w-full py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">What Our </span>
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Clients Say</span>
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto">
                Trusted by businesses worldwide
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full mt-6"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl transform group-hover:scale-110 transition-transform duration-500">
                        {testimonial.avatar}
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-2xl transform group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-6 italic text-lg leading-relaxed group-hover:text-white transition-colors">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t border-white/20 pt-6">
                      <div className="font-black text-xl mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-24 px-4">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-pink-600/30 to-purple-600/30 blur-3xl rounded-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">Ready to </span>
                  <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Transform</span>
                  <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">?</span>
                </h2>
                <p className="text-gray-300 text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
                  Let's work together to create something amazing. Get in touch with us today and take the first step towards <span className="text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text font-semibold">digital excellence</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button className="group relative px-10 py-5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl font-black text-lg overflow-hidden transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-red-500/50">
                    <span className="relative z-10 flex items-center gap-2">
                      Start Your Project
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-black text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                    Schedule a Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="relative w-full py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Get In </span>
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto">
                Have a question? We'd love to hear from you
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full mt-6"></div>
            </div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-10 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
              <form className="relative z-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-gray-300 mb-3 font-semibold text-lg">Name</label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500 text-lg"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-gray-300 mb-3 font-semibold text-lg">Email</label>
                    <input
                      type="email"
                      className="w-full px-5 py-4 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500 text-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-gray-300 mb-3 font-semibold text-lg">Subject</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500 text-lg"
                    placeholder="What's this about?"
                  />
                </div>
                <div className="group">
                  <label className="block text-gray-300 mb-3 font-semibold text-lg">Message</label>
                  <textarea
                    rows="6"
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300 text-white placeholder-gray-500 resize-none text-lg"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="group relative w-full px-10 py-5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl font-black text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Message
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  )
}

export default HomePage