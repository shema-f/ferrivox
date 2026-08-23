export default function FeriivoxLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="160 440 680 150"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="ferriGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b0b0b0" />
          <stop offset="30%" stopColor="#d0d0d0" />
          <stop offset="60%" stopColor="#808080" />
          <stop offset="100%" stopColor="#505050" />
        </linearGradient>
        <linearGradient id="ferriGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0a0a0" />
          <stop offset="50%" stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>
      </defs>

      {/* F */}
      <path d="M 169,450 L 169,536 L 200,536 L 200,500 L 235,500 L 235,476 L 200,476 L 200,474 L 235,474 L 235,450 Z" fill="url(#ferriGrad)" />

      {/* E */}
      <path d="M 249,450 L 249,536 L 317,536 L 317,512 L 280,512 L 280,500 L 317,500 L 317,476 L 280,476 L 280,474 L 317,474 L 317,450 Z" fill="url(#ferriGrad)" />

      {/* R (first) */}
      <path d="M 334,450 L 334,536 L 365,536 L 365,500 L 380,500 L 395,536 L 409,536 L 393,497 Q 409,490 409,473 Q 409,450 380,450 Z M 365,474 L 378,474 Q 384,474 384,481 Q 384,488 378,488 L 365,488 Z" fill="url(#ferriGrad)" />

      {/* R (second) */}
      <path d="M 425,450 L 425,536 L 456,536 L 456,500 L 471,500 L 486,536 L 500,536 L 484,497 Q 500,490 500,473 Q 500,450 471,450 Z M 456,474 L 469,474 Q 475,474 475,481 Q 475,488 469,488 L 456,488 Z" fill="url(#ferriGrad)" />

      {/* I (Lightning Bolt) */}
      <path d="M 515,450 L 515,536 L 545,536 L 545,450 Z" fill="url(#ferriGrad)" />
      <path d="M 525,450 L 540,450 L 530,490 L 545,490 L 520,536 L 530,500 L 515,500 Z" fill="url(#ferriGrad2)" />

      {/* V */}
      <path d="M 551,450 L 585,536 L 614,536 L 644,450 L 612,450 L 599,500 L 586,450 Z" fill="url(#ferriGrad)" />

      {/* O with wave */}
      <path d="M 670,450 Q 637,450 637,493 Q 637,536 670,536 Q 703,536 703,493 Q 703,450 670,450 Z M 670,474 Q 679,474 679,493 Q 679,512 670,512 Q 661,512 661,493 Q 661,474 670,474 Z" fill="url(#ferriGrad)" />
      <path d="M 640,493 Q 655,477 670,493 Q 685,509 700,493" fill="none" stroke="url(#ferriGrad2)" strokeWidth="3" strokeLinecap="round" />

      {/* X */}
      <path d="M 720,450 L 752,450 L 770,480 L 788,450 L 820,450 L 790,493 L 829,536 L 797,536 L 770,506 L 743,536 L 711,536 L 750,493 Z" fill="url(#ferriGrad)" />
    </svg>
  );
}
