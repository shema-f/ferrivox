/** Cartoon-style SVG icons for Ferrivox sections */

export function DataIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Database body */}
      <ellipse cx="60" cy="30" rx="38" ry="14" fill="#3b82f6" />
      <rect x="22" y="30" width="76" height="50" fill="#2563eb" />
      <ellipse cx="60" cy="80" rx="38" ry="14" fill="#1d4ed8" />
      {/* Database lines */}
      <ellipse cx="60" cy="45" rx="34" ry="10" fill="none" stroke="#60a5fa" strokeWidth="2" />
      <ellipse cx="60" cy="60" rx="34" ry="10" fill="none" stroke="#60a5fa" strokeWidth="2" />
      {/* Cute face */}
      <circle cx="48" cy="52" r="4" fill="white" />
      <circle cx="72" cy="52" r="4" fill="white" />
      <circle cx="49" cy="53" r="2" fill="#1e293b" />
      <circle cx="73" cy="53" r="2" fill="#1e293b" />
      {/* Smile */}
      <path d="M50 62 Q60 70 70 62" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Sparkles */}
      <path d="M95 25 l3-6 3 6 -6 0z" fill="#fbbf24" />
      <path d="M15 50 l2-4 2 4 -4 0z" fill="#fbbf24" />
      {/* Data arrows */}
      <circle cx="60" cy="100" r="3" fill="#60a5fa" />
      <circle cx="60" cy="108" r="2" fill="#60a5fa" opacity="0.6" />
    </svg>
  )
}

export function AIIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Robot head */}
      <rect x="28" y="30" width="64" height="55" rx="16" fill="#8b5cf6" />
      {/* Antenna */}
      <line x1="60" y1="30" x2="60" y2="16" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="13" r="5" fill="#fbbf24" />
      {/* Ears */}
      <rect x="18" y="42" width="10" height="20" rx="5" fill="#7c3aed" />
      <rect x="92" y="42" width="10" height="20" rx="5" fill="#7c3aed" />
      {/* Eyes */}
      <circle cx="45" cy="55" r="8" fill="white" />
      <circle cx="75" cy="55" r="8" fill="white" />
      <circle cx="47" cy="56" r="4" fill="#1e293b" />
      <circle cx="77" cy="56" r="4" fill="#1e293b" />
      {/* Eye shine */}
      <circle cx="44" cy="53" r="1.5" fill="white" />
      <circle cx="74" cy="53" r="1.5" fill="white" />
      {/* Mouth */}
      <rect x="44" y="70" width="32" height="6" rx="3" fill="#1e293b" />
      <rect x="48" y="71" width="4" height="4" rx="1" fill="#60a5fa" />
      <rect x="56" y="71" width="4" height="4" rx="1" fill="#60a5fa" />
      <rect x="64" y="71" width="4" height="4" rx="1" fill="#60a5fa" />
      {/* Body hint */}
      <rect x="40" y="85" width="40" height="15" rx="8" fill="#7c3aed" />
      <circle cx="60" cy="92" r="4" fill="#fbbf24" />
      {/* Sparkles */}
      <path d="M100 35 l2-5 2 5 -4 0z" fill="#fbbf24" />
      <path d="M18 70 l2-5 2 5 -4 0z" fill="#fbbf24" />
    </svg>
  )
}

export function SoftwareIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Laptop body */}
      <rect x="15" y="30" width="90" height="55" rx="6" fill="#06b6d4" />
      <rect x="19" y="34" width="82" height="47" rx="4" fill="#0e7490" />
      {/* Screen */}
      <rect x="22" y="37" width="76" height="41" rx="3" fill="#0c4a6e" />
      {/* Code lines */}
      <rect x="28" y="44" width="30" height="3" rx="1.5" fill="#22d3ee" />
      <rect x="28" y="51" width="45" height="3" rx="1.5" fill="#67e8f9" />
      <rect x="28" y="58" width="20" height="3" rx="1.5" fill="#22d3ee" />
      <rect x="52" y="58" width="25" height="3" rx="1.5" fill="#a5f3fc" />
      <rect x="28" y="65" width="35" height="3" rx="1.5" fill="#67e8f9" />
      {/* Cute face on screen */}
      <circle cx="80" cy="48" r="3" fill="white" />
      <circle cx="90" cy="48" r="3" fill="white" />
      <circle cx="81" cy="49" r="1.5" fill="#1e293b" />
      <circle cx="91" cy="49" r="1.5" fill="#1e293b" />
      <path d="M79 55 Q85 59 91 55" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Laptop base */}
      <path d="M10 85 L15 85 L15 85 L105 85 L110 85 L108 92 L12 92 Z" fill="#0891b2" />
      {/* Keyboard dots */}
      <circle cx="35" cy="88" r="1" fill="#0e7490" />
      <circle cx="45" cy="88" r="1" fill="#0e7490" />
      <circle cx="55" cy="88" r="1" fill="#0e7490" />
      <circle cx="65" cy="88" r="1" fill="#0e7490" />
      <circle cx="75" cy="88" r="1" fill="#0e7490" />
      <circle cx="85" cy="88" r="1" fill="#0e7490" />
      {/* Sparkle */}
      <path d="M105 25 l3-6 3 6 -6 0z" fill="#fbbf24" />
      {/* Gear */}
      <circle cx="18" cy="22" r="6" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="18" cy="22" r="2" fill="#fbbf24" />
    </svg>
  )
}

export function SecurityIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield */}
      <path d="M60 15 L95 30 L95 60 Q95 90 60 105 Q25 90 25 60 L25 30 Z" fill="#ef4444" />
      <path d="M60 22 L90 35 L90 60 Q90 85 60 98 Q30 85 30 60 L30 35 Z" fill="#dc2626" />
      {/* Shield highlight */}
      <path d="M60 22 L45 30 L45 55 Q45 75 60 85" fill="none" stroke="#fca5a5" strokeWidth="2" opacity="0.5" />
      {/* Lock */}
      <rect x="45" y="50" width="30" height="22" rx="4" fill="#1e293b" />
      <path d="M50 50 L50 42 Q50 32 60 32 Q70 32 70 42 L70 50" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      {/* Keyhole */}
      <circle cx="60" cy="60" r="4" fill="#fbbf24" />
      <rect x="58.5" y="60" width="3" height="6" rx="1" fill="#fbbf24" />
      {/* Cute face on shield */}
      <circle cx="45" cy="42" r="3" fill="white" />
      <circle cx="75" cy="42" r="3" fill="white" />
      <circle cx="46" cy="43" r="1.5" fill="#1e293b" />
      <circle cx="76" cy="43" r="1.5" fill="#1e293b" />
      {/* Sparkles */}
      <path d="M100 20 l2-5 2 5 -4 0z" fill="#fbbf24" />
      <path d="M15 55 l2-5 2 5 -4 0z" fill="#fbbf24" />
    </svg>
  )
}

export function ProductIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box body */}
      <rect x="20" y="45" width="80" height="55" rx="6" fill="#f59e0b" />
      {/* Box lid */}
      <rect x="16" y="35" width="88" height="14" rx="4" fill="#fbbf24" />
      {/* Ribbon vertical */}
      <rect x="55" y="35" width="10" height="65" fill="#ef4444" />
      {/* Ribbon horizontal */}
      <rect x="16" y="55" width="88" height="8" fill="#ef4444" />
      {/* Bow */}
      <ellipse cx="50" cy="33" rx="10" ry="7" fill="#ef4444" />
      <ellipse cx="70" cy="33" rx="10" ry="7" fill="#ef4444" />
      <circle cx="60" cy="35" r="5" fill="#dc2626" />
      {/* Cute face */}
      <circle cx="40" cy="75" r="4" fill="white" />
      <circle cx="78" cy="75" r="4" fill="white" />
      <circle cx="41" cy="76" r="2" fill="#1e293b" />
      <circle cx="79" cy="76" r="2" fill="#1e293b" />
      <path d="M50 85 Q60 92 70 85" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Sparkles */}
      <path d="M100 25 l3-6 3 6 -6 0z" fill="#8b5cf6" />
      <path d="M10 70 l2-4 2 4 -4 0z" fill="#3b82f6" />
      {/* Stars around */}
      <circle cx="105" cy="50" r="2" fill="#fbbf24" />
      <circle cx="8" cy="45" r="2" fill="#fbbf24" />
    </svg>
  )
}

export function ContactIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chat bubble */}
      <rect x="15" y="25" width="90" height="60" rx="16" fill="#10b981" />
      <polygon points="35,85 50,85 30,100" fill="#10b981" />
      {/* Inner bubble */}
      <rect x="22" y="32" width="76" height="46" rx="12" fill="#059669" />
      {/* Message lines */}
      <rect x="32" y="42" width="40" height="4" rx="2" fill="#a7f3d0" />
      <rect x="32" y="52" width="55" height="4" rx="2" fill="#6ee7b7" />
      <rect x="32" y="62" width="30" height="4" rx="2" fill="#a7f3d0" />
      {/* Cute face */}
      <circle cx="82" cy="45" r="3" fill="white" />
      <circle cx="92" cy="45" r="3" fill="white" />
      <circle cx="83" cy="46" r="1.5" fill="#1e293b" />
      <circle cx="93" cy="46" r="1.5" fill="#1e293b" />
      <path d="M81 53 Q87 57 93 53" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Paper plane */}
      <path d="M95 18 L105 25 L95 30 L90 25 Z" fill="#fbbf24" />
      <path d="M95 18 L95 30" stroke="#f59e0b" strokeWidth="1" />
      {/* Hearts */}
      <path d="M15 20 C15 17 18 15 20 18 C22 15 25 17 25 20 C25 24 20 27 20 27 C20 27 15 24 15 20Z" fill="#f472b6" opacity="0.7" />
      <path d="M100 60 C100 58 102 57 103 59 C104 57 106 58 106 60 C106 62 103 64 103 64 C103 64 100 62 100 60Z" fill="#f472b6" opacity="0.5" />
    </svg>
  )
}

export function GlobeIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Globe */}
      <circle cx="60" cy="55" r="40" fill="#3b82f6" />
      <circle cx="60" cy="55" r="40" fill="url(#globeGrad)" />
      <defs>
        <radialGradient id="globeGrad" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
      </defs>
      {/* Land masses (simplified) */}
      <ellipse cx="50" cy="42" rx="12" ry="8" fill="#10b981" opacity="0.8" />
      <ellipse cx="70" cy="50" rx="8" ry="12" fill="#10b981" opacity="0.7" />
      <ellipse cx="45" cy="65" rx="10" ry="6" fill="#10b981" opacity="0.6" />
      {/* Grid lines */}
      <ellipse cx="60" cy="55" rx="40" ry="15" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="60" cy="55" rx="25" ry="40" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      {/* Cute face */}
      <circle cx="48" cy="50" r="4" fill="white" />
      <circle cx="70" cy="50" r="4" fill="white" />
      <circle cx="49" cy="51" r="2" fill="#1e293b" />
      <circle cx="71" cy="51" r="2" fill="#1e293b" />
      <path d="M52 60 Q60 66 68 60" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Orbit ring */}
      <ellipse cx="60" cy="55" rx="52" ry="18" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" strokeDasharray="4,4" />
      {/* Satellite */}
      <circle cx="108" cy="48" r="4" fill="#fbbf24" />
      <rect x="100" y="46" width="4" height="4" rx="1" fill="#f59e0b" />
      <rect x="112" y="46" width="4" height="4" rx="1" fill="#f59e0b" />
      {/* Sparkle */}
      <path d="M15 30 l2-5 2 5 -4 0z" fill="#fbbf24" />
    </svg>
  )
}

export function HeroDataIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simple database stack */}
      <ellipse cx="40" cy="20" rx="24" ry="8" fill="#3b82f6" />
      <rect x="16" y="20" width="48" height="30" fill="#2563eb" />
      <ellipse cx="40" cy="50" rx="24" ry="8" fill="#1d4ed8" />
      <ellipse cx="40" cy="30" rx="20" ry="6" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
      <ellipse cx="40" cy="40" rx="20" ry="6" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
      {/* Arrow up */}
      <path d="M40 58 L40 70 M35 65 L40 58 L45 65" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HeroAIIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Brain/AI symbol */}
      <circle cx="40" cy="35" r="20" fill="#8b5cf6" />
      <circle cx="40" cy="35" r="15" fill="#7c3aed" />
      {/* Neural connections */}
      <circle cx="32" cy="30" r="3" fill="#c4b5fd" />
      <circle cx="48" cy="30" r="3" fill="#c4b5fd" />
      <circle cx="40" cy="40" r="3" fill="#c4b5fd" />
      <line x1="32" y1="30" x2="48" y2="30" stroke="#c4b5fd" strokeWidth="1" />
      <line x1="32" y1="30" x2="40" y2="40" stroke="#c4b5fd" strokeWidth="1" />
      <line x1="48" y1="30" x2="40" y2="40" stroke="#c4b5fd" strokeWidth="1" />
      {/* Sparkle */}
      <path d="M62 15 l2-5 2 5 -4 0z" fill="#fbbf24" />
      {/* Base */}
      <rect x="30" y="55" width="20" height="8" rx="4" fill="#7c3aed" />
      <rect x="25" y="63" width="30" height="4" rx="2" fill="#6d28d9" />
    </svg>
  )
}

export function HeroSoftwareIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Code brackets */}
      <path d="M20 20 L10 40 L20 60" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M60 20 L70 40 L60 60" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Slash */}
      <line x1="45" y1="18" x2="35" y2="62" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
      {/* Dots */}
      <circle cx="38" cy="35" r="2" fill="#67e8f9" />
      <circle cx="42" cy="45" r="2" fill="#67e8f9" />
    </svg>
  )
}

export function HeroSecurityIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield */}
      <path d="M40 8 L68 22 L68 42 Q68 62 40 72 Q12 62 12 42 L12 22 Z" fill="#ef4444" />
      <path d="M40 14 L62 25 L62 42 Q62 58 40 66 Q18 58 18 42 L18 25 Z" fill="#dc2626" />
      {/* Checkmark */}
      <path d="M28 40 L36 48 L54 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
