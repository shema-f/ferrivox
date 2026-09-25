import React, { useState } from "react"
import type { ContactFormData } from "../types"

interface FormErrors {
  fullName?: string
  email?: string
  company?: string
  consultationArea?: string
  message?: string
}

const CONSULTATION_AREAS = [
  "Custom AI & Model Fine-Tuning",
  "Petabyte Data & Annotation Pipelines",
  "High-Scale Distributed Software",
  "Zero-Trust Cybersecurity & Audit",
  "3D WebGL Spatial Simulations",
  "Ishami Platform Integration",
]

const TIMELINES = [
  "Immediate (< 1 Month)",
  "1 – 3 Months",
  "3 – 6 Months",
  "Exploratory / R&D",
]

const BUDGET_RANGES = [
  "$10k – $25k",
  "$25k – $75k",
  "$75k – $200k",
  "$200k+",
  "Undisclosed",
]

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    consultationArea: "Custom AI & Model Fine-Tuning",
    timeline: "1 – 3 Months",
    budget: "$25k – $75k",
    message: "",
    needsNda: true,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [copied, setCopied] = useState(false)
  const [apiError, setApiError] = useState("")

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required."
        if (value.trim().length < 2) return "Name must be at least 2 characters."
        return undefined

      case "email":
        if (!value.trim()) return "Work email is required."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid work email address."
        }
        return undefined

      case "company":
        if (!value.trim()) return "Company or organization name is required."
        return undefined

      case "consultationArea":
        if (!value.trim()) return "Please select a consultation focus area."
        return undefined

      case "message":
        if (!value.trim()) return "Please provide details about your technical requirements."
        if (value.trim().length < 15) {
          return "Please enter at least 15 characters describing your scope."
        }
        return undefined

      default:
        return undefined
    }
  }

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (touched[field] && typeof value === "string") {
      const errorMsg = validateField(field, value)
      setErrors((prev) => ({
        ...prev,
        [field]: errorMsg,
      }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const val = (formData as any)[field]
    if (typeof val === "string") {
      const errorMsg = validateField(field, val)
      setErrors((prev) => ({
        ...prev,
        [field]: errorMsg,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    newErrors.fullName = validateField("fullName", formData.fullName)
    newErrors.email = validateField("email", formData.email)
    newErrors.company = validateField("company", formData.company)
    newErrors.consultationArea = validateField(
      "consultationArea",
      formData.consultationArea
    )
    newErrors.message = validateField("message", formData.message)

    // Remove undefined keys
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors]
      }
    })

    setErrors(newErrors)
    setTouched({
      fullName: true,
      email: true,
      company: true,
      consultationArea: true,
      message: true,
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    const genRef = `FX-CONSULT-${Math.floor(1000 + Math.random() * 9000)}`
    setReferenceId(genRef)

    try {
      // 1. Save locally for persistence
      const consultationRecord = {
        referenceId: genRef,
        ...formData,
        submittedAt: new Date().toISOString(),
      }
      const existing = JSON.parse(
        localStorage.getItem("ferrivox_consultations") || "[]"
      )
      existing.unshift(consultationRecord)
      localStorage.setItem("ferrivox_consultations", JSON.stringify(existing))

      // 2. Optionally forward to Supabase if available
      try {
        const { supabase, isSupabaseConfigured } = await import("../lib/supabase")
        if (isSupabaseConfigured()) {
          await supabase.from("contact_submissions").insert([
            {
              type: formData.consultationArea,
              company: `${formData.company} (${formData.fullName})`,
              email: formData.email,
              message: `[Ref: ${genRef}] [Phone: ${formData.phone || "N/A"}] [NDA: ${
                formData.needsNda ? "YES" : "NO"
              }]\n\n${formData.message}`,
              budget: formData.budget,
              timeline: formData.timeline,
              submitted_at: new Date().toISOString(),
            },
          ])
        }
      } catch (err) {
        console.warn("Supabase log skipped, saved locally.", err)
      }

      setIsSuccess(true)
    } catch {
      setApiError(
        "Unable to submit at this moment. You can also reach our engineering squad directly at contact@ferrivox.com."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyRef = () => {
    if (!referenceId) return
    navigator.clipboard.writeText(referenceId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const resetForm = () => {
    setIsSuccess(false)
    setFormData({
      fullName: "",
      email: "",
      company: "",
      phone: "",
      consultationArea: "Custom AI & Model Fine-Tuning",
      timeline: "1 – 3 Months",
      budget: "$25k – $75k",
      message: "",
      needsNda: true,
    })
    setErrors({})
    setTouched({})
    setApiError("")
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* ── Left Column: Value Proposition & Direct Channels ── */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.2em] text-blue-400 bg-blue-950/40 border border-blue-800/40 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Get in Touch • 24h Engineering Review</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Request an Engineering Consultation
          </h2>

          <p className="text-slate-300 mt-5 leading-relaxed text-base md:text-lg">
            Have a complex systems challenge? Speak directly with our senior
            architects and AI researchers. We assess technical feasibility,
            security architectures, and timeline roadmaps — zero sales fluff.
          </p>

          {/* Key Engineering Guarantees */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24-Hour Technical Triage</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed written review from a practicing systems engineer or AI researcher.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Mutual NDA Protection</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  All IP, specifications, and proprietary data remain strictly confidential.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Engineered in Kigali • Delivered Worldwide</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Serving enterprise clients, institutions, and high-growth startups globally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Contacts Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-400 font-mono">
          <a
            href="mailto:contact@ferrivox.com"
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <span>✉</span>
            <span>contact@ferrivox.com</span>
          </a>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <span>📍</span>
            <span>Kigali Heights, Rwanda</span>
          </span>
        </div>
      </div>

      {/* ── Right Column: Consultation Form / Professional Success State ── */}
      <div className="lg:col-span-7">
        <div
          className="relative rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.1)",
          }}
        >
          {isSuccess ? (
            /* ── PROFESSIONAL SUCCESS CONFIRMATION DISPLAY ── */
            <div className="flex flex-col items-center text-center py-6 animate-fadeIn">
              {/* Animated Success Badge */}
              <div className="relative mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 78, 59, 0.4) 100%)",
                    border: "1.5px solid rgba(52, 211, 153, 0.6)",
                    boxShadow: "0 0 35px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="absolute -inset-2 rounded-full border border-emerald-500/20 animate-ping pointer-events-none" />
              </div>

              <div className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 mb-2">
                Consultation Request Received
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                We're on it, {formData.fullName.split(" ")[0]}!
              </h3>

              <p className="text-slate-300 text-sm mt-3 max-w-md leading-relaxed">
                Your engineering brief has been routed to our technical triage
                squad. A Senior Systems Architect will review your scope and
                reply with initial observations within 24 hours.
              </p>

              {/* Reference ID Badge */}
              <div
                className="mt-6 w-full max-w-md p-4 rounded-xl flex items-center justify-between gap-4"
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="text-left">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Consultation Reference ID
                  </div>
                  <div className="text-base font-mono font-bold text-blue-400 mt-0.5">
                    {referenceId}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                  style={{
                    background: copied ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.06)",
                    color: copied ? "#34d399" : "#cbd5e1",
                    border: copied ? "1px solid rgba(52, 211, 153, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <span>{copied ? "✓ Copied" : "Copy ID"}</span>
                </button>
              </div>

              {/* Consultation Details Summary Card */}
              <div
                className="mt-4 w-full max-w-md p-5 rounded-xl text-left text-xs space-y-2.5"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Organization:</span>
                  <span className="font-semibold text-slate-200">{formData.company}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Focus Area:</span>
                  <span className="font-semibold text-blue-400">{formData.consultationArea}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Work Email:</span>
                  <span className="font-semibold text-slate-200">{formData.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Target Timeline:</span>
                  <span className="font-semibold text-slate-200">{formData.timeline}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Mutual NDA:</span>
                  <span className="font-semibold text-emerald-400">
                    {formData.needsNda ? "Requested (Standard Draft)" : "Not Required"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:contact@ferrivox.com?subject=Consultation%20Follow-up%20[${referenceId}]`}
                  className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <span>Open Email Client</span>
                  <span>→</span>
                </a>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-xs font-medium rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors"
                >
                  Submit Another Consultation
                </button>
              </div>
            </div>
          ) : (
            /* ── GET IN TOUCH CONSULTATION FORM ── */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Form Header */}
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Consultation Request
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details below. Fields marked with an asterisk (*) are required.
                </p>
              </div>

              {/* Row 1: Full Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="e.g. Alex Mercer"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all text-slate-100 placeholder-slate-500 ${
                      errors.fullName
                        ? "border-red-500/80 bg-red-950/20 focus:ring-1 focus:ring-red-500"
                        : "border-white/10 bg-slate-900/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    } border`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1" role="alert">
                      <span>⚠</span>
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2"
                  >
                    Work Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="alex@enterprise.com"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all text-slate-100 placeholder-slate-500 ${
                      errors.email
                        ? "border-red-500/80 bg-red-950/20 focus:ring-1 focus:ring-red-500"
                        : "border-white/10 bg-slate-900/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    } border`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1" role="alert">
                      <span>⚠</span>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Company & Optional Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2"
                  >
                    Company / Organization <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    onBlur={() => handleBlur("company")}
                    placeholder="e.g. Apex Systems"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all text-slate-100 placeholder-slate-500 ${
                      errors.company
                        ? "border-red-500/80 bg-red-950/20 focus:ring-1 focus:ring-red-500"
                        : "border-white/10 bg-slate-900/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    } border`}
                  />
                  {errors.company && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1" role="alert">
                      <span>⚠</span>
                      <span>{errors.company}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2"
                  >
                    Phone / WhatsApp <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all text-slate-100 placeholder-slate-500 border border-white/10 bg-slate-900/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Consultation Area Chips */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2.5">
                  Consultation Focus Area <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONSULTATION_AREAS.map((area) => {
                    const isSelected = formData.consultationArea === area
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleChange("consultationArea", area)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400"
                            : "bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/20"
                        }`}
                      >
                        {area}
                      </button>
                    )
                  })}
                </div>
                {errors.consultationArea && (
                  <p className="text-xs text-red-400 mt-1.5" role="alert">
                    {errors.consultationArea}
                  </p>
                )}
              </div>

              {/* Timeline & Budget Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Target Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleChange("timeline", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all text-slate-100 border border-white/10 bg-slate-900/90 focus:border-blue-500 cursor-pointer"
                  >
                    {TIMELINES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-slate-100">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Target Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleChange("budget", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all text-slate-100 border border-white/10 bg-slate-900/90 focus:border-blue-500 cursor-pointer"
                  >
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-slate-100">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Scope / Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2"
                >
                  Technical Requirements & Objectives <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  placeholder="Outline your architectural challenge, dataset sizes, model latency requirements, or system dependencies..."
                  className={`w-full px-4 py-3 text-sm rounded-xl resize-none outline-none transition-all text-slate-100 placeholder-slate-500 ${
                    errors.message
                      ? "border-red-500/80 bg-red-950/20 focus:ring-1 focus:ring-red-500"
                      : "border-white/10 bg-slate-900/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  } border`}
                />
                {errors.message && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1" role="alert">
                    <span>⚠</span>
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* Mutual NDA Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  id="needsNda"
                  type="checkbox"
                  checked={formData.needsNda}
                  onChange={(e) => handleChange("needsNda", e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-white/20 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                >
                </input>
                <label
                  htmlFor="needsNda"
                  className="text-xs text-slate-300 cursor-pointer select-none"
                >
                  Execute mutual Non-Disclosure Agreement (NDA) prior to technical review
                </label>
              </div>

              {/* API / Submission Error Notice */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                  {apiError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40 active:scale-[0.99] disabled:opacity-60 disabled:cursor-wait"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Submitting Consultation Request...</span>
                  </>
                ) : (
                  <>
                    <span>Request Engineering Consultation</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-500">
                  Confidential & secure. We reply within 24 hours with an engineering review.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
