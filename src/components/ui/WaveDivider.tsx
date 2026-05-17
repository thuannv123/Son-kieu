/**
 * Organic blob/wave SVG dividers — signature Keemala design element.
 * Used to create seamless transitions between white and dark sections.
 */

interface WaveProps {
  fill?: string;
  className?: string;
  /** flip vertically (wave points downward vs upward) */
  flip?: boolean;
}

/** Wave at BOTTOM of a white section → dark section follows below */
export function WaveDown({ fill = "#052e16", className = "" }: WaveProps) {
  return (
    <div className={`pointer-events-none overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "90px", display: "block" }}
        aria-hidden="true"
      >
        <path
          d="M0,90 L0,45 C120,20 240,0 400,18 C520,30 600,62 720,55
             C840,48 960,18 1100,22 C1240,26 1360,50 1440,42 L1440,90 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/** Wave at TOP of a white section → dark section was above */
export function WaveUp({ fill = "#052e16", className = "" }: WaveProps) {
  return (
    <div className={`pointer-events-none overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "90px", display: "block" }}
        aria-hidden="true"
      >
        <path
          d="M0,0 L0,48 C140,68 300,90 480,76 C660,62 780,28 960,35
             C1120,41 1280,70 1440,55 L1440,0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/**
 * DarkSection — wraps content in the Keemala-style dark forest section
 * with organic wave borders top and bottom.
 *
 * Usage:
 *   <DarkSection>
 *     <p>My dark content...</p>
 *   </DarkSection>
 */
export function DarkSection({
  children,
  className = "",
  py = "py-20 md:py-28",
}: {
  children: React.ReactNode;
  className?: string;
  py?: string;
}) {
  return (
    <div>
      {/* Top wave: white → dark */}
      <WaveDown fill="#052e16" />

      {/* Dark body */}
      <div className={`bg-[#052e16] ${py} ${className}`}>
        {children}
      </div>

      {/* Bottom wave: dark → white */}
      <WaveUp fill="#052e16" />
    </div>
  );
}
