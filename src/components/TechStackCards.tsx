import React, { useState } from "react"

export interface TechItem {
  name: string
  category: "frontend" | "language" | "backend" | "ai" | "database" | "infra"
  role: string
  description: string
  accentColor: string
  glowColor: string
  icon: React.ReactNode
}

/* ── Authentic Crisp SVG Brand Logos ─────────────────── */

function ReactIcon() {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  )
}

function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <rect width="32" height="32" rx="4" fill="#3178c6" />
      <path
        d="M17.8 19.3c.4 1.4 1.6 2.3 3.3 2.3 1.5 0 2.5-.7 2.5-1.8 0-1.1-.9-1.6-2.5-2.2l-1.1-.4c-2.3-.9-3.4-2.1-3.4-4 0-2.4 1.9-4.2 4.9-4.2 2.7 0 4.4 1.4 4.8 3.5h-2.5c-.3-1.1-1.1-1.7-2.3-1.7-1.3 0-2.1.7-2.1 1.7 0 .9.7 1.4 2.1 1.9l1.1.4c2.6 1 3.8 2.2 3.8 4.2 0 2.7-2.1 4.3-5.2 4.3-3.1 0-5-1.6-5.4-4h2.5zM6.5 11.2h8.5v2.3h-3v10.5h-2.6V13.5h-2.9v-2.3z"
        fill="#ffffff"
      />
    </svg>
  )
}

function NodeJSIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <path
        d="M16 2.5l11.7 6.8v13.4L16 29.5 4.3 22.7V9.3L16 2.5z"
        fill="#339933"
      />
      <path
        d="M16 4.8L6.3 10.4v11.2L16 27.2l9.7-5.6V10.4L16 4.8z"
        fill="#022a02"
        opacity="0.3"
      />
      <path
        d="M16 9.5c-3.6 0-5.8 2.1-5.8 5.3 0 3.3 2 4.5 4.8 5.2l1.1.3c1.7.4 2.3.9 2.3 1.7 0 1-.9 1.6-2.4 1.6-1.8 0-2.8-.7-3.1-2h-2.4c.3 2.3 2.3 3.8 5.5 3.8 3.5 0 5.8-1.9 5.8-5.1 0-3-1.9-4.3-4.8-5l-1.1-.3c-1.6-.4-2.3-.8-2.3-1.7 0-.9.8-1.5 2.1-1.5 1.5 0 2.4.6 2.7 1.8h2.4c-.3-2.1-2.1-3.6-4.7-3.6z"
        fill="#ffffff"
      />
    </svg>
  )
}

function PythonIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <defs>
        <linearGradient id="pyBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#387eb8" />
          <stop offset="100%" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="pyYellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe873" />
          <stop offset="100%" stopColor="#ffd43b" />
        </linearGradient>
      </defs>
      {/* Top Snake */}
      <path
        d="M15.9 3c-4.4 0-4.1 1.9-4.1 1.9l.01 2h4.2v.6H9.2s-2.9-.3-2.9 4.3 2.5 4.4 2.5 4.4h1.5v-2.1s-.1-2.5 2.5-2.5h4.3s2.4.04 2.4-2.3V5.4S19.9 3 15.9 3zm-2.4 1.4c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7z"
        fill="url(#pyBlue)"
      />
      {/* Bottom Snake */}
      <path
        d="M16.1 29c4.4 0 4.1-1.9 4.1-1.9l-.01-2h-4.2v-.6h6.8s2.9.3 2.9-4.3-2.5-4.4-2.5-4.4h-1.5v2.1s.1 2.5-2.5 2.5h-4.3s-2.4-.04-2.4 2.3v3.3s-.4 2.4 3.6 2.4zm2.4-1.4c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z"
        fill="url(#pyYellow)"
      />
    </svg>
  )
}

function ThreeJSIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      {/* Three.js Triangles Facets */}
      <polygon points="16,3 5,22 16,16" fill="#f8fafc" />
      <polygon points="16,3 16,16 27,22" fill="#cbd5e1" />
      <polygon points="16,16 5,22 16,29" fill="#94a3b8" />
      <polygon points="16,16 16,29 27,22" fill="#64748b" />
    </svg>
  )
}

function PostgreSQLIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <defs>
        <linearGradient id="pgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a8ec2" />
          <stop offset="100%" stopColor="#336791" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" fill="#1b2a38" />
      {/* Elephant Profile */}
      <path
        d="M16 6c-4.5 0-7 2.5-7 5.5 0 2 .9 3.5 2.5 4.5l-.5 4.5c-.2 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5v-2h2v2c0 1.5 1 2.5 2.5 2.5s2.7-1 2.5-2.5l-.5-4.5c1.6-1 2.5-2.5 2.5-4.5C25 8.5 21.5 6 16 6zm-3 5.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        fill="url(#pgGrad)"
      />
    </svg>
  )
}

function SupabaseIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <defs>
        <linearGradient id="sbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ecf8e" />
          <stop offset="100%" stopColor="#24b47e" />
        </linearGradient>
      </defs>
      <path
        d="M17.5 3.5c-.4-.7-1.4-.8-1.9-.2L3.9 17.1c-.6.8 0 1.9 1 1.9h10.6L14.5 28.5c.4.7 1.4.8 1.9.2l11.7-13.8c.6-.8 0-1.9-1-1.9H16.5l1-9.3z"
        fill="url(#sbGrad)"
      />
    </svg>
  )
}

function DockerIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
      <rect width="32" height="32" rx="6" fill="#0b243b" />
      <g fill="#2496ed">
        <rect x="7" y="11" width="3.2" height="3.2" rx="0.5" />
        <rect x="11" y="11" width="3.2" height="3.2" rx="0.5" />
        <rect x="15" y="11" width="3.2" height="3.2" rx="0.5" />
        <rect x="11" y="7" width="3.2" height="3.2" rx="0.5" />
        <rect x="15" y="7" width="3.2" height="3.2" rx="0.5" />
        <rect x="19" y="11" width="3.2" height="3.2" rx="0.5" />
        {/* Whale Body */}
        <path d="M26.5 15.5c-.5-.2-1.8-.3-2.5.4-.5-.8-1.5-1.4-2.8-1.4H4.5c-.5 0-.8.3-.9.7-.3 1.8.2 4.4 1.8 6.2C7.3 23.5 10.2 24 13.5 24c7.2 0 11.8-3.8 12.8-8.2.2 0 .5-.2.7-.3h-.5z" />
        <circle cx="9" cy="18" r="0.8" fill="#ffffff" />
      </g>
    </svg>
  )
}

function CloudInfraIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
      <defs>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" fill="#082f49" />
      {/* Cloud & Cluster Lines */}
      <path
        d="M9 18a4 4 0 0 1 7.8-1.2A3.5 3.5 0 0 1 23 18a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6z"
        fill="url(#cloudGrad)"
      />
      {/* Server Base Node */}
      <rect x="8" y="22" width="16" height="4" rx="1" fill="#0ea5e9" opacity="0.8" />
      <circle cx="11" cy="24" r="0.8" fill="#ffffff" />
      <circle cx="14" cy="24" r="0.8" fill="#a5f3fc" />
    </svg>
  )
}

function AIModelsIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
      <defs>
        <linearGradient id="tensorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" fill="#1e1b4b" />
      {/* Neural Core Lattice */}
      <circle cx="16" cy="16" r="4.5" fill="url(#tensorGrad)" />
      <circle cx="8" cy="10" r="2.5" fill="#c084fc" />
      <circle cx="24" cy="10" r="2.5" fill="#c084fc" />
      <circle cx="8" cy="22" r="2.5" fill="#818cf8" />
      <circle cx="24" cy="22" r="2.5" fill="#818cf8" />
      {/* Connectors */}
      <line x1="8" y1="10" x2="16" y2="16" stroke="#c084fc" strokeWidth="1.2" opacity="0.7" />
      <line x1="24" y1="10" x2="16" y2="16" stroke="#c084fc" strokeWidth="1.2" opacity="0.7" />
      <line x1="8" y1="22" x2="16" y2="16" stroke="#818cf8" strokeWidth="1.2" opacity="0.7" />
      <line x1="24" y1="22" x2="16" y2="16" stroke="#818cf8" strokeWidth="1.2" opacity="0.7" />
    </svg>
  )
}

function APIsIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
      <defs>
        <linearGradient id="apiGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" fill="#3b0712" />
      {/* Lightning REST/GraphQL Exchange */}
      <circle cx="8" cy="16" r="3" fill="url(#apiGrad)" />
      <circle cx="24" cy="16" r="3" fill="url(#apiGrad)" />
      <path
        d="M11 14h10 M11 18h10"
        stroke="#fda4af"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <path
        d="M15 11l4 5-4 5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── Full Tech Stack Catalog matching User Screenshot ── */

export const TECH_ITEMS: TechItem[] = [
  {
    name: "React",
    category: "frontend",
    role: "UI Architecture",
    description: "Component-driven, concurrent SPA frontend with fine-grained reactivity.",
    accentColor: "#61dafb",
    glowColor: "rgba(97, 218, 251, 0.25)",
    icon: <ReactIcon />,
  },
  {
    name: "TypeScript",
    category: "language",
    role: "Type Safety",
    description: "End-to-end typed contracts across client state, APIs, and microservices.",
    accentColor: "#3178c6",
    glowColor: "rgba(49, 120, 198, 0.25)",
    icon: <TypeScriptIcon />,
  },
  {
    name: "Node.js",
    category: "backend",
    role: "Runtime Engine",
    description: "High-throughput asynchronous I/O powering distributed services.",
    accentColor: "#339933",
    glowColor: "rgba(51, 153, 51, 0.25)",
    icon: <NodeJSIcon />,
  },
  {
    name: "Python",
    category: "language",
    role: "AI & ML Core",
    description: "PyTorch & tensor pipelines for model fine-tuning and mathematical compute.",
    accentColor: "#ffd43b",
    glowColor: "rgba(255, 212, 59, 0.2)",
    icon: <PythonIcon />,
  },
  {
    name: "Three.js",
    category: "frontend",
    role: "3D WebGL",
    description: "Hardware-accelerated 3D spatial graphics, shaders, and simulation environments.",
    accentColor: "#f8fafc",
    glowColor: "rgba(255, 255, 255, 0.2)",
    icon: <ThreeJSIcon />,
  },
  {
    name: "PostgreSQL",
    category: "database",
    role: "Relational DB",
    description: "ACID-compliant relational persistence with pgvector semantic similarity.",
    accentColor: "#4a8ec2",
    glowColor: "rgba(74, 142, 194, 0.25)",
    icon: <PostgreSQLIcon />,
  },
  {
    name: "Supabase",
    category: "backend",
    role: "Backend & Auth",
    description: "Real-time edge events, row-level security (RLS), and database automation.",
    accentColor: "#3ecf8e",
    glowColor: "rgba(62, 207, 142, 0.25)",
    icon: <SupabaseIcon />,
  },
  {
    name: "Docker",
    category: "infra",
    role: "Containerization",
    description: "Deterministic container environments for microservice orchestration.",
    accentColor: "#2496ed",
    glowColor: "rgba(36, 150, 237, 0.25)",
    icon: <DockerIcon />,
  },
  {
    name: "Cloud Infrastructure",
    category: "infra",
    role: "Global Scaling",
    description: "Multi-region Kubernetes, CDN caching, and zero-trust VPC networks.",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.25)",
    icon: <CloudInfraIcon />,
  },
  {
    name: "AI Models",
    category: "ai",
    role: "Neural Inference",
    description: "Domain fine-tuned LLMs, vision transformers, and TensorRT runtime engines.",
    accentColor: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.25)",
    icon: <AIModelsIcon />,
  },
  {
    name: "APIs",
    category: "backend",
    role: "Interconnect",
    description: "Sub-millisecond REST, GraphQL, and streaming gRPC microservice interfaces.",
    accentColor: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.25)",
    icon: <APIsIcon />,
  },
]

/* ── Interactive 3D Card for Individual Tech ─────────── */

function TechCard({ item }: { item: TechItem }) {
  const [isHovered, setIsHovered] = useState(false)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    setRotate({
      x: ((y - centerY) / centerY) * -8,
      y: ((x - centerX) / centerX) * 8,
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      style={{ perspective: 900 }}
      className="transition-transform duration-200"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group p-4 rounded-xl transition-all duration-300 select-none flex flex-col justify-between h-full"
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-4px) translateZ(6px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)",
          transformStyle: "preserve-3d",
          background: "linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 14, 23, 0.95) 100%)",
          border: isHovered
            ? `1px solid ${item.accentColor}`
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isHovered
            ? `0 16px 36px -8px rgba(0, 0, 0, 0.9), 0 0 24px -4px ${item.glowColor}, inset 0 1px 1px rgba(255, 255, 255, 0.15)`
            : "0 4px 12px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Dynamic Specular Sheen */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${item.glowColor}, transparent 70%)`,
          }}
        />

        {/* Card Top: Logo + Name + Category Pill */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div
              className="p-2 rounded-lg transition-transform duration-200 group-hover:scale-110 flex items-center justify-center shrink-0"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
              }}
            >
              {item.icon}
            </div>

            <span
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                color: item.accentColor,
                background: "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${item.accentColor}33`,
              }}
            >
              {item.role}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
            {item.name}
          </h3>

          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Subtle Micro Indicator */}
        <div className="pt-2.5 mt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: item.accentColor }}
            />
            <span>Production Stack</span>
          </span>
          <span className="text-slate-600">Ferrivox</span>
        </div>
      </div>
    </div>
  )
}

/* ── Full TechStackSection Component ─────────────────── */

export default function TechStackCards() {
  const [filter, setFilter] = useState<string>("all")

  const categories = [
    { id: "all", label: "All Technologies" },
    { id: "frontend", label: "Frontend & 3D" },
    { id: "backend", label: "Backend & APIs" },
    { id: "language", label: "Languages" },
    { id: "database", label: "Data Stores" },
    { id: "infra", label: "Infra & Cloud" },
    { id: "ai", label: "AI Models" },
  ]

  const filteredItems = TECH_ITEMS.filter((item) => {
    if (filter === "all") return true
    if (filter === "frontend") return item.category === "frontend"
    if (filter === "backend") return item.category === "backend"
    if (filter === "language") return item.category === "language"
    if (filter === "database") return item.category === "database"
    if (filter === "infra") return item.category === "infra"
    if (filter === "ai") return item.category === "ai"
    return true
  })

  return (
    <section className="py-14 md:py-20 border-y border-white/5 bg-gradient-to-b from-white/[0.01] via-white/[0.02] to-transparent relative">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15), transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-[11px] font-mono text-blue-400 uppercase tracking-[0.25em] flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Built With</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Enterprise Engineering Stack
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Engineered with world-class languages, modern runtimes, distributed databases, and spatial 3D frameworks.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  filter === cat.id
                    ? "bg-blue-600/90 text-white border border-blue-400/40 shadow-sm shadow-blue-500/30"
                    : "text-slate-400 hover:text-white bg-slate-900/60 border border-white/5 hover:border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Tech Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
          {filteredItems.map((item) => (
            <TechCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
