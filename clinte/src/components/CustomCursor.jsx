import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const hoverTargetRef = useRef(null)
  const headingTargetRef = useRef(null)
  const cursorVisualStateRef = useRef({ hover: false, heading: false })
  const [isEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer:fine)').matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    if (!isEnabled) return undefined

    const cursor = cursorRef.current
    if (!cursor) return undefined

    document.body.classList.add('custom-cursor-enabled')
    const moveCursorX = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' })
    const moveCursorY = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' })

    const startX = window.innerWidth / 2
    const startY = window.innerHeight / 2

    gsap.set(cursor, { x: startX, y: startY, xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 1 })

    const setCursorVisual = ({ hover = false, heading = false }) => {
      const prevState = cursorVisualStateRef.current
      if (prevState.hover === hover && prevState.heading === heading) return
      cursorVisualStateRef.current = { hover, heading }
      cursor.classList.toggle('is-hover', hover || heading)
      cursor.classList.toggle('is-heading', heading)
      gsap.to(cursor, {
        scale: heading ? 3.1 : hover ? 2.3 : 1,
        duration: 0.3,
        ease: 'power3.out',
      })
    }

    const clearHeading = () => {
      if (!(headingTargetRef.current instanceof HTMLElement)) return
      headingTargetRef.current.classList.remove('cursor-heading-active')
      gsap.to(headingTargetRef.current, {
        x: 0,
        y: 0,
        duration: 0.38,
        ease: 'power3.out',
      })
      headingTargetRef.current = null
    }

    const handleMouseMove = (event) => {
      moveCursorX(event.clientX)
      moveCursorY(event.clientY)

      const hoverTarget = event.target instanceof Element ? event.target.closest('.cursor-hover') : null
      if (hoverTargetRef.current !== hoverTarget) {
        hoverTargetRef.current = hoverTarget
      }

      const headingTarget = event.target instanceof Element ? event.target.closest('.hero-main-heading') : null
      if (headingTargetRef.current !== headingTarget) {
        clearHeading()
        if (headingTarget instanceof HTMLElement) {
          headingTargetRef.current = headingTarget
          headingTarget.classList.add('cursor-heading-active')
        }
      }

      const isHover = Boolean(hoverTargetRef.current)
      const isHeading = Boolean(headingTargetRef.current)
      setCursorVisual({ hover: isHover, heading: isHeading })

      if (headingTargetRef.current instanceof HTMLElement) {
        const rect = headingTargetRef.current.getBoundingClientRect()
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.12
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.16
        gsap.set(headingTargetRef.current, {
          x: offsetX,
          y: offsetY,
        })
      }
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, {
        autoAlpha: 1,
        duration: 0.2,
        ease: 'power3.out',
      })
    }

    const handleMouseLeave = () => {
      hoverTargetRef.current = null
      clearHeading()
      setCursorVisual({ hover: false, heading: false })
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseleave', handleMouseLeave)
      clearHeading()
      document.body.classList.remove('custom-cursor-enabled')
    }
  }, [isEnabled])

  if (!isEnabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-130">
      <div ref={cursorRef} className="custom-cursor-main" />
    </div>
  )
}

export default CustomCursor
