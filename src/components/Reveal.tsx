import { useState, useEffect, useRef } from "react"

/* ── Scroll reveal hook ─────────────────────────────── */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)

            observer.disconnect()
          }
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

/* ── Reveal wrapper ─────────────────────────────────── */

export default function Reveal({
  children,

  delay = 0,
}: {
  children: React.ReactNode

  delay?: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,

        transform: visible ? "translateY(0)" : "translateY(24px)",

        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
