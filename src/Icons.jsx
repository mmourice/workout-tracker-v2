import React from "react";

export const PlusIcon = (p)=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export const TrashIcon = (p)=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M3 6h18M9 6V4h6v2M8 6l1 14h6l1-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const ClockIcon = (p)=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export const ChevronRight = (p)=>(
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
