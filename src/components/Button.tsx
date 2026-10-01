import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "sapphire" | "pill" | "success" | "danger" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

const variants = {
  // Primary: Filled Dark CTA (Dub signature)
  primary:
    "bg-[#3f2f7a] text-white hover:bg-[#2c2159] shadow-[rgba(63,47,122,0.18)_0px_1px_3px_0px] active:scale-[0.98]",
  // Deep Sapphire / Electric Brand CTA
  sapphire:
    "bg-[#2c2159] text-white hover:bg-[#3f2f7a] shadow-[rgba(63,47,122,0.18)_0px_1px_3px_0px] active:scale-[0.98]",
  // Secondary: Subtle alt-surface
  secondary:
    "bg-[#f6f3fb] text-[#3f2f7a] border border-[#d8d5e6] hover:bg-[#efeaf9] active:scale-[0.98]",
  // Workhorse Outlined Button: 1px #d8d5e6 border on white
  outline:
    "bg-white border border-[#c9c2e3] text-[#3f2f7a] hover:bg-[#f6f3fb] hover:border-[#5b4aa0] active:scale-[0.98]",
  // Ghost Nav / Toolbar Action
  ghost:
    "bg-transparent text-[#3f2f7a] hover:bg-[#f6f3fb] active:scale-[0.98]",
  // Pill button (9999px radius)
  pill:
    "bg-[#3f2f7a] text-white hover:bg-[#2c2159] rounded-full shadow-[rgba(63,47,122,0.18)_0px_1px_3px_0px] active:scale-[0.98]",
  // Success / Mint
  success:
    "bg-[#16a34a] text-white hover:bg-[#15803d] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] active:scale-[0.98]",
  // Danger / Red
  danger:
    "bg-[#e2231a] text-white hover:bg-[#b91c1c] shadow-[rgba(226,35,26,0.16)_0px_1px_3px_0px] active:scale-[0.98]",
  // Accent / Blue
  accent:
    "bg-[#3f2f7a] text-white hover:bg-[#2c2159] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] active:scale-[0.98]",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg font-medium",
  md: "h-9 px-4 text-sm gap-2 rounded-lg font-medium",
  lg: "h-11 px-5 text-sm gap-2.5 rounded-lg font-medium",
  xl: "h-12 px-6 text-base gap-3 rounded-lg font-medium",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth,
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
