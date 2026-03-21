import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'
import { FaUserCircle, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa'
import { fetchSiteContent } from '../../config/api'
import { useTheme } from '../../context/ThemeContext'
import { gsap } from 'gsap'

const HomeLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, isEmployee, isCreator, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [announcement, setAnnouncement] = useState({
    enabled: false,
    text: '',
  })
  const contentRef = useRef(null)
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/contact' },
  ]

  const isActiveRoute = (to) =>
    to === '/'
      ? location.pathname === '/'
      : location.pathname === to || location.pathname.startsWith(`${to}/`)

  const navLinkClass = (to) =>
    `app-link-hover px-4 py-2 rounded-xl transition-colors duration-300 ${
      isActiveRoute(to) ? 'app-link-active' : ''
    }`

  const handleRequestLogout = () => {
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
    setIsMenuOpen(false)
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  useEffect(() => {
    let isMounted = true
    async function loadAnnouncement() {
      try {
        const content = await fetchSiteContent()
        if (!isMounted) return
        setAnnouncement({
          enabled: content?.uiSettings?.announcementEnabled ?? false,
          text: String(content?.uiSettings?.announcementText || '').trim(),
        })
      } catch {
        if (!isMounted) return
        setAnnouncement({ enabled: false, text: '' })
      }
    }
    loadAnnouncement()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!contentRef.current) return undefined

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined
    const allowPointerTilt = window.matchMedia('(pointer:fine)').matches && window.innerWidth >= 1024

    const cardSelector =
      '.premium-card, .page-content-card, .projects-card, .project-chat-message, .project-chat-tip, .project-chat-benefit'
    const interactiveSelector =
      'button, .app-link-hover, .projects-view-link, .project-chat-primary-btn, .theme-toggle-btn'

    const activeCards = new Set()
    const activeInteractive = new WeakSet()
    let hoveredCard = null
    let rafId = 0
    const pointer = { x: 0, y: 0 }

    // Visible page intro on each route for clear UX feedback.
    const introTargets = contentRef.current.querySelectorAll('.js-reveal, .page-hero-shell, .premium-card')
    if (introTargets.length > 0) {
      gsap.fromTo(
        introTargets,
        { autoAlpha: 0, y: 26, filter: 'blur(5px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.04,
          clearProps: 'opacity,transform,filter,visibility',
        },
      )
    }

    const applyPointerTilt = () => {
      rafId = 0
      if (!(hoveredCard instanceof HTMLElement)) return
      const bounds = hoveredCard.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const offsetX = (pointer.x - bounds.left) / bounds.width - 0.5
      const offsetY = (pointer.y - bounds.top) / bounds.height - 0.5

      gsap.set(hoveredCard, {
        rotateY: offsetX * 8,
        rotateX: offsetY * -8,
        y: -8,
        scale: 1.015,
        transformPerspective: 900,
        transformOrigin: 'center',
      })
    }

    const handlePointerMove = (event) => {
      if (!allowPointerTilt) return
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (rafId) return
      rafId = window.requestAnimationFrame(applyPointerTilt)
    }

    const handlePointerOver = (event) => {
      if (!allowPointerTilt) return
      const target = event.target instanceof Element ? event.target.closest(cardSelector) : null
      if (!(target instanceof HTMLElement)) return
      if (hoveredCard === target) return
      hoveredCard = target
      activeCards.add(target)
      gsap.to(target, {
        y: -6,
        scale: 1.01,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const handlePointerOut = (event) => {
      if (!allowPointerTilt) return
      const target = event.target instanceof Element ? event.target.closest(cardSelector) : null
      if (!(target instanceof HTMLElement)) return
      if (target.contains(event.relatedTarget)) return
      if (hoveredCard === target) hoveredCard = null
      activeCards.delete(target)
      gsap.to(target, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        scale: 1,
        duration: 0.38,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const handleMouseOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null
      if (!(target instanceof HTMLElement)) return
      if (activeInteractive.has(target)) return
      activeInteractive.add(target)
      gsap.to(target, {
        y: -3,
        scale: 1.02,
        duration: 0.2,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const handleMouseOut = (event) => {
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null
      if (!(target instanceof HTMLElement)) return
      if (target.contains(event.relatedTarget)) return
      gsap.to(target, {
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const host = contentRef.current
    host.addEventListener('pointermove', handlePointerMove, { passive: true })
    host.addEventListener('pointerover', handlePointerOver)
    host.addEventListener('pointerout', handlePointerOut)
    host.addEventListener('mouseover', handleMouseOver)
    host.addEventListener('mouseout', handleMouseOut)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      host.removeEventListener('pointermove', handlePointerMove)
      host.removeEventListener('pointerover', handlePointerOver)
      host.removeEventListener('pointerout', handlePointerOut)
      host.removeEventListener('mouseover', handleMouseOver)
      host.removeEventListener('mouseout', handleMouseOut)
      activeCards.forEach((card) => {
        gsap.set(card, { rotateX: 0, rotateY: 0, y: 0, scale: 1, clearProps: 'transform' })
      })
    }
  }, [location.pathname])

  return (
    <div className="app-shell relative flex items-start min-h-screen flex-col overflow-x-hidden transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="app-glow absolute inset-0" />
      </div>
      {announcement.enabled && announcement.text && (
        <div className="w-full px-2 md:px-3">
          <div className="mx-auto mt-3 w-full max-w-[1260px] rounded-2xl border border-pink-400/25 bg-linear-to-r from-red-500/15 via-pink-500/15 to-purple-500/15 px-4 py-2 text-center text-sm text-slate-100 backdrop-blur-xl">
            {announcement.text}
          </div>
        </div>
      )}
      <header className="w-full sticky top-3 z-40 px-2 md:px-3">
        <div className="app-nav-card mx-auto mt-3 mb-2 flex w-full max-w-[1260px] items-center justify-between rounded-2xl px-4 py-2.5 backdrop-blur-2xl md:px-5">
          <Link to="/" className="app-brand-title inline-flex items-center text-lg md:text-xl font-semibold tracking-wide">
            <span className="text-red-600">Nova</span>
            <span className="text-white">RoSolution</span>
          </Link>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-btn app-link-hover inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 lg:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes className="text-base" /> : <FaBars className="text-base" />}
        </button>
        {/* Desktop Navigation */}
        <nav className="ml-auto mr-1 hidden flex-wrap items-center gap-1 text-sm lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn mr-2 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FaSun className="text-[0.8rem]" /> : <FaMoon className="text-[0.8rem]" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={`${navLinkClass(item.to)} nav-link`}>
              <span>{item.label}</span>
              {isActiveRoute(item.to) && <span className="nav-active-indicator" aria-hidden />}
            </Link>
          ))}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                Admin
              </Link>
            </>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={navLinkClass('/login')}>Login</Link>
              <Link to="/register" className="app-link-hover px-4 py-2 rounded-xl border border-white/20 bg-white/10 transition-colors duration-300">Register</Link>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              {isEmployee && (
                <Link to="/employee/tasks" className={navLinkClass('/employee/tasks')}>
                  Daily Tasks
                </Link>
              )}
              {isCreator && (
                <Link to="/creator/studio" className={navLinkClass('/creator/studio')}>
                  Creator Studio
                </Link>
              )}
              <Link to="/project-chat" className={navLinkClass('/project-chat')}>
                Project Chat
              </Link>
              <Link to="/profile" className="app-link-hover inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 transition-colors duration-300">
                <FaUserCircle className="text-base text-pink-300" />
                <span>Profile</span>
              </Link>
              <button
                type="button"
                onClick={handleRequestLogout}
                className="app-link-hover px-4 py-2 rounded-xl transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
        </div>
      </header>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="mobile-menu-overlay fixed inset-0 z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        <div className="app-mobile-card mobile-menu-panel mx-auto mt-1 w-full max-w-[1260px] rounded-2xl p-4 backdrop-blur-lg lg:hidden">
          <nav className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn mb-1 inline-flex items-center gap-2 text-left px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors"
            >
              {isDark ? <FaSun className="text-[0.8rem]" /> : <FaMoon className="text-[0.8rem]" />}
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </button>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute(item.to) ? 'app-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute('/admin/dashboard') ? 'app-link-active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </>
            )}
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute('/login') ? 'app-link-active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="app-link-hover px-4 py-2 rounded-md transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {isEmployee && (
                  <Link 
                    to="/employee/tasks" 
                    className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute('/employee/tasks') ? 'app-link-active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daily Tasks
                  </Link>
                )}
                {isCreator && (
                  <Link
                    to="/creator/studio"
                    className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute('/creator/studio') ? 'app-link-active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Creator Studio
                  </Link>
                )}
                <Link 
                  to="/project-chat" 
                  className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute('/project-chat') ? 'app-link-active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Project Chat
                </Link>
                <Link 
                  to="/profile" 
                  className={`app-link-hover px-4 py-2 rounded-md transition-colors duration-300 ${isActiveRoute('/profile') ? 'app-link-active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleRequestLogout}
                  className="app-link-hover text-left px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
        </>
      )}
      <div ref={contentRef} className="w-full">
        {children}
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-white/12 bg-slate-950/95 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-slate-100">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to logout from your account?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelLogout}
                className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="inline-flex items-center rounded-xl border border-red-400/35 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/25"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
export default HomeLayout