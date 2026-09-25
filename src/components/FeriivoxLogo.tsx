import React from "react"

interface FeriivoxLogoProps {
  className?: string
  style?: React.CSSProperties
  withTagline?: boolean
  compact?: boolean
  onClick?: () => void
}

/**
 * Ferrivox Official Brand Logo
 * Recreates the brushed titanium industrial wordmark with the signature
 * lightning-bolt "I", electric pulse wave weaving through "O" and "X",
 * and the "IRON WILL, INFINITE DREAMS" motto.
 */
export default function FeriivoxLogo({
  className = "h-11 w-auto",
  style,
  withTagline = true,
  compact = false,
  onClick,
}: FeriivoxLogoProps) {
  // If compact / without tagline, trim the viewBox height
  const viewBox = withTagline && !compact ? "0 0 840 160" : "0 10 840 105"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      style={{ display: "inline-block", ...style }}
      onClick={onClick}
      role="img"
      aria-label="Ferrivox — Iron Will, Infinite Dreams"
    >
      <defs>
        {/* Brushed Titanium Primary Gradient */}
        <linearGradient id="ferriTitanium" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="15%" stopColor="#f8fafc" />
          <stop offset="38%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="80%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Specular Highlight for Top Bevels */}
        <linearGradient id="ferriHighlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>

        {/* Electric Energy Wave & Lightning Gradient */}
        <linearGradient id="ferriPulse" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="30%" stopColor="#60a5fa" />
          <stop offset="60%" stopColor="#93c5fd" />
          <stop offset="85%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        {/* Subtitle Metallic Gradient */}
        <linearGradient id="ferriMotto" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id="pulseGlow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop shadow for sharp definition */}
        <filter id="metalShadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ── Main Logotype: FERRIVOX ── */}
      <g filter="url(#metalShadow)">
        {/* F */}
        <path
          d="M 35 24
             L 105 24
             L 105 45
             L 60 45
             L 60 59
             L 98 59
             L 98 80
             L 60 80
             L 60 98
             L 35 98
             Z"
          fill="url(#ferriTitanium)"
        />

        {/* E */}
        <path
          d="M 120 24
             L 190 24
             L 190 45
             L 145 45
             L 145 59
             L 184 59
             L 184 79
             L 145 79
             L 145 77
             L 190 77
             L 190 98
             L 120 98
             Z"
          fill="url(#ferriTitanium)"
        />

        {/* First R */}
        <path
          d="M 205 24
             L 264 24
             Q 288 24 288 48
             Q 288 64 270 70
             L 289 98
             L 261 98
             L 245 74
             L 230 74
             L 230 98
             L 205 98
             Z
             M 230 43
             L 255 43
             Q 265 43 265 49
             Q 265 56 255 56
             L 230 56
             Z"
          fill="url(#ferriTitanium)"
        />

        {/* Second R */}
        <path
          d="M 302 24
             L 361 24
             Q 385 24 385 48
             Q 385 64 367 70
             L 386 98
             L 358 98
             L 342 74
             L 327 74
             L 327 98
             L 302 98
             Z
             M 327 43
             L 352 43
             Q 362 43 362 49
             Q 362 56 352 56
             L 327 56
             Z"
          fill="url(#ferriTitanium)"
        />

        {/* I (Signature Lightning Bolt Cut) */}
        <g id="ferri-lightning-i">
          {/* Base titanium structure with vertical lightning silhouette */}
          <path
            d="M 414 24
               L 444 24
               L 435 55
               L 452 55
               L 416 98
               L 426 66
               L 408 66
               Z"
            fill="url(#ferriTitanium)"
          />
          {/* Internal electric fissure core */}
          <path
            d="M 423 27
               L 438 27
               L 431 52
               L 445 52
               L 419 92
               L 427 63
               L 414 63
               Z"
            fill="url(#ferriPulse)"
            filter="url(#pulseGlow)"
            opacity="0.85"
          />
        </g>

        {/* V */}
        <path
          d="M 456 24
             L 483 24
             L 508 81
             L 533 24
             L 560 24
             L 522 98
             L 494 98
             Z"
          fill="url(#ferriTitanium)"
        />

        {/* O (with inner opening) */}
        <path
          d="M 622 24
             Q 666 24 666 61
             Q 666 98 622 98
             Q 578 98 578 61
             Q 578 24 622 24
             Z
             M 622 44
             Q 641 44 641 61
             Q 641 78 622 78
             Q 603 78 603 61
             Q 603 44 622 44
             Z"
          fill="url(#ferriTitanium)"
        />

        {/* X */}
        <path
          d="M 680 24
             L 708 24
             L 733 58
             L 758 24
             L 786 24
             L 747 61
             L 788 98
             L 760 98
             L 733 66
             L 706 98
             L 678 98
             L 719 61
             Z"
          fill="url(#ferriTitanium)"
        />
      </g>

      {/* ── Signature Waveform / Heartbeat pulse weaving through O & X ── */}
      <g filter="url(#pulseGlow)">
        {/* Main kinetic wave flowing through O into X */}
        <path
          d="M 572 61
             Q 590 61 600 65
             L 612 40
             L 624 78
             L 634 50
             Q 642 61 668 61
             Q 695 61 718 61
             Q 735 61 748 48
             Q 762 36 786 38"
          fill="none"
          stroke="url(#ferriPulse)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Secondary wave swoosh across lower diagonal of X */}
        <path
          d="M 700 61
             Q 720 61 738 72
             Q 752 82 780 84"
          fill="none"
          stroke="url(#ferriPulse)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </g>

      {/* ── Tagline: IRON WILL, INFINITE DREAMS ── */}
      {withTagline && !compact && (
        <g id="ferri-tagline">
          <text
            x="414"
            y="138"
            textAnchor="middle"
            fill="url(#ferriMotto)"
            fontFamily="'Inter', 'Montserrat', -apple-system, sans-serif"
            fontSize="18.5"
            fontWeight="600"
            letterSpacing="8"
            style={{
              textTransform: "uppercase",
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            IRON WILL, INFINITE DREAMS
          </text>
        </g>
      )}
    </svg>
  )
}
