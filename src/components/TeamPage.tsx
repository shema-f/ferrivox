import { useState, lazy, Suspense } from "react"

import Reveal from "./Reveal"

import { TEAM } from "../types"

import SiteFooter from "./SiteFooter"

const FeriChatbot = lazy(() => import("./FeriChatbot"))

/* ── Page shell helpers (mirror CorpSite styles) ────── */

function PageNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(5, 8, 16, 0.85)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="/" className="text-sm font-semibold text-white" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
          ← Ferrivox
        </a>

        <nav className="flex items-center gap-1">
          <a href="/#divisions" className="hidden sm:block px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
            Technology
          </a>

          <a href="/#products" className="hidden sm:block px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
            Products
          </a>

          <a href="/#contact" className="btn-primary ml-3 px-5 py-2 text-xs font-semibold rounded-lg">
            Start a Project
          </a>
        </nav>
      </div>
    </header>
  )
}

/* ── Team page ──────────────────────────────────────── */

export default function TeamPage() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div
      className="w-full min-h-full"
      style={{ background: "linear-gradient(180deg, #050810 0%, #0a0e17 50%, #050810 100%)" }}
    >
      <PageNav />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 px-6 md:px-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.12), transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto relative">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 mb-6">Team</div>
          </Reveal>

          <Reveal delay={100}>
            <h1
              className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl"
              style={{ fontFamily: '"HYWenHei", sans-serif' }}
            >
              <span className="text-white">Engineers.</span>{" "}
              <span className="text-gradient">Builders.</span>{" "}
              <span className="text-white">Problem-solvers.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base md:text-xl text-slate-400 mt-6 max-w-2xl leading-relaxed">
              A small team with an outsized standard: measure quality, ship real systems, and treat every product like it carries the company's name — because it does.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM GRID ── */}
      <section className="pb-20 md:pb-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 80}>
                <div className="glass-panel rounded-2xl p-6 h-full flex flex-col hover:border-blue-500/30 transition-all duration-300">
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold text-white mb-5"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", fontFamily: '"HYWenHei", sans-serif' }}
                  >
                    {member.initials}
                  </div>

                  <h3 className="text-base font-bold text-white" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                    {member.name}
                  </h3>

                  <div className="text-xs text-blue-300/80 mt-1">{member.role}</div>

                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">{member.division}</div>

                  <p className="text-sm text-slate-400 mt-3 leading-relaxed flex-1">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section className="pb-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="glass-panel rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: '"HYWenHei", sans-serif' }}>
                Want to build with us?
              </h2>

              <p className="text-slate-400 mt-3 max-w-lg mx-auto leading-relaxed">
                We're always looking for engineers who care about the craft. Tell us what you've built — degrees optional.
              </p>

              <a
                href="mailto:hello@ferrivox.com?subject=Joining%20Ferrivox"
                className="btn-primary inline-block px-7 py-3.5 text-sm font-semibold rounded-xl mt-6"
              >
                hello@ferrivox.com
              </a>
            </div>
          </Reveal>
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
