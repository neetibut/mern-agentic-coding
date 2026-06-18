export default function NeonCard({ className = "", children }) {
  return (
    <div
      className={`relative bg-panel/80 backdrop-blur border border-edge rounded-md p-6 shadow-[0_0_0_1px_rgba(0,240,255,0.08),0_8px_40px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* corner accents */}
      <span className="pointer-events-none absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-cyan" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-magenta" />
      {children}
    </div>
  );
}
