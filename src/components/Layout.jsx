import React from "react";
import { NavLink, Link } from "react-router-dom";
import { HomeIcon, SessionIcon, PlanIcon, ExercisesIcon, HistoryIcon, SettingsIcon } from "../Icons.jsx";

/**
 * App shell: header (home + centered title + optional right slot),
 * main content, and bottom tab bar.
 *
 * Props:
 * - title: string in the header center
 * - active: "session" | "plan" | "exercises" | "history" | "settings"
 * - headerRight: optional React node (e.g., stopwatch button)
 */
export default function Layout({ title, active, headerRight, children }) {
  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <Link to="/" className="home-btn" aria-label="Home">
          <HomeIcon />
        </Link>

        <div className="header-title" role="heading" aria-level={1}>
          {title}
        </div>

        <div className="header-right">
          {headerRight ?? null}
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">{children}</main>

      {/* Tab bar */}
      <nav className="tabbar" aria-label="Primary">
        <NavLink to="/session" className={({isActive}) => "tab-item " + ((active==="session"||isActive) ? "tab-active" : "")}>
          <SessionIcon /><span>Session</span>
        </NavLink>
        <NavLink to="/plan" className={({isActive}) => "tab-item " + ((active==="plan"||isActive) ? "tab-active" : "")}>
          <PlanIcon /><span>Plan</span>
        </NavLink>
        <NavLink to="/exercises" className={({isActive}) => "tab-item " + ((active==="exercises"||isActive) ? "tab-active" : "")}>
          <ExercisesIcon /><span>Exercises</span>
        </NavLink>
        <NavLink to="/history" className={({isActive}) => "tab-item " + ((active==="history"||isActive) ? "tab-active" : "")}>
          <HistoryIcon /><span>History</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => "tab-item " + ((active==="settings"||isActive) ? "tab-active" : "")}>
          <SettingsIcon /><span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
