export default function IshamiLogo({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={className}
      width={size}
      height={size}
    >
      <defs>
        <clipPath id="ishamiClip">
          <circle cx="60" cy="60" r="58" />
        </clipPath>
        <linearGradient id="roadGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#2d3748" />
          <stop offset="100%" stopColor="#1a202c" />
        </linearGradient>
        <linearGradient id="wheelGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="100%" stopColor="#2d3748" />
        </linearGradient>
      </defs>

      {/* Background circle with colorful ring */}
      <circle cx="60" cy="60" r="58" fill="#0a0e17" />
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        strokeWidth="6"
        stroke="url(#ishamiRing)"
      />
      <defs>
        <linearGradient id="ishamiRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="25%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="75%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Steering wheel */}
      <g clipPath="url(#ishamiClip)">
        {/* Outer ring */}
        <circle
          cx="60"
          cy="48"
          r="22"
          fill="none"
          stroke="#4a5568"
          strokeWidth="4"
        />
        {/* Inner hub */}
        <circle cx="60" cy="48" r="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
        {/* Spokes */}
        <line x1="60" y1="26" x2="60" y2="40" stroke="#4a5568" strokeWidth="3" />
        <line x1="38" y1="48" x2="52" y2="48" stroke="#4a5568" strokeWidth="3" />
        <line x1="68" y1="48" x2="82" y2="48" stroke="#4a5568" strokeWidth="3" />

        {/* Road perspective */}
        <polygon points="35,80 85,80 65,110 55,110" fill="#374151" />
        {/* Center line */}
        <line x1="60" y1="80" x2="60" y2="110" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
        {/* Road edges */}
        <line x1="35" y1="80" x2="55" y2="110" stroke="#6b7280" strokeWidth="1" />
        <line x1="85" y1="80" x2="65" y2="110" stroke="#6b7280" strokeWidth="1" />
      </g>

      {/* Stop sign */}
      <g transform="translate(60, 18)">
        {/* Octagon */}
        <polygon
          points="-8,-8 -4,-12 4,-12 8,-8 8,-2 4,2 -4,2 -8,-2"
          fill="#dc2626"
          stroke="#991b1b"
          strokeWidth="0.8"
        />
        {/* Stop text */}
        <text
          x="0"
          y="-2"
          textAnchor="middle"
          fill="white"
          fontSize="5"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          STOP
        </text>
      </g>
    </svg>
  );
}
