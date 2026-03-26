interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** Custom CyberShield India logo mark — hexagonal security badge with tricolor accent */
export function LogoMark({ size = 32, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon background */}
      <path
        d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
        fill="#1d4ed8"
      />
      {/* Inner hex ring */}
      <path
        d="M20 6L33 13.5V26.5L20 34L7 26.5V13.5L20 6Z"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="0.8"
        strokeOpacity="0.6"
      />
      {/* CS letterform — C arc */}
      <path
        d="M22.5 14.5C21.5 13.8 20.3 13.5 19 13.5C15.96 13.5 13.5 16 13.5 19C13.5 22 15.96 24.5 19 24.5C20.3 24.5 21.5 24.2 22.5 23.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* CS letterform — S curve */}
      <path
        d="M24.5 14.8C23.2 13.9 21.5 13.5 20 14.2C18.2 15.1 18.4 17.2 20.2 18C21.8 18.7 23.8 18.8 24.5 20C25.2 21.2 24.5 23 22.5 23.5C21 24 19.5 23.7 18.5 23"
        stroke="#93c5fd"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* India tricolor bottom stripe */}
      <rect x="4" y="33" width="10.5" height="2.5" rx="1" fill="#FF9933" opacity="0.9" />
      <rect x="14.75" y="33" width="10.5" height="2.5" rx="1" fill="#ffffff" opacity="0.9" />
      <rect x="25.5" y="33" width="10.5" height="2.5" rx="1" fill="#138808" opacity="0.9" />
    </svg>
  );
}

interface LogoProps {
  variant?: "dark" | "light";
  showTagline?: boolean;
}

export function Logo({ variant = "dark", showTagline = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={34} />
      <div className="leading-tight">
        <div className={`font-bold text-sm tracking-tight ${variant === "dark" ? "text-white" : "text-slate-900"}`}>
          CyberShield
          <span className="text-blue-400 ml-1">India</span>
        </div>
        {showTagline && (
          <div className={`text-[10px] font-medium tracking-wider uppercase ${variant === "dark" ? "text-slate-500" : "text-slate-400"}`}>
            Cyber Suraksha
          </div>
        )}
      </div>
    </div>
  );
}
