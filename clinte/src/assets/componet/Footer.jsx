import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Projects', to: '/projects' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ]
  
  const serviceTags = [
    { label: 'Web Development', to: '/services' },
    { label: 'UI / UX Design', to: '/services' },
    { label: 'App Development', to: '/services' },
    { label: 'SEO Optimization', to: '/services' },
  ]
  return (
    <footer className="w-full flex justify-center items-center mt-20 pb-8 px-2 md:px-0">
      <div className="app-footer-card footer-premium w-[96vw] max-w-[1260px] backdrop-blur-2xl rounded-3xl px-6 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-wide bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              NovaRoSolution
            </h2>
            <p className="text-gray-300 max-w-[280px] leading-relaxed">
              Building modern digital solutions and powerful web experiences.
            </p>
            <div className="footer-chip inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-slate-200">
              Premium Software Partner
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-gray-300">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <Link className="footer-link transition-colors duration-300 hover:text-pink-500" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <div className="flex flex-wrap gap-2">
              {serviceTags.map((service) => (
                <Link
                  key={service.label}
                  to={service.to}
                  className="footer-service-chip text-sm text-gray-300 px-3 py-1 rounded-full transition-colors duration-300 hover:text-pink-400"
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex flex-wrap gap-3 text-gray-300">
              <a href="#" className="footer-social-chip px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-colors duration-300 hover:text-pink-500">Instagram</a>
              <a href="#" className="footer-social-chip px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-colors duration-300 hover:text-pink-500">Twitter</a>
              <a href="#" className="footer-social-chip px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-colors duration-300 hover:text-pink-500">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} NovaRoSolution. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer