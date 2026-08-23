import { useState, useEffect } from "react";
import type { SceneId } from "../types";
import { SCENE_LABELS, SCENE_DESCRIPTIONS } from "../types";
import FeriivoxLogo from "./FeriivoxLogo";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";
import FeriChatbot from "./FeriChatbot";
import Newsletter from "./Newsletter";

const SERVICES: Array<{ id: SceneId; label: string; description: string; icon: string }> = [
  { id: "data",     label: "Data & Analytics",    description: "Turn data into decisions",            icon: "📊" },
  { id: "software", label: "Software Engineering", description: "Platforms, APIs & systems",          icon: "💻" },
  { id: "security", label: "Cybersecurity",        description: "Protect what matters",               icon: "🛡️" },
  { id: "ai",       label: "AI & Automation",      description: "Intelligent workflows",              icon: "🤖" },
];

const TOP_NAV: Array<{ id: SceneId; label: string }> = [
  { id: "hq",       label: "HOME" },
  { id: "globe",    label: "ABOUT" },
  { id: "lobby",    label: "PRODUCTS" },
  { id: "contact",  label: "CONTACT" },
];

interface ContactFormData {
  type: string;
  company: string;
  email: string;
  message: string;
}

interface UIOverlayProps {
  sceneId: SceneId;
  onNavigate: (id: SceneId) => void;
}

/* ── Inline SVG social icons ────────────────────────── */

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 003.76.92V6.34a4.85 4.85 0 01-1-.65z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function AIChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M18 14h.01" />
      <path d="M6 14h.01" />
      <rect x="2" y="13" width="20" height="8" rx="2" />
      <path d="M12 17v2" />
      <path d="M9 17h6" />
    </svg>
  );
}

function ContactForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState<ContactFormData>({
    type: "",
    company: "",
    email: "",
    message: "",
  });
  const [step, setStep] = useState<"type" | "details" | "done">("type");

  const PROJECT_TYPES = [
    "Software", "AI / ML", "Data", "Cybersecurity", "Infrastructure", "Other",
  ];

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
        <div className="w-20 h-px mt-2" style={{ background: "rgba(59, 130, 246, 0.3)" }} />
        <div className="text-xs text-slate-500">hello@ferrivox.com</div>
      </div>
    );
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
              onClick={() => { setForm((f) => ({ ...f, type: t })); setStep("details"); }}
              className="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-left"
              style={{ color: "#e2e8f0", border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.05)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.2)"; }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="text-xs px-2.5 py-1 rounded-md font-medium"
          style={{ color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.1)" }}>
          {form.type}
        </div>
        <button onClick={() => setStep("type")} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          Change
        </button>
      </div>
      {(["company", "email", "message"] as (keyof ContactFormData)[]).map((field) => (
        <div key={field} className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {field === "message" ? "Tell us about your project" : field === "company" ? "Company name" : "Email address"}
          </label>
          {field === "message" ? (
            <textarea rows={3} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              placeholder="Brief description of your project..."
              className="w-full px-3 py-2.5 text-sm rounded-lg resize-none outline-none transition-all"
              style={{ color: "#e2e8f0", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.5)"; e.target.style.background = "rgba(59,130,246,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.2)"; e.target.style.background = "rgba(59,130,246,0.05)"; }}
            />
          ) : (
            <input type={field === "email" ? "email" : "text"} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              placeholder={field === "email" ? "you@company.com" : "Acme Inc."}
              className="w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-all"
              style={{ color: "#e2e8f0", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.5)"; e.target.style.background = "rgba(59,130,246,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(59,130,246,0.2)"; e.target.style.background = "rgba(59,130,246,0.05)"; }}
            />
          )}
        </div>
      ))}
      <button
        onClick={() => { if (form.email && form.company) { setStep("done"); setTimeout(onSubmit, 3000); } }}
        className="mt-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200"
        style={{ color: "#ffffff", background: "#3b82f6" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#3b82f6"; }}
      >
        Send Message
      </button>
    </div>
  );
}

export default function UIOverlay({ sceneId, onNavigate }: UIOverlayProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const isFloor = ["data", "software", "security", "ai"].includes(sceneId);
  const isLobby = sceneId === "lobby";
  const isHQ = sceneId === "hq";
  const isContact = sceneId === "contact";

  const socialLinks = [
    { name: "TikTok", icon: TikTokIcon, url: "https://www.tiktok.com/@ferrivox" },
    { name: "Instagram", icon: InstagramIcon, url: "https://www.instagram.com/ferrivox" },
    { name: "YouTube", icon: YouTubeIcon, url: "https://www.youtube.com/@ferrivox" },
    { name: "LinkedIn", icon: LinkedInIcon, url: "https://www.linkedin.com/company/ferrivox" },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Subtle scanlines */}
      <div className="hud-scanlines absolute inset-0" />

      {/* ── HEADER / NAVIGATION ───────────────────────── */}
      <header
        className="relative pointer-events-auto z-50"
        style={{
          background: "rgba(10, 14, 23, 0.5)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between" style={{ height: "64px" }}>
          {/* Logo — zoomed in to show only the text, modern text-only look */}
          <button
            onClick={() => onNavigate("hq")}
            className="flex flex-col items-start hover:opacity-80 transition-opacity"
          >
            <div
              className="logo-container"
              style={{
                animation: logoVisible ? "logo-reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none",
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
                fontFamily: "Inter, sans-serif",
                fontSize: "7px",
                fontWeight: 500,
                letterSpacing: "0.3em",
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
              const isActive = sceneId === item.id;
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
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(203, 213, 225, 0.7)";
                  }}
                >
                  {item.label}
                  {/* Active underline with blue glow */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-8"
                      style={{
                        background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                        boxShadow: "0 0 8px rgba(59, 130, 246, 0.6), 0 0 16px rgba(59, 130, 246, 0.3)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {TOP_NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all"
                style={{ color: sceneId === item.id ? "#ffffff" : "#94a3b8", background: sceneId === item.id ? "rgba(59,130,246,0.15)" : "transparent" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT AREA ────────────────────────── */}
      <div className="flex-1 relative pointer-events-none">
        {/* Left side dot navigation */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40 pointer-events-auto">
          {["hq", "lobby", "district", "globe", "contact"].map((id) => {
            const isActive = sceneId === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id as SceneId)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: isActive ? "#3b82f6" : "rgba(100, 116, 139, 0.3)",
                  boxShadow: isActive ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none",
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                }}
                title={SCENE_LABELS[id as SceneId]}
              />
            );
          })}
        </div>

        {/* ── HQ Scene ── */}
        {isHQ && (
          <div className="absolute bottom-28 left-0 right-0 px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.6)" }}>
                Kigali, Rwanda
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                We Build What Powers<br />Tomorrow's Technology
              </h1>
              <p className="text-base md:text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                Ferrivox delivers enterprise software, AI, data, and cybersecurity solutions — engineered in Africa, built for the world.
              </p>
              <div className="flex gap-3 flex-wrap mb-8">
                <button
                  onClick={() => onNavigate("lobby")}
                  className="px-7 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{ color: "#ffffff", background: "#3b82f6", letterSpacing: "0.05em" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#3b82f6"; }}
                >
                  Explore Our Products
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="px-7 py-3.5 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{ color: "#94a3b8", border: "1px solid rgba(100,116,139,0.3)", background: "transparent", letterSpacing: "0.05em" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(100,116,139,0.6)"; (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(100,116,139,0.3)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                >
                  Contact Us
                </button>
              </div>

              {/* Newsletter Signup on Homepage */}
              <div
                className="max-w-md rounded-xl p-5"
                style={{
                  background: "rgba(10, 14, 23, 0.8)",
                  border: "1px solid rgba(59, 130, 246, 0.15)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Newsletter />
              </div>
            </div>
          </div>
        )}

        {/* ── Lobby / Products Scene ── */}
        {isLobby && (
          <div className="absolute bottom-28 left-0 right-0 px-8 pointer-events-auto">
            <div className="max-w-5xl mx-auto">
              <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.6)" }}>
                Our Capabilities
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                What We Do
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-8 max-w-md leading-relaxed">
                End-to-end technology solutions tailored to your business needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => onNavigate(service.id)}
                    className="text-left p-6 rounded-xl transition-all duration-200"
                    style={{ border: "1px solid rgba(59,130,246,0.12)", background: "rgba(59,130,246,0.03)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.35)"; (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.07)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.12)"; (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.03)"; }}
                  >
                    <div className="text-3xl mb-4">{service.icon}</div>
                    <div className="text-sm font-semibold text-white mb-1.5">{service.label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{service.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Floor Scenes (Data, Software, Security, AI) ── */}
        {isFloor && (
          <div className="absolute bottom-28 left-0 right-0 px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto flex items-end justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,0.6)" }}>
                  {SCENE_LABELS[sceneId]}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {SCENE_DESCRIPTIONS[sceneId]}
                </h2>
                <button onClick={() => onNavigate("lobby")} className="mt-1 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back to Products
                </button>
              </div>
              <div className="hidden md:flex flex-col gap-1.5 items-end">
                {SERVICES.map((s) => (
                  <button key={s.id} onClick={() => onNavigate(s.id)} className="text-xs font-medium transition-all"
                    style={{ color: s.id === sceneId ? "#60a5fa" : "rgba(100,116,139,0.5)" }}>
                    {s.id === sceneId ? "→ " : "  "}{s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── District / Portfolio Scene ── */}
        {sceneId === "district" && (
          <div className="absolute bottom-28 left-0 right-0 px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.6)" }}>
                Our Work
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {SCENE_DESCRIPTIONS[sceneId]}
              </h2>
              <p className="text-sm text-slate-400 mb-6 max-w-md">
                Explore the products and platforms we've built for clients across industries.
              </p>
              <div className="flex gap-3">
                <button onClick={() => onNavigate("contact")} className="px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{ color: "#ffffff", background: "#3b82f6" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#3b82f6"; }}>
                  Start a Project
                </button>
                <button onClick={() => onNavigate("hq")} className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Globe / About Scene ── */}
        {sceneId === "globe" && (
          <div className="absolute bottom-28 left-0 right-0 px-8 pointer-events-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,0.6)" }}>
                About Us
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Built from Africa.<br />Engineered for the World.
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-6 max-w-lg leading-relaxed">
                Ferrivox is a technology company headquartered in Kigali, Rwanda. We partner with businesses globally to deliver software, AI, data, and cybersecurity solutions that drive real results.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                {[
                  { label: "Founded", value: "2024" },
                  { label: "Headquarters", value: "Kigali, Rwanda" },
                  { label: "Projects Delivered", value: "50+" },
                  { label: "Countries Served", value: "12+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate("hq")} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {/* ── Contact Scene ── */}
        {isContact && (
          <div className="absolute bottom-28 left-0 right-0 px-8 pointer-events-auto">
            <div className="max-w-xl mx-auto">
              <div className="rounded-xl p-6" style={{ background: "rgba(10,14,23,0.92)", border: "1px solid rgba(59,130,246,0.15)", backdropFilter: "blur(16px)" }}>
                <div className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "rgba(148,163,184,0.6)" }}>
                  Get in Touch
                </div>
                <h2 className="text-xl font-bold text-white mb-5">
                  {SCENE_DESCRIPTIONS[sceneId]}
                </h2>
                <ContactForm onSubmit={() => {}} />
              </div>
              <div className="flex justify-center mt-4">
                <button onClick={() => onNavigate("hq")} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer
        className="relative pointer-events-auto z-50"
        style={{
          background: "rgba(10, 14, 23, 0.95)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
          {/* Top row: Logo, Social, Newsletter */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-5">
            {/* Left: Logo + Copyright */}
            <div className="flex flex-col gap-2">
              <FeriivoxLogo
                style={{
                  height: "24px",
                  width: "auto",
                  opacity: 0.6,
                }}
              />
              <span className="text-xs text-slate-600">
                © {new Date().getFullYear()} Ferrivox. All rights reserved.
              </span>
            </div>

            {/* Right: Social Media Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(100, 116, 139, 0.15)",
                    color: "rgba(148, 163, 184, 0.7)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59, 130, 246, 0.25)";
                    (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(100, 116, 139, 0.15)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(148, 163, 184, 0.7)";
                  }}
                  title={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom row: Links */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.04)" }}
          >
            <div className="text-xs text-slate-600">
              Ferrivox Technology
            </div>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <button onClick={() => onNavigate("globe")} className="hover:text-slate-300 transition-colors">About</button>
              <button onClick={() => onNavigate("lobby")} className="hover:text-slate-300 transition-colors">Products</button>
              <button onClick={() => onNavigate("contact")} className="hover:text-slate-300 transition-colors">Contact</button>
              <span className="text-slate-700">|</span>
              <button onClick={() => setShowPrivacy(true)} className="hover:text-slate-300 transition-colors">Privacy</button>
              <button onClick={() => setShowTerms(true)} className="hover:text-slate-300 transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING FERRI BUTTON ─────────────────── */}
      <div className="fixed bottom-24 right-6 z-[100] pointer-events-auto">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: chatOpen ? "rgba(59, 130, 246, 0.9)" : "linear-gradient(135deg, #3b82f6, #2563eb)",
            boxShadow: "0 4px 24px rgba(59, 130, 246, 0.4), 0 0 48px rgba(59, 130, 246, 0.15)",
          }}
          title="Chat with FERRI — Ferrivox AI Assistant"
        >
          <span className="absolute inset-0 rounded-full" style={{ animation: "pulse-ring 2s ease-out infinite", border: "2px solid rgba(59, 130, 246, 0.3)" }} />
          <AIChatIcon className="w-6 h-6 text-white relative z-10" />
        </button>
      </div>

      {/* ── FERRI CHATBOT ── */}
      {chatOpen && <FeriChatbot onClose={() => setChatOpen(false)} />}

      {/* ── TERMS OF SERVICE MODAL ── */}
      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}

      {/* ── PRIVACY POLICY MODAL ── */}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </div>
  );
}
