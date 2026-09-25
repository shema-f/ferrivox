import React, { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  baseAlpha: number
  pulseSpeed: number
  pulsePhase: number
}

interface ParticleNetworkProps {
  className?: string
  particleCount?: number
  connectionDistance?: number
  mouseRadius?: number
}

const PALETTE = [
  { r: 59, g: 130, b: 246 },  // Electric Sapphire (#3b82f6)
  { r: 56, g: 189, b: 248 },  // Cyan Glow (#38bdf8)
  { r: 99, g: 102, b: 241 },  // Indigo Core (#6366f1)
  { r: 148, g: 163, b: 184 }, // Obsidian Steel (#94a3b8)
]

export default function ParticleNetwork({
  className = "",
  particleCount,
  connectionDistance = 120,
  mouseRadius = 150,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let isVisible = !document.hidden

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // Track viewport dimensions and scale
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const setSize = () => {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    setSize()

    // Adaptive particle count based on screen width
    const targetCount =
      particleCount ??
      (width < 640 ? 35 : width < 1024 ? 55 : 80)

    // Mouse coordinates in viewport
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    }

    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < targetCount; i++) {
      const paletteChoice =
        PALETTE[Math.floor(Math.random() * PALETTE.length)]
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.2 + 0.8, // 0.8px - 2.0px
        color: `${paletteChoice.r}, ${paletteChoice.g}, ${paletteChoice.b}`,
        baseAlpha: Math.random() * 0.35 + 0.25, // 0.25 - 0.60
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    // Mouse event handlers (passive)
    let mouseTimeout: ReturnType<typeof setTimeout>
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.active = true
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        mouse.active = false
      }, 3000)
    }

    const handleMouseLeave = () => {
      mouse.active = false
      mouse.targetX = -1000
      mouse.targetY = -1000
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX
        mouse.targetY = e.touches[0].clientY
        mouse.active = true
      }
    }

    const handleTouchEnd = () => {
      mouse.active = false
      mouse.targetX = -1000
      mouse.targetY = -1000
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    window.addEventListener("resize", setSize, { passive: true })

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        lastTime = performance.now()
        render(performance.now())
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    let lastTime = performance.now()

    // Main animation loop
    const render = (time: number) => {
      if (!isVisible) return

      const dt = Math.min((time - lastTime) / 1000, 0.1) // capped delta time
      lastTime = time

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1
        mouse.y += (mouse.targetY - mouse.y) * 0.1
      } else {
        mouse.x += (-1000 - mouse.x) * 0.05
        mouse.y += (-1000 - mouse.y) * 0.05
      }

      ctx.clearRect(0, 0, width, height)

      // Update & Draw Particles
      const len = particles.length
      for (let i = 0; i < len; i++) {
        const p = particles[i]

        if (!prefersReducedMotion) {
          // Normal Brownian Drift
          p.x += p.vx * 60 * dt
          p.y += p.vy * 60 * dt

          // Mouse Gravitational & Repulsive Disturbance
          if (mouse.active) {
            const dx = mouse.x - p.x
            const dy = mouse.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < mouseRadius && dist > 1) {
              const force = (1 - dist / mouseRadius) * 18 * dt
              // Gentle push away from cursor to create dynamic halo
              p.x -= (dx / dist) * force * 15
              p.y -= (dy / dist) * force * 15
            }
          }

          // Screen edge wrap-around with smooth margin
          const margin = 20
          if (p.x < -margin) p.x = width + margin
          if (p.x > width + margin) p.x = -margin
          if (p.y < -margin) p.y = height + margin
          if (p.y > height + margin) p.y = -margin

          // Pulsing phase
          p.pulsePhase += p.pulseSpeed
        }

        const currentAlpha =
          p.baseAlpha + Math.sin(p.pulsePhase) * 0.12

        // Draw particle dot with subtle aura
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.05, currentAlpha)})`
        ctx.fill()
      }

      // Draw Network Interconnections (quadratic distance alpha)
      ctx.lineWidth = 0.65
      for (let i = 0; i < len; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distSq = dx * dx + dy * dy

          if (distSq < connectionDistance * connectionDistance) {
            const dist = Math.sqrt(distSq)
            const alpha = (1 - dist / connectionDistance) * 0.22

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
            ctx.stroke()
          }
        }

        // Draw dynamic filament from cursor to nearby particles
        if (mouse.active) {
          const mdx = mouse.x - p1.x
          const mdy = mouse.y - p1.y
          const mDistSq = mdx * mdx + mdy * mdy

          if (mDistSq < mouseRadius * mouseRadius) {
            const mDist = Math.sqrt(mDistSq)
            const mAlpha = (1 - mDist / mouseRadius) * 0.35

            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(p1.x, p1.y)
            ctx.strokeStyle = `rgba(56, 189, 248, ${mAlpha})`
            ctx.stroke()
          }
        }
      }

      // If user prefers reduced motion, draw once and don't loop continuously
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(mouseTimeout)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("resize", setSize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [particleCount, connectionDistance, mouseRadius])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        opacity: 0.85,
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  )
}
