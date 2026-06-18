const VARIANTS = {
  cyan: "border-cyan text-cyan hover:bg-cyan/10 hover:shadow-[0_0_8px_rgba(0,240,255,0.6),0_0_24px_rgba(0,240,255,0.35)]",
  magenta:
    "border-magenta text-magenta hover:bg-magenta/10 hover:shadow-[0_0_8px_rgba(255,0,229,0.6),0_0_24px_rgba(255,0,229,0.35)]",
  lime: "border-lime text-lime hover:bg-lime/10 hover:shadow-[0_0_8px_rgba(182,255,60,0.6),0_0_24px_rgba(182,255,60,0.35)]",
  danger:
    "border-magenta text-magenta hover:bg-magenta hover:text-void hover:shadow-[0_0_8px_rgba(255,0,229,0.6),0_0_24px_rgba(255,0,229,0.35)]",
};

export default function NeonButton({
  variant = "cyan",
  type = "button",
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`font-display uppercase tracking-[0.18em] text-sm px-5 py-2.5 bg-transparent border-2 rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
