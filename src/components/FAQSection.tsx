import React, { useState, useRef, useCallback } from "react"

export interface FAQItem {
  id: string
  category: "all" | "ai" | "data" | "software" | "security" | "delivery"
  categoryLabel: string
  question: string
  shortAnswer: string
  detailedAnswer: string
  capabilities: string[]
  metrics: string
  iconType: "ai" | "data" | "software" | "security" | "delivery" | "simulation"
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "services-overview",
    category: "software",
    categoryLabel: "Core Capabilities",
    question: "What engineering services does Ferrivox specialize in?",
    shortAnswer:
      "We build end-to-end mission-critical digital systems spanning custom AI, petabyte-scale data pipelines, distributed software architectures, and zero-trust cybersecurity.",
    detailedAnswer:
      "Ferrivox operates four synchronized engineering divisions: Data Engineering (high-throughput ETL, vector databases, synthetic dataset generation), Artificial Intelligence (domain LLM fine-tuning, computer vision, low-latency inference), Software Engineering (cloud-native microservices, WebGL/Three.js spatial applications, real-time sync), and Cybersecurity (zero-trust architecture, automated vulnerability scanning, ISO/SOC compliance).",
    capabilities: ["Distributed Systems", "Cloud-Native K8s", "Vector Storage", "Real-Time APIs"],
    metrics: "99.99% Architecture SLA",
    iconType: "software",
  },
  {
    id: "ai-systems",
    category: "ai",
    categoryLabel: "Artificial Intelligence",
    question: "How does Ferrivox train, fine-tune, and deploy AI models for production?",
    shortAnswer:
      "We design custom end-to-end model workflows—from proprietary dataset curation and quantization to TensorRT-optimized Kubernetes inference clusters.",
    detailedAnswer:
      "Rather than relying on generic wrapper APIs, Ferrivox builds production-grade AI infrastructure. We curate and clean domain datasets, fine-tune state-of-the-art open models (Llama, DeepSeek, Whisper, Mistral), implement hybrid semantic/vector search (RAG), and deploy high-concurrency inference engines with sub-80ms p95 latency using ONNX Runtime, vLLM, and TensorRT on GPU/NPU clusters.",
    capabilities: ["RAG Pipelines", "Model Quantization", "vLLM / TensorRT", "Sub-80ms Inference"],
    metrics: "< 80ms p95 Latency",
    iconType: "ai",
  },
  {
    id: "data-pipeline",
    category: "data",
    categoryLabel: "Data Engineering",
    question: "What is Ferrivox's data engineering and annotation methodology?",
    shortAnswer:
      "We build automated data pipelines and human-in-the-loop annotation workflows that turn raw multimodal data into structured training sets.",
    detailedAnswer:
      "Our data engineering division handles unstructured data ingestion, cleansing, deduplication, and quality scoring at scale. For supervised learning and evaluation benchmarks, our Kigali-based data specialists perform precision human-in-the-loop annotation across text, audio, and computer vision with double-blind verification algorithms to guarantee greater than 99.2% labeling consensus.",
    capabilities: ["Multimodal ETL", "Vector Embeddings", "Double-Blind Verification", "Stream Processing"],
    metrics: "99.2% Labeling Accuracy",
    iconType: "data",
  },
  {
    id: "security-compliance",
    category: "security",
    categoryLabel: "Cybersecurity",
    question: "How does Ferrivox protect client source code and sensitive data?",
    shortAnswer:
      "Every architecture implements an uncompromising zero-trust perimeter with AES-256 encryption at rest, TLS 1.3 in transit, and tenant-isolated VPCs.",
    detailedAnswer:
      "Security is foundational, not an afterthought. We enforce strict role-based access control (RBAC), end-to-end encryption for all data stores, ephemeral secrets management via Vault, automated CI/CD static/dynamic penetration testing, and strict data sovereignty compliance. Clients retain full ownership and intellectual property of all code and model artifacts.",
    capabilities: ["Zero-Trust Network", "Ephemeral Secrets", "Tenant Isolation", "Full IP Ownership"],
    metrics: "ISO 27001 Aligned",
    iconType: "security",
  },
  {
    id: "delivery-models",
    category: "delivery",
    categoryLabel: "Delivery & Teams",
    question: "What engagement models does Ferrivox offer for engineering projects?",
    shortAnswer:
      "We offer three delivery models: Dedicated Embedded Squads, Milestone-Based Fixed-Scope Delivery, and Technical Advisory Consulting.",
    detailedAnswer:
      "1) Dedicated Squads: High-performance, senior engineering squads that integrate directly into your Jira/Slack and ship in weekly sprints. 2) Fixed-Scope Builds: Complete turnkey product architecture from prototype to production deployment with guaranteed delivery timelines. 3) Architecture Consulting: Senior systems auditing, security reviews, and AI infrastructure roadmapping.",
    capabilities: ["Embedded Squads", "Sprint-Based Delivery", "Fixed-Scope Turnkey", "Direct Slack Access"],
    metrics: "1–2 Week Onboarding",
    iconType: "delivery",
  },
  {
    id: "ishami-simulation",
    category: "ai",
    categoryLabel: "3D Simulations",
    question: "What is Ishami, and how does it demonstrate your 3D and AI capabilities?",
    shortAnswer:
      "Ishami is our flagship 3D traffic simulation and AI driving education platform, built with WebGL and real-time behavioral neural networks.",
    detailedAnswer:
      "Ishami showcases Ferrivox's full-stack engineering muscle: interactive procedural 3D Kigali road environments rendered in real-time WebGL/Three.js, physics-based vehicle dynamics, procedural pedestrian AI, and an adaptive multilingual computer vision test examiner that trains and prepares drivers for official certification.",
    capabilities: ["WebGL / Three.js 3D", "Physics Engine", "Procedural Traffic", "Multilingual Evaluation"],
    metrics: "60 FPS Web Simulation",
    iconType: "simulation",
  },
]

/* ── 3D Isometric SVG Icons ──────────────────────────── */

function FAQIcon({ type }: { type: FAQItem["iconType"] }) {
  switch (type) {
    case "ai":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <defs>
            <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="coreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          {/* Isometric Cube / Neural Core */}
          <path d="M32 6 L54 18 L54 44 L32 56 L10 44 L10 18 Z" fill="#0f172a" stroke="url(#aiGrad)" strokeWidth="1.5" />
          <path d="M32 6 L32 32 L54 18 Z" fill="rgba(96, 165, 250, 0.15)" />
          <path d="M32 32 L10 18 L32 6 Z" fill="rgba(56, 189, 248, 0.25)" />
          <path d="M32 32 L54 44 L32 56 L10 44 Z" fill="rgba(30, 58, 138, 0.4)" />
          {/* Central AI Nucleus */}
          <circle cx="32" cy="32" r="7" fill="url(#coreGrad)" />
          <circle cx="32" cy="32" r="3.5" fill="#ffffff" />
          {/* Neural Ray Lines */}
          <line x1="32" y1="12" x2="32" y2="25" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="45" y1="24" x2="37" y2="29" stroke="#60a5fa" strokeWidth="1.5" />
          <line x1="19" y1="24" x2="27" y2="29" stroke="#60a5fa" strokeWidth="1.5" />
          <line x1="32" y1="39" x2="32" y2="50" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      )

    case "data":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <defs>
            <linearGradient id="dataGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Tiered Data Cylinders / Isometric Pipeline */}
          <ellipse cx="32" cy="16" rx="20" ry="7" fill="#13271e" stroke="url(#dataGrad)" strokeWidth="1.5" />
          <path d="M12 16 v12 c0 4 9 7 20 7 s20 -3 20 -7 v-12" fill="rgba(16, 185, 129, 0.15)" stroke="url(#dataGrad)" strokeWidth="1.5" />
          <path d="M12 28 v12 c0 4 9 7 20 7 s20 -3 20 -7 v-12" fill="rgba(5, 150, 105, 0.25)" stroke="url(#dataGrad)" strokeWidth="1.5" />
          <ellipse cx="32" cy="28" rx="20" ry="7" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <ellipse cx="32" cy="40" rx="20" ry="7" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Vertical Data Stream Pulse */}
          <line x1="32" y1="10" x2="32" y2="48" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      )

    case "software":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <defs>
            <linearGradient id="swGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* 3D Interlocking Architecture Node */}
          <rect x="14" y="14" width="36" height="36" rx="8" fill="#1e1b4b" stroke="url(#swGrad)" strokeWidth="1.5" />
          <rect x="20" y="20" width="10" height="10" rx="3" fill="rgba(168, 85, 247, 0.4)" stroke="#c084fc" strokeWidth="1" />
          <rect x="34" y="20" width="10" height="10" rx="3" fill="rgba(99, 102, 241, 0.4)" stroke="#818cf8" strokeWidth="1" />
          <rect x="20" y="34" width="10" height="10" rx="3" fill="rgba(99, 102, 241, 0.4)" stroke="#818cf8" strokeWidth="1" />
          <rect x="34" y="34" width="10" height="10" rx="3" fill="rgba(168, 85, 247, 0.4)" stroke="#c084fc" strokeWidth="1" />
          {/* Central Bus Interconnect */}
          <line x1="25" y1="30" x2="25" y2="34" stroke="#e0e7ff" strokeWidth="1.5" />
          <line x1="39" y1="30" x2="39" y2="34" stroke="#e0e7ff" strokeWidth="1.5" />
          <line x1="30" y1="25" x2="34" y2="25" stroke="#e0e7ff" strokeWidth="1.5" />
          <line x1="30" y1="39" x2="34" y2="39" stroke="#e0e7ff" strokeWidth="1.5" />
        </svg>
      )

    case "security":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <defs>
            <linearGradient id="secGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Isometric Shield & Keylock Matrix */}
          <path
            d="M32 8 L50 16 v16 c0 13 -18 24 -18 24 s-18 -11 -18 -24 V16 Z"
            fill="#082f49"
            stroke="url(#secGrad)"
            strokeWidth="1.5"
          />
          <path
            d="M32 14 L44 20 v12 c0 9 -12 17 -12 17 s-12 -8 -12 -17 V20 Z"
            fill="rgba(56, 189, 248, 0.15)"
            stroke="rgba(56, 189, 248, 0.5)"
            strokeWidth="1"
          />
          <circle cx="32" cy="28" r="4.5" fill="#38bdf8" />
          <path d="M30 31 h4 l1 8 h-6 Z" fill="#38bdf8" />
        </svg>
      )

    case "delivery":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <defs>
            <linearGradient id="delivGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Global Orbital Nodes / Squad Topology */}
          <circle cx="32" cy="32" r="18" fill="#1c1917" stroke="url(#delivGrad)" strokeWidth="1.5" />
          <ellipse cx="32" cy="32" rx="18" ry="7" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1" />
          <ellipse cx="32" cy="32" rx="7" ry="18" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1" />
          <circle cx="32" cy="32" r="4" fill="#fbbf24" />
          {/* Synchronized Orbiting Satellites */}
          <circle cx="16" cy="28" r="3" fill="#ffffff" />
          <circle cx="48" cy="36" r="3" fill="#ffffff" />
        </svg>
      )

    case "simulation":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <defs>
            <linearGradient id="simGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>
          {/* 3D Wireframe Vehicle / Spatial Grid */}
          <path d="M12 42 L24 22 L40 22 L52 42 Z" fill="rgba(236, 72, 153, 0.15)" stroke="url(#simGrad)" strokeWidth="1.5" />
          <line x1="24" y1="22" x2="24" y2="42" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="1" />
          <line x1="40" y1="22" x2="40" y2="42" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="1" />
          <circle cx="20" cy="44" r="5" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" />
          <circle cx="44" cy="44" r="5" fill="#1e1b4b" stroke="#ec4899" strokeWidth="1.5" />
          {/* Spatial Radar Pulse Arc */}
          <path d="M26 14 A 10 10 0 0 1 38 14" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 10 A 16 16 0 0 1 42 10" fill="none" stroke="rgba(244, 114, 182, 0.5)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      )
  }
}

/* ── Interactive 3D Card with Perspective & Dynamic Shadow ── */

function Interactive3DCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: FAQItem
  isExpanded: boolean
  onToggle: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max 8deg tilt for natural, high-end feel
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    setRotate({ x: rotateX, y: rotateY })
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }, [])

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
    setMousePos({ x: 50, y: 50 })
  }

  return (
    <div
      style={{ perspective: 1200 }}
      className="h-full transition-transform duration-300 ease-out"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onToggle}
        className="group relative h-full rounded-2xl p-7 md:p-8 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between"
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-4px) translateZ(8px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)",
          transformStyle: "preserve-3d",
          background: "linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(10, 14, 23, 0.95) 100%)",
          border: isHovered
            ? "1px solid rgba(96, 165, 250, 0.4)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isHovered
            ? "0 22px 50px -10px rgba(5, 8, 16, 0.95), 0 0 35px -5px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Dynamic Specular 3D Reflection Surface */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(59, 130, 246, 0.14), transparent 80%)`,
          }}
        />

        {/* Card Header: Icon + Category + Metric */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div
              className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-105"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.5)",
              }}
            >
              <FAQIcon type={item.iconType} />
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                {item.categoryLabel}
              </span>
              <span className="text-xs font-mono text-slate-400 mt-1">
                {item.metrics}
              </span>
            </div>
          </div>

          {/* Question Title */}
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-blue-300 transition-colors">
            {item.question}
          </h3>

          {/* Short Answer Preview */}
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">
            {item.shortAnswer}
          </p>

          {/* Expandable Technical Depth Accordion */}
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: isExpanded ? "400px" : "0px",
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div className="pt-4 mt-4 border-t border-white/10 text-xs md:text-sm text-slate-400 leading-relaxed">
              {item.detailedAnswer}
            </div>

            {/* Capability Spec Chips */}
            <div className="flex flex-wrap gap-2 pt-4">
              {item.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-950/40 text-blue-300 border border-blue-800/30"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer: Accordion Toggle Indicator + CTA */}
        <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs">
          <button
            type="button"
            className="flex items-center gap-1.5 font-medium text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Collapse Details" : "View Architecture Details"}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <a
            href="#contact"
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/link"
          >
            <span>Consult squad</span>
            <span className="inline-block transition-transform group-hover/link:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── FAQSection Main Component ───────────────────────── */

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<FAQItem["category"]>("all")
  const [expandedId, setExpandedId] = useState<string | null>("services-overview")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = FAQ_DATA.filter((item) => {
    const matchesCategory = activeTab === "all" || item.category === activeTab
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detailedAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capabilities.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesCategory && matchesSearch
  })

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const TABS: { id: FAQItem["category"]; label: string }[] = [
    { id: "all", label: "All Topics" },
    { id: "software", label: "Software Systems" },
    { id: "ai", label: "AI & Models" },
    { id: "data", label: "Data Pipelines" },
    { id: "security", label: "Security & Trust" },
    { id: "delivery", label: "Squad Delivery" },
  ]

  return (
    <section
      id="faq"
      className="py-24 md:py-32 px-6 md:px-10 border-t border-white/5 scroll-mt-16 relative"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, #1e1b4b 60%, transparent 80%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Engineering Knowledge Base</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl leading-relaxed text-base md:text-lg">
              Explore how Ferrivox architectures, trains, secures, and ships
              enterprise-grade intelligent software from Kigali to the world.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capabilities, models, SLAs..."
                className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl outline-none transition-all text-slate-200 placeholder-slate-500"
                style={{
                  background: "rgba(17, 24, 39, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(59, 130, 246, 0.5)"
                  e.target.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.2)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"
                  e.target.style.boxShadow = "none"
                }}
              />
              <svg
                className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30"
                    : "text-slate-400 hover:text-white bg-slate-900/60 border border-white/5 hover:border-white/10"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 3D Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredItems.map((item) => (
              <Interactive3DCard
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggle={() => toggleExpand(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl border border-white/5 bg-slate-900/30">
            <p className="text-slate-400 text-base">
              No matching questions found for "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setActiveTab("all")
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              Reset search & filters
            </button>
          </div>
        )}

        {/* Bottom Contact Inquiries Callout */}
        <div
          className="mt-14 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border"
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 14, 23, 0.95) 100%)",
            borderColor: "rgba(59, 130, 246, 0.2)",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight">
              Have a custom architectural requirement or RFP?
            </h4>
            <p className="text-slate-400 text-sm mt-1">
              Speak directly with our senior systems architects and AI researchers.
            </p>
          </div>

          <a
            href="#contact"
            className="btn-primary px-6 py-2.5 text-sm font-semibold rounded-lg whitespace-nowrap"
          >
            Initiate Architecture Review
          </a>
        </div>
      </div>
    </section>
  )
}
