import React from "react";

export function CarIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Radar concentric wave gradients */}
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ea2f3c" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#ea2f3c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ea2f3c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="60%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="wheelRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="lightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Radar waves behind the car */}
      <circle cx="340" cy="180" r="160" fill="url(#radarGlow)" />
      <circle cx="340" cy="180" r="140" stroke="#ea2f3c" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="340" cy="180" r="100" stroke="#ea2f3c" strokeOpacity="0.28" strokeWidth="1.5" />
      <circle cx="340" cy="180" r="60" stroke="#ea2f3c" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* Road / Ground Line */}
      <line x1="20" y1="262" x2="620" y2="262" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="266" x2="560" y2="266" stroke="#ea2f3c" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="16 12" />

      {/* Headlight beam */}
      <polygon points="56,220 10,240 10,210" fill="url(#lightBeam)" />

      {/* CAR SHADOW */}
      <ellipse cx="320" cy="262" rx="245" ry="10" fill="#090d14" fillOpacity="0.7" />

      {/* MAIN CAR BODY */}
      {/* Lower Chassis Base */}
      <path
        d="M65,224 L85,188 L170,178 L230,118 L460,118 L530,178 L580,188 L588,224 L565,236 L525,236 C520,205 470,205 465,236 L215,236 C210,205 160,205 155,236 L85,236 Z"
        fill="url(#bodyGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Cabin Roof & Windows Pillar Frame */}
      <path
        d="M232,122 L456,122 L518,176 L180,176 Z"
        fill="#0f172a"
      />

      {/* Front Window */}
      <polygon points="190,174 235,126 310,126 310,174" fill="url(#windowGrad)" />
      {/* Middle / Rear Window */}
      <polygon points="320,174 320,126 446,126 504,174" fill="url(#windowGrad)" />

      {/* Subtle window glare */}
      <line x1="210" y1="168" x2="245" y2="132" stroke="#94a3b8" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
      <line x1="335" y1="168" x2="370" y2="132" stroke="#94a3b8" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />

      {/* Door Cut lines */}
      <line x1="315" y1="126" x2="315" y2="234" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="440" y1="126" x2="440" y2="234" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Door handles */}
      <rect x="280" y="184" width="22" height="4" rx="2" fill="#64748b" />
      <rect x="405" y="184" width="22" height="4" rx="2" fill="#64748b" />

      {/* Body character line */}
      <line x1="95" y1="192" x2="570" y2="192" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.8" />
      <line x1="92" y1="194" x2="572" y2="194" stroke="#94a3b8" strokeWidth="1.2" />

      {/* Front Headlight (left in side profile) */}
      <path d="M68,206 L86,192 L86,218 L68,220 Z" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
      <line x1="72" y1="212" x2="84" y2="204" stroke="#ffffff" strokeWidth="1.5" />

      {/* Rear Taillight (right in side profile) */}
      <path d="M578,194 L586,198 L586,218 L572,216 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      <circle cx="580" cy="206" r="3" fill="#ffffff" fillOpacity="0.6" />

      {/* Front Bumper / Trim */}
      <path d="M64,224 L86,224 L84,236 L70,236 Z" fill="#475569" />
      {/* Rear Bumper */}
      <path d="M565,224 L588,224 L582,236 L560,236 Z" fill="#475569" />

      {/* FRONT WHEEL (Left side in diagram) */}
      <g>
        {/* Outer Tire */}
        <circle cx="185" cy="236" r="36" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        {/* Inner Tire tread ring */}
        <circle cx="185" cy="236" r="31" stroke="#334155" strokeWidth="1.5" />
        {/* Rim */}
        <circle cx="185" cy="236" r="23" fill="url(#wheelRim)" />
        {/* Hub */}
        <circle cx="185" cy="236" r="10" fill="#0f172a" />
        <circle cx="185" cy="236" r="4" fill="#ea2f3c" />
        {/* Spokes */}
        <line x1="185" y1="214" x2="185" y2="258" stroke="#f8fafc" strokeWidth="2.5" />
        <line x1="163" y1="236" x2="207" y2="236" stroke="#f8fafc" strokeWidth="2.5" />
        <line x1="169" y1="220" x2="201" y2="252" stroke="#f8fafc" strokeWidth="2.5" />
        <line x1="169" y1="252" x2="201" y2="220" stroke="#f8fafc" strokeWidth="2.5" />
      </g>

      {/* REAR WHEEL (Right side in diagram) */}
      <g>
        {/* Outer Tire */}
        <circle cx="495" cy="236" r="36" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        {/* Inner Tire tread ring */}
        <circle cx="495" cy="236" r="31" stroke="#334155" strokeWidth="1.5" />
        {/* Rim */}
        <circle cx="495" cy="236" r="23" fill="url(#wheelRim)" />
        {/* Hub */}
        <circle cx="495" cy="236" r="10" fill="#0f172a" />
        <circle cx="495" cy="236" r="4" fill="#ea2f3c" />
        {/* Spokes */}
        <line x1="495" y1="214" x2="495" y2="258" stroke="#f8fafc" strokeWidth="2.5" />
        <line x1="473" y1="236" x2="517" y2="236" stroke="#f8fafc" strokeWidth="2.5" />
        <line x1="479" y1="220" x2="511" y2="252" stroke="#f8fafc" strokeWidth="2.5" />
        <line x1="479" y1="252" x2="511" y2="220" stroke="#f8fafc" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
