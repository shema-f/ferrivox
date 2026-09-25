import { useState, useEffect, useRef, lazy, Suspense } from "react"

import {
  DIVISIONS,
  PROJECTS,
  METRICS,
  TECH_STACK,
} from "../types"

import FeriivoxLogo from "./FeriivoxLogo"

import IshamiLogo from "./IshamiLogo"

import SiteFooter from "./SiteFooter"
import FAQSection from "./FAQSection"
import TechStackCards from "./TechStackCards"
import ContactSection from "./ContactSection"
import ParticleNetwork from "./ParticleNetwork"

const FeriChatbot = lazy(() => import("./FeriChatbot"))

import {
  DataIcon,
  AIIcon,
  SoftwareIcon,
  SecurityIcon,
  ProductIcon,
  ContactIcon,
  GlobeIcon,
} from "./CartoonIcons"

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

function Reveal({
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

/* ── Section heading ────────────────────────────────── */

function SectionHeading({
  eyebrow,

  title,

  description,
}: {
  eyebrow: string

  title: string

  description?: string
}) {
  return (
    <Reveal>
      <div className="mb-12 md:mb-16">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-blue-400 mb-4">
          {eyebrow}
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
          {title}
        </h2>

        {description && (
          <p className="text-slate-400 mt-5 max-w-xl leading-relaxed text-base md:text-lg">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/* ── Navigation ─────────────────────────────────────── */

const NAV = [
  { label: "Technology", href: "#divisions" },

  { label: "Products", href: "#products" },

  { label: "FAQ", href: "#faq" },

  { label: "Company", href: "#company" },

  { label: "Team", href: "#/team" },
]

/* ── Main page ──────────────────────────────────────── */

export default function CorpSite() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const divisionIcon = (id: string) =>
    id === "data" ? DataIcon : id === "ai" ? AIIcon : id === "software" ? SoftwareIcon : SecurityIcon

  const projectIcon = (id: string) =>
    id === "ishami" ? IshamiLogo : id === "genda" ? GlobeIcon : id === "ikibina" ? ProductIcon : ContactIcon

  return (
    <div
      className="w-full min-h-full relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #050810 0%, #0a0e17 50%, #050810 100%)",
      }}
    >
      {/* ── BACKGROUND CANVAS PARTICLE NETWORK ── */}
      <ParticleNetwork />

      {/* ── HEADER ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(5, 8, 16, 0.85)"
            : "transparent",

          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",

          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",

          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.06)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group focus:outline-none" aria-label="Ferrivox Home">
            <FeriivoxLogo className="h-9 md:h-11 w-auto logo-shimmer transition-transform duration-200 group-hover:scale-[1.02]" withTagline={true} />
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              className="btn-primary ml-3 px-5 py-2 text-xs font-semibold rounded-lg"
              style={{ letterSpacing: "0.06em" }}
            >
              Get in Touch
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden px-6 pb-6"
            style={{
              background: "rgba(5, 8, 16, 0.97)",

              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary block w-full text-center px-4 py-3 mt-2 text-sm font-semibold rounded-lg"
            >
              Get in Touch
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="top" className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 md:px-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.12), transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 mb-6">
              Ferrivox — Engineering Company
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl"
              style={{ fontFamily: '"HYWenHei", sans-serif' }}
            >
              <span className="text-gradient">We build what powers</span>

              <br />

              <span className="text-white">tomorrow.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base md:text-xl text-slate-400 mt-6 max-w-2xl leading-relaxed">
              Ferrivox is an engineering company building data, AI, software,
              and security systems for the next generation of technology.
              Engineered in Kigali — delivering worldwide.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex gap-3 flex-wrap mt-9">
              <a
                href="#contact"
                className="btn-primary px-7 py-3.5 text-sm font-semibold rounded-xl"
              >
                Start a Project
              </a>

              <a
                href="#divisions"
                className="btn-ghost px-7 py-3.5 text-sm font-medium rounded-xl"
              >
                Explore Technology
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {METRICS.map((m) => (
                <div key={m.label} className="border-l border-white/10 pl-4">
                  <div
                    className="text-2xl md:text-3xl font-bold text-white"
                    style={{ fontFamily: '"HYWenHei", sans-serif' }}
                  >
                    {m.value}
                  </div>

                  <div className="text-xs text-slate-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BUILT WITH / TECH STACK CARDS ── */}
      <TechStackCards />

      {/* ── DIVISIONS ── */}
      <section id="divisions" className="py-20 md:py-32 px-6 md:px-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Technology"
            title="Four engineering divisions. One company."
            description="We don't just use technology. We build it — from raw data to intelligent systems, end to end."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DIVISIONS.map((division, i) => {
              const Icon = divisionIcon(division.id)

              return (
                <Reveal key={division.id} delay={i * 80}>
                  <div className="glass-panel rounded-2xl p-7 md:p-8 h-full group hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Icon size={36} />
                      </div>

                      <span className="font-mono text-xs text-blue-400/70">
                        {division.index}
                      </span>
                    </div>

                    <h3
                      className="text-lg md:text-xl font-bold text-white"
                      style={{ fontFamily: '"HYWenHei", sans-serif' }}
                    >
                      {division.name}
                    </h3>

                    <p className="text-sm text-blue-300/80 mt-1">
                      {division.tagline}
                    </p>

                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                      {division.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {division.services.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded"
                          style={{
                            color: "rgba(148,163,184,0.75)",

                            border: "1px solid rgba(100,116,139,0.25)",

                            background: "rgba(100,116,139,0.08)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section
        id="products"
        className="py-20 md:py-32 px-6 md:px-10 border-t border-white/5 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Project District"
            title="The products we build."
            description="Ferrivox is the company behind an ecosystem of technology products — each one engineered for real-world impact."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS.map((p, i) => {
              const PIcon = projectIcon(p.id)

              return (
                <Reveal key={p.id} delay={i * 80}>
                  <div className="glass-panel rounded-2xl p-7 md:p-8 h-full hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <PIcon size={32} />
                        </div>

                        <div>
                          <h3
                            className="text-base font-bold text-white tracking-wide"
                            style={{ fontFamily: '"HYWenHei", sans-serif' }}
                          >
                            {p.name}
                          </h3>

                          <div className="text-xs text-blue-300/80 mt-0.5">
                            {p.subtitle}
                          </div>
                        </div>
                      </div>

                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                        style={
                          p.status === "LIVE"
                            ? {
                                color: "#34d399",

                                background: "rgba(52,211,153,0.1)",

                                border: "1px solid rgba(52,211,153,0.3)",
                              }
                            : {
                                color: "#fbbf24",

                                background: "rgba(251,191,36,0.1)",

                                border: "1px solid rgba(251,191,36,0.3)",
                              }
                        }
                      >
                        {p.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                          style={{
                            color: "rgba(148,163,184,0.6)",

                            background: "rgba(100,116,139,0.1)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── COMPANY ── */}
      <section
        id="company"
        className="py-20 md:py-32 px-6 md:px-10 border-t border-white/5 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-blue-400 mb-4">
                  Company
                </div>

                <h2
                  className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
                  style={{ fontFamily: '"HYWenHei", sans-serif' }}
                >
                  An engineering company, built from Africa.
                </h2>

                <p className="text-slate-400 mt-5 leading-relaxed text-base md:text-lg">
                  Ferrivox combines "ferro" (iron) and "vox" (voice) — iron
                  will, infinite dreams. We build the data, AI, software, and
                  digital systems that power the next generation of technology,
                  from Kigali to the world.
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    "Ferrivox Data",

                    "Ferrivox Intelligence",

                    "Ferrivox Engineering",

                    "Ferrivox Security",

                    "Ferrivox Labs",
                  ].map((name) => (
                    <span
                      key={name}
                      className="text-[11px] font-mono px-2.5 py-1 rounded"
                      style={{
                        color: "rgba(148,163,184,0.75)",

                        border: "1px solid rgba(100,116,139,0.25)",

                        background: "rgba(100,116,139,0.06)",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "Founded", value: "2024" },

                  { label: "Headquarters", value: "Kigali, Rwanda" },

                  { label: "Projects Delivered", value: "50+" },

                  { label: "Countries Served", value: "12+" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-panel rounded-2xl p-6">
                    <div
                      className="text-2xl md:text-3xl font-bold text-white"
                      style={{ fontFamily: '"HYWenHei", sans-serif' }}
                    >
                      {stat.value}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <FAQSection />

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="py-20 md:py-32 px-6 md:px-10 border-t border-white/5 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <ContactSection />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />

      {/* ── FLOATING FERRI BUTTON ─────────────────── */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: chatOpen
              ? "rgba(59, 130, 246, 0.9)"
              : "linear-gradient(135deg, #3b82f6, #2563eb)",

            boxShadow:
              "0 4px 24px rgba(59, 130, 246, 0.4), 0 0 48px rgba(59, 130, 246, 0.15)",
          }}
          title="Chat with FERRI — Ferrivox AI Assistant"
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              animation: "pulse-ring 2s ease-out infinite",
              border: "2px solid rgba(59, 130, 246, 0.3)",
            }}
          />
          <svg
            className="w-6 h-6 text-white relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
            <path d="M18 14h.01" />
            <path d="M6 14h.01" />
            <rect x="2" y="13" width="20" height="8" rx="2" />
            <path d="M12 17v2" />
            <path d="M9 17h6" />
          </svg>
        </button>
      </div>

      {/* ── FERRI CHATBOT ── */}
      {chatOpen && (
        <Suspense fallback={null}>
          <FeriChatbot onClose={() => setChatOpen(false)} />
        </Suspense>
      )}
    </div>
  )
}
