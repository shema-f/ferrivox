import { useState, useEffect, lazy, Suspense } from "react"

import type { SceneId } from "../types"

import {
  SCENE_LABELS,
  SCENE_DESCRIPTIONS,
  SCENE_ORDER,
  DIVISIONS,
  TECH_STACK,
  METRICS,
  PROJECTS,
} from "../types"

import FeriivoxLogo from "./FeriivoxLogo"

import IshamiLogo from "./IshamiLogo"

import {
  DataIcon,
  AIIcon,
  SoftwareIcon,
  SecurityIcon,
  ProductIcon,
  ContactIcon,
  GlobeIcon,
  HeroDataIcon,
  HeroAIIcon,
  HeroSoftwareIcon,
} from "./CartoonIcons"

import Newsletter from "./Newsletter"

import SceneTransitionBar from "./SceneTransitionBar"

import { supabase, isSupabaseConfigured } from "../lib/supabase"

// Modals load on demand — none of them are needed for the first paint.
const TermsOfService = lazy(() => import("./TermsOfService"))

const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"))

const FeriChatbot = lazy(() => import("./FeriChatbot"))

const TOP_NAV: Array<{ id: SceneId; label: string }> = [
  { id: "lobby", label: "TECHNOLOGY" },

  { id: "district", label: "PROJECTS" },

  { id: "globe", label: "COMPANY" },
]

interface ContactFormData {
  type: string

  company: string

  email: string

  budget: string

  timeline: string

  message: string
}

interface UIOverlayProps {
  sceneId: SceneId

  onNavigate: (id: SceneId) => void
}

/* Shared chip style for intake form selectors */

function chipStyle(active: boolean): React.CSSProperties {
  return active
    ? { color: "#ffffff", background: "#3b82f6", border: "1px solid #3b82f6" }
    : {
        color: "rgba(203, 213, 225, 0.75)",
        background: "rgba(59,130,246,0.05)",
        border: "1px solid rgba(59,130,246,0.2)",
      }
}

/* ── Inline SVG social icons ────────────────────────── */

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 003.76.92V6.34a4.85 4.85 0 01-1-.65z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function AIChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  )
}

function ContactForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState<ContactFormData>({
    type: "",

    company: "",

    email: "",

    budget: "",

    timeline: "",

    message: "",
  })

  const [step, setStep] = useState<"type" | "details" | "done">("type")

  const [submitting, setSubmitting] = useState(false)

  const PROJECT_TYPES = [
    "AI system",
    "Data project",
    "Software",
    "Security",
    "Other",
  ]

  const BUDGET_RANGES = [
    "< $5k",
    "$5k – $15k",
    "$15k – $50k",
    "$50k+",
    "Not sure yet",
  ]

  const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"]

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <div className="text-xl font-semibold text-slate-100 text-center">
          Thank You!
        </div>
        <div className="text-sm text-slate-400 text-center max-w-sm">
          We've received your inquiry and will get back to you within 24 hours.
        </div>
        <div
          className="w-20 h-px mt-2"
          style={{ background: "rgba(59, 130, 246, 0.3)" }}
        />
        <div className="text-xs text-slate-500">hello@ferrivox.com</div>
      </div>
    )
  }

  if (step === "type") {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium text-slate-300 mb-1">
          What are you looking to build?
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setForm((f) => ({ ...f, type: t }))
                setStep("details")
              }}
              className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-left"
              style={{
                color: "#e2e8f0",
                border: "1px solid rgba(59,130,246,0.2)",
                background: "rgba(59,130,246,0.05)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  "rgba(59,130,246,0.12)"
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(59,130,246,0.5)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  "rgba(59,130,246,0.05)"
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(59,130,246,0.2)"
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="text-xs px-2.5 py-1 rounded-md font-medium"
          style={{
            color: "#60a5fa",
            border: "1px solid rgba(59,130,246,0.3)",
            background: "rgba(59,130,246,0.1)",
          }}
        >
          {form.type}
        </div>
        <button
          onClick={() => setStep("type")}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Change
        </button>
      </div>
      {/* Budget + Timeline selectors */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Budget range
        </label>
        <div className="flex flex-wrap gap-2">
          {BUDGET_RANGES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, budget: f.budget === b ? "" : b }))
              }
              className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150"
              style={chipStyle(form.budget === b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Timeline
        </label>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, timeline: f.timeline === t ? "" : t }))
              }
              className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150"
              style={chipStyle(form.timeline === t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {(["company", "email", "message"] as Array<keyof ContactFormData>).map(
        (field) => (
          <div key={field} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {field === "message"
                ? "Tell us about your project"
                : field === "company"
                  ? "Company name"
                  : "Email address"}
            </label>
            {field === "message" ? (
              <textarea
                rows={3}
                value={form[field]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
                placeholder="Brief description of your project..."
                className="w-full px-3 py-2.5 text-sm rounded-lg resize-none outline-none transition-all"
                style={{
                  color: "#e2e8f0",
                  background: "rgba(59,130,246,0.05)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(59,130,246,0.5)"
                  e.target.style.background = "rgba(59,130,246,0.08)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(59,130,246,0.2)"
                  e.target.style.background = "rgba(59,130,246,0.05)"
                }}
              />
            ) : (
              <input
                type={field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
                placeholder={
                  field === "email" ? "you@company.com" : "Acme Inc."
                }
                className="w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-all"
                style={{
                  color: "#e2e8f0",
                  background: "rgba(59,130,246,0.05)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(59,130,246,0.5)"
                  e.target.style.background = "rgba(59,130,246,0.08)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(59,130,246,0.2)"
                  e.target.style.background = "rgba(59,130,246,0.05)"
                }}
              />
            )}
          </div>
        ),
      )}
      <button
        onClick={async () => {
          if (form.email && form.company && !submitting) {
            setSubmitting(true)

            if (isSupabaseConfigured()) {
              await supabase.from("contact_submissions").insert([
                {
                  type: form.type,

                  company: form.company,

                  email: form.email,

                  message: form.message,

                  budget: form.budget || null,

                  timeline: form.timeline || null,

                  submitted_at: new Date().toISOString(),
                },
              ])
            }

            setSubmitting(false)

            setStep("done")

            onSubmit()
          }
        }}
        disabled={submitting}
        className="btn-primary mt-1 px-6 py-3 text-sm font-semibold rounded-xl w-full"
        style={submitting ? { opacity: 0.6, cursor: "wait" } : undefined}
      >
        {submitting ? "Sending..." : "Submit Project →"}
      </button>
    </div>
  )
}

export default function UIOverlay({ sceneId, onNavigate }: UIOverlayProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)

  const [logoVisible, setLogoVisible] = useState(false)

  const [showTerms, setShowTerms] = useState(false)

  const [showPrivacy, setShowPrivacy] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 100)

    return () => clearTimeout(timer)
  }, [])

  /* ── Keyboard navigation ─────────────────────── */
  /* Arrow keys / PageUp / PageDown move through the scene tour. */
  /* Skipped while typing in form fields or when a modal is open. */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null

      // Don't hijack keys while interacting with form controls or contenteditables
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return
      }

      // Don't hijack keys while a modal or the chatbot is open
      if (chatOpen || showTerms || showPrivacy || mobileMenuOpen) {
        return
      }

      const currentIndex = SCENE_ORDER.indexOf(sceneId)

      let nextIndex: number

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          nextIndex = Math.min(SCENE_ORDER.length - 1, currentIndex + 1)
          break

        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          nextIndex = Math.max(0, currentIndex - 1)
          break

        case "Home":
          nextIndex = 0
          break

        case "End":
          nextIndex = SCENE_ORDER.length - 1
          break

        default:
          return
      }

      if (nextIndex !== currentIndex) {
        e.preventDefault()

        onNavigate(SCENE_ORDER[nextIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sceneId, chatOpen, showTerms, showPrivacy, mobileMenuOpen, onNavigate])

  const isFloor = ["data", "software", "security", "ai"].includes(sceneId)

  const isLobby = sceneId === "lobby"

  const isHQ = sceneId === "hq"

  const isContact = sceneId === "contact"

  const socialLinks = [
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: "https://www.tiktok.com/@ferrivox",
    },

    {
      name: "Instagram",
      icon: InstagramIcon,
      url: "https://www.instagram.com/ferrivox",
    },

    {
      name: "YouTube",
      icon: YouTubeIcon,
      url: "https://www.youtube.com/@ferrivox",
    },

    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      url: "https://www.linkedin.com/company/ferrivox",
    },
  ]

  return (
    <div
      className="absolute inset-0 pointer-events-none flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Subtle scanlines */}
      <div className="hud-scanlines absolute inset-0" />

      {/* ── SCENE TRANSITION PROGRESS BAR ── */}
      <SceneTransitionBar sceneId={sceneId} />

      {/* ── HEADER / NAVIGATION ───────────────────────── */}
      <header
        className="relative pointer-events-auto z-50"
        style={{
          background: "rgba(10, 14, 23, 0.5)",

          backdropFilter: "blur(20px) saturate(180%)",

          WebkitBackdropFilter: "blur(20px) saturate(180%)",

          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",

          boxShadow:
            "0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between"
          style={{ height: "64px" }}
        >
          {/* Logo — zoomed in to show only the text, modern text-only look */}
          <button
            onClick={() => onNavigate("hq")}
            className="flex flex-col items-start hover:opacity-80 transition-opacity"
          >
            <div
              className="logo-container"
              style={{
                animation: logoVisible
                  ? "logo-reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                  : "none",

                opacity: logoVisible ? undefined : 0,
              }}
            >
              <FeriivoxLogo
                className="logo-shimmer"
                style={{
                  height: "52px",

                  width: "auto",
                }}
              />
            </div>
            <span
              style={{
                color: "rgba(148, 163, 184, 0.55)",

                fontFamily: '"Castle", serif',

                fontSize: "8px",

                fontWeight: 400,

                letterSpacing: "0.25em",

                textTransform: "uppercase",

                marginTop: "-2px",
              }}
            >
              IRON WILL, INFINITE DREAMS
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {TOP_NAV.map((item) => {
              const isActive = sceneId === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative px-3 py-1.5 text-xs font-medium transition-all duration-200"
                  style={{
                    color: isActive ? "#ffffff" : "rgba(203, 213, 225, 0.7)",

                    fontFamily: "Inter, sans-serif",

                    letterSpacing: "0.12em",

                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color = "#e2e8f0"
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(203, 213, 225, 0.7)"
                  }}
                >
                  {item.label}
                  {/* Active underline with blue glow */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-8"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, #3b82f6, transparent)",

                        boxShadow:
                          "0 0 8px rgba(59, 130, 246, 0.6), 0 0 16px rgba(59, 130, 246, 0.3)",
                      }}
                    />
                  )}
                </button>
              )
            })}
            {/* Start a Project CTA */}
            <button
              onClick={() => onNavigate("contact")}
              className="btn-primary ml-3 px-5 py-2 text-xs font-semibold rounded-lg"
              style={{ letterSpacing: "0.08em" }}
            >
              [ START A PROJECT ]
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-6 pb-5 scroll-panel"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {TOP_NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all"
                style={{
                  color: sceneId === item.id ? "#ffffff" : "#94a3b8",
                  background:
                    sceneId === item.id
                      ? "rgba(59,130,246,0.15)"
                      : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate("contact")
                setMobileMenuOpen(false)
              }}
              className="btn-primary block w-full text-left px-4 py-3 mt-2 text-sm font-semibold rounded-lg"
            >
              START A PROJECT
            </button>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT AREA ────────────────────────── */}
      <div className="flex-1 relative pointer-events-none">
        {/* Left side dot navigation — same order as arrow-key tour */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-40 pointer-events-auto">
          {SCENE_ORDER.map((id) => {
            const isActive = sceneId === id

            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: isActive ? "#3b82f6" : "rgba(100, 116, 139, 0.3)",

                  boxShadow: isActive
                    ? "0 0 12px rgba(59, 130, 246, 0.5)"
                    : "none",

                  transform: isActive ? "scale(1.3)" : "scale(1)",
                }}
                title={SCENE_LABELS[id]}
              />
            )
          })}
          {/* Keyboard hint */}
          <div
            className="font-mono hidden lg:flex items-center gap-1.5 mt-2"
            style={{ color: "rgba(100, 116, 139, 0.55)" }}
            title="Navigate scenes with arrow keys"
          >
            <kbd
              style={{
                fontSize: "9px",
                padding: "1px 4px",
                borderRadius: "3px",
                border: "1px solid rgba(100, 116, 139, 0.3)",
                background: "rgba(100, 116, 139, 0.1)",
              }}
            >
              ←
            </kbd>
            <kbd
              style={{
                fontSize: "9px",
                padding: "1px 4px",
                borderRadius: "3px",
                border: "1px solid rgba(100, 116, 139, 0.3)",
                background: "rgba(100, 116, 139, 0.1)",
              }}
            >
              →
            </kbd>
            <span style={{ fontSize: "9px", letterSpacing: "0.1em" }}>TOUR</span>
          </div>
        </div>

        {/* ── HQ Scene ── */}
        {isHQ && (
          <div className="absolute bottom-20 md:bottom-28 left-0 right-0 px-5 md:px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto panel-enter">
              {/* DATA → TRANSFORM → INTELLIGENCE pipeline */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <HeroDataIcon size={28} />
                  <span
                    className="text-[10px] md:text-xs font-mono font-medium px-2.5 py-1 rounded-md"
                    style={{
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.3)",
                      background: "rgba(59,130,246,0.06)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    DATA
                  </span>
                </div>
                <span className="text-slate-600 text-xs">→</span>
                <div className="flex items-center gap-2">
                  <HeroSoftwareIcon size={28} />
                  <span
                    className="text-[10px] md:text-xs font-mono font-medium px-2.5 py-1 rounded-md"
                    style={{
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.3)",
                      background: "rgba(59,130,246,0.06)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    TRANSFORM
                  </span>
                </div>
                <span className="text-slate-600 text-xs">→</span>
                <div className="flex items-center gap-2">
                  <HeroAIIcon size={28} />
                  <span
                    className="text-[10px] md:text-xs font-mono font-medium px-2.5 py-1 rounded-md"
                    style={{
                      color: "#00ffcc",
                      border: "1px solid rgba(0,255,204,0.3)",
                      background: "rgba(0,255,204,0.06)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    INTELLIGENCE
                  </span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-[1.05] tracking-tight" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                <span className="text-gradient">We Build What Powers</span>
                <br />
                <span className="text-white">Tomorrow.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 mb-7 max-w-xl leading-relaxed">
                Ferrivox is an engineering company building data, AI, software,
                and security systems for the next generation of technology.
              </p>
              <div className="flex gap-3 flex-wrap mb-7">
                <button
                  onClick={() => onNavigate("lobby")}
                  className="btn-primary px-7 py-3.5 text-sm font-semibold rounded-xl"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Explore Ferrivox
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="btn-ghost px-7 py-3.5 text-sm font-medium rounded-xl"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Start a Project
                </button>
              </div>
              {/* Metrics ticker */}
              <div className="scroll-panel flex flex-wrap gap-x-8 gap-y-3 mb-4">
                {METRICS.map((m) => (
                  <div key={m.label}>
                    <span className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                      {m.value}
                    </span>{" "}
                    <span className="text-xs text-slate-500">{m.label}</span>
                  </div>
                ))}
              </div>
              {/* BUILT WITH stack */}
              <div className="scroll-panel flex flex-wrap items-center gap-2 max-w-2xl">
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mr-1">
                  Built with
                </span>
                {TECH_STACK.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                      color: "rgba(148,163,184,0.7)",
                      border: "1px solid rgba(100,116,139,0.2)",
                      background: "rgba(100,116,139,0.06)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Lobby / Technology Scene — 4 divisions ── */}
        {isLobby && (
          <div className="absolute bottom-20 md:bottom-28 left-0 right-0 px-5 md:px-8 pointer-events-auto">
            <div className="max-w-5xl mx-auto panel-enter">
              <div
                className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                Technology
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                Four engineering divisions. One company.
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-8 max-w-lg leading-relaxed">
                We don't just use technology. We build it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DIVISIONS.map((division) => {
                  const divisionIcon = division.id === "data" ? DataIcon : division.id === "ai" ? AIIcon : division.id === "software" ? SoftwareIcon : SecurityIcon
                  const IconComp = divisionIcon
                  return (
                    <button
                      key={division.id}
                      onClick={() => onNavigate(division.id)}
                      className="text-left p-6 rounded-2xl transition-all duration-200 group glass-panel hover:border-blue-500/40"
                    >
                      <div className="mb-3">
                        <IconComp size={52} />
                      </div>
                      <div
                        className="font-mono text-xs mb-2"
                        style={{ color: "#60a5fa" }}
                      >
                        {division.index}
                      </div>
                      <div className="text-sm font-semibold text-white mb-1.5" style={{ fontFamily: '"Castle", serif' }}>
                        {division.name}
                      </div>
                      <div className="text-xs text-slate-500 leading-relaxed mb-3">
                        {division.tagline}
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 group-hover:text-blue-400 transition-colors">
                        Explore →
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Floor Scenes (Data, Software, Security, AI) ── */}
        {isFloor && (
          <div className="absolute bottom-20 md:bottom-28 left-0 right-0 px-5 md:px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto flex items-end justify-between gap-8 panel-enter">
              <div className="flex items-start gap-4">
                <div className="hidden md:block shrink-0 mt-1">
                  {sceneId === "data" && <DataIcon size={56} />}
                  {sceneId === "ai" && <AIIcon size={56} />}
                  {sceneId === "software" && <SoftwareIcon size={56} />}
                  {sceneId === "security" && <SecurityIcon size={56} />}
                </div>
                <div
                  className="text-xs font-mono uppercase tracking-widest mb-2"
                  style={{ color: "#60a5fa" }}
                >
                  {SCENE_LABELS[sceneId]}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {SCENE_DESCRIPTIONS[sceneId]}
                </h2>
                <p className="text-sm text-slate-500 max-w-lg leading-relaxed mb-3">
                  {DIVISIONS.find((d) => d.id === sceneId)?.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 max-w-lg">
                  {DIVISIONS.find((d) => d.id === sceneId)?.services.map(
                    (s) => (
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
                    ),
                  )}
                </div>
                <button
                  onClick={() => onNavigate("lobby")}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← All divisions
                </button>
              </div>
              <div className="hidden md:flex flex-col gap-2 items-end">
                {DIVISIONS.map((d) => {
                  const DivIcon = d.id === "data" ? DataIcon : d.id === "ai" ? AIIcon : d.id === "software" ? SoftwareIcon : SecurityIcon
                  return (
                    <button
                      key={d.id}
                      onClick={() => onNavigate(d.id)}
                      className="flex items-center gap-2 text-xs font-mono transition-all"
                      style={{
                        color:
                          d.id === sceneId ? "#60a5fa" : "rgba(100,116,139,0.5)",
                      }}
                    >
                      {d.id === sceneId ? "→ " : "  "}
                      <DivIcon size={20} />
                      {d.index} {d.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── District / Portfolio Scene ── */}
        {sceneId === "district" && (
          <div className="absolute bottom-20 md:bottom-28 left-0 right-0 px-5 md:px-8 pointer-events-auto">
            <div className="max-w-5xl mx-auto panel-enter">
              <div
                className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                Project District
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                The products we build
              </h2>
              <p className="text-sm text-slate-400 mb-6 max-w-lg">
                Ferrivox is the company behind an ecosystem of technology
                products. Each building in the district is one of them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {PROJECTS.map((p) => (
                  <div
                    key={p.id}
                    className="text-left p-5 rounded-2xl glass-panel group hover:border-blue-500/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {p.id === "ishami" && (
                        <div className="shrink-0">
                          <IshamiLogo size={40} />
                        </div>
                      )}
                      {p.id === "genda" && (
                        <div className="shrink-0">
                          <GlobeIcon size={40} />
                        </div>
                      )}
                      {p.id === "ikibina" && (
                        <div className="shrink-0">
                          <ProductIcon size={40} />
                        </div>
                      )}
                      {p.id === "ifaranga" && (
                        <div className="shrink-0">
                          <ContactIcon size={40} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: '"Castle", serif' }}>
                        {p.name}
                      </span>
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                            style={
                              p.status === "LIVE"
                                ? {
                                    color: "#34d399",
                                    background: "rgba(52,211,153,0.1)",
                                    border: "1px solid rgba(52,211,153,0.3)",
                                  }
                                : p.status === "IN DEVELOPMENT"
                                  ? {
                                      color: "#fbbf24",
                                      background: "rgba(251,191,36,0.1)",
                                      border: "1px solid rgba(251,191,36,0.3)",
                                    }
                                  : {
                                      color: "#94a3b8",
                                      background: "rgba(148,163,184,0.1)",
                                      border: "1px solid rgba(148,163,184,0.3)",
                                    }
                            }
                          >
                            {p.status}
                          </span>
                        </div>
                        <div
                          className="text-xs font-medium mt-1"
                          style={{ color: "#60a5fa" }}
                        >
                          {p.subtitle}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
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
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onNavigate("contact")}
                  className="btn-primary px-6 py-3 text-sm font-semibold rounded-xl"
                >
                  Start a Project
                </button>
                <button
                  onClick={() => onNavigate("hq")}
                  className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Globe / Company Scene ── */}
        {sceneId === "globe" && (
          <div className="absolute bottom-20 md:bottom-28 left-0 right-0 px-5 md:px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto panel-enter">
              <div
                className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                Company
              </div>
              <div className="flex items-center gap-4 mb-4">
                <GlobeIcon size={56} />
                <h2 className="text-2xl md:text-4xl font-bold text-white" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                  We don't just use technology.
                  <br />
                  We build it.
                </h2>
              </div>
              <p className="text-sm md:text-base text-slate-400 mb-6 max-w-lg leading-relaxed">
                Ferrivox is an African technology and engineering company
                building the data, AI, software, and digital systems that power
                the next generation. Headquartered in Kigali, delivering
                worldwide.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                {[
                  { label: "Founded", value: "2024" },

                  { label: "Headquarters", value: "Kigali, Rwanda" },

                  { label: "Projects Delivered", value: "50+" },

                  { label: "Countries Served", value: "12+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-6 max-w-xl">
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
              <button
                onClick={() => onNavigate("hq")}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {/* ── Contact Scene ── */}
        {isContact && (
          <div className="absolute bottom-20 md:bottom-28 left-0 right-0 px-5 md:px-8 pointer-events-auto">
            <div className="max-w-xl mx-auto">
              <div className="rounded-2xl p-6 glass-panel">
                <div
                  className="text-xs font-mono uppercase tracking-widest mb-1"
                  style={{ color: "rgba(148,163,184,0.6)" }}
                >
                  Engineering Intake
                </div>
                <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                  Have something difficult to build? Let's build it.
                </h2>
                <ContactForm onSubmit={() => {}} />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => onNavigate("hq")}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ──────────── */}
      <footer
        className="relative pointer-events-auto z-50"
        style={{
          background: "rgba(10, 14, 23, 0.95)",

          borderTop: "1px solid rgba(255, 255, 255, 0.06)",

          backdropFilter: "blur(12px)",
        }}
      >
        {/* Newsletter row */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex flex-col md:flex-row md:items-center gap-3 md:gap-10 border-b border-white/5">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 tracking-wide" style={{ fontFamily: '"Castle", serif' }}>
              Ferrivox Dispatch
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              Engineering notes and product updates. One email a month, no
              spam.
            </div>
          </div>
          <div className="w-full md:w-auto md:shrink-0">
            <Newsletter />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between"
          style={{ height: "48px" }}
        >
          {/* Left: Copyright */}
          <span className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Ferrivox. All rights reserved.
          </span>

          {/* Center: Social + Links */}
          <div className="hidden md:flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200"
                style={{ color: "rgba(148, 163, 184, 0.5)" }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = "#60a5fa"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color =
                    "rgba(148, 163, 184, 0.5)"
                }}
                title={social.name}
              >
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onNavigate("globe")}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Company
            </button>
            <button
              onClick={() => onNavigate("district")}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Contact
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms
            </button>
          </div>

          {/* Right: Tagline */}
          <span className="text-xs text-slate-600 hidden md:block" style={{ fontFamily: '"Castle", serif' }}>
            IRON WILL, INFINITE DREAMS
          </span>
        </div>
      </footer>

      {/* ── FLOATING FERRI BUTTON ─────────────────── */}
      <div className="fixed bottom-48 right-6 md:bottom-36 z-[100] pointer-events-auto">
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
          <AIChatIcon className="w-6 h-6 text-white relative z-10" />
        </button>
      </div>

      {/* ── FERRI CHATBOT ── */}
      {chatOpen && (
        <Suspense fallback={null}>
          <FeriChatbot onClose={() => setChatOpen(false)} />
        </Suspense>
      )}

      {/* ── TERMS OF SERVICE MODAL ── */}
      {showTerms && (
        <Suspense fallback={null}>
          <TermsOfService onClose={() => setShowTerms(false)} />
        </Suspense>
      )}

      {/* ── PRIVACY POLICY MODAL ── */}
      {showPrivacy && (
        <Suspense fallback={null}>
          <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
        </Suspense>
      )}
    </div>
  )
}
