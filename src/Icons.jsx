// add this export
export function StopwatchIcon({ size = 20, stroke = 2, className = "", ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {/* top button */}
      <path d="M9 2h6" />
      <path d="M12 2v2" />
      {/* body */}
      <circle cx="12" cy="14" r="8" />
      {/* hand */}
      <path d="M12 14l3-3" />
    </svg>
  );
}
