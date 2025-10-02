// Named export
export const StopwatchIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="13" r="8" />
    <path d="M9 2h6M19 4l-1.5 1.5" />
  </svg>
);
// Home
export const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 10v10h14V10" />
  </svg>
);

// Session (clock-like)
export const SessionIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </svg>
);

// Plan (checklist)
export const PlanIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

// Exercises (dumbbell style)
export const ExercisesIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 6l12 12M6 18L18 6" />
    <path d="M4 10h4v4H4zM16 10h4v4h-4z" />
  </svg>
);

// History (refresh/clock)
export const HistoryIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 3v6h6" />
    <path d="M12 7v5l3 2" />
  </svg>
);

// Settings (gear)
export const SettingsIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    <path d="M19.4 15a1 1 0 0 1 .2 1.1l-1 1.7a1 1 0 0 1-1.1.4l-1.9-.6a7 7 0 0 1-1.6.9l-.3 2a1 1 0 0 1-1 .9h-2a1 1 0 0 1-1-.9l-.3-2a7 7 0 0 1-1.6-.9l-1.9.6a1 1 0 0 1-1.1-.4l-1-1.7a1 1 0 0 1 .2-1.1l1.6-1.3a7 7 0 0 1 0-1.8L4.6 10A1 1 0 0 1 4.4 8.9l1-1.7a1 1 0 0 1 1.1-.4l1.9.6a7 7 0 0 1 1.6-.9l.3-2a1 1 0 0 1 1-.9h2a1 1 0 0 1 1 .9l.3 2a7 7 0 0 1 1.6.9l1.9-.6a1 1 0 0 1 1.1.4l1 1.7a1 1 0 0 1-.2 1.1l-1.6 1.3c.07.6.07 1.2 0 1.8L19.4 15z" />
  </svg>
);
