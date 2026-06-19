export default function NeonInput({ label, id, className = "", ...rest }) {
  return (
    <label htmlFor={id} className="block">
      {label && (
        <span className="block mb-1 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {label}
        </span>
      )}
      <input
        id={id}
        className={`w-full bg-panel-2 border border-edge rounded-sm px-3 py-2 text-cyan font-mono placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-cyan focus:shadow-[0_0_0_1px_var(--color-cyan),0_0_12px_rgba(0,240,255,0.3)] ${className}`}
        {...rest}
      />
    </label>
  );
}
