import React from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";

const TITLE_MAP = {
  "/": "Workout Tracker",
  "/session": "Session",
  "/plan": "Plan",
  "/exercises": "Exercises",
  "/history": "History",
  "/settings": "Settings",
};

export default function Layout() {
  const { pathname } = useLocation();
  const title =
    TITLE_MAP[pathname] ??
    (pathname.startsWith("/session") ? "Session" :
     pathname.startsWith("/plan") ? "Plan" :
     pathname.startsWith("/exercises") ? "Exercises" :
     pathname.startsWith("/history") ? "History" :
     pathname.startsWith("/settings") ? "Settings" : "Workout Tracker");

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="home-btn" aria-label="Home">⌂</Link>
        <h1 className="app-title">{title}</h1>
        <div className="header-right" />
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="tabbar">
        <NavLink end to="/session" className="tab">
          <span className="tab-ico">🕒</span><span className="tab-txt">Session</span>
        </NavLink>
        <NavLink end to="/plan" className="tab">
          <span className="tab-ico">📋</span><span className="tab-txt">Plan</span>
        </NavLink>
        <NavLink end to="/exercises" className="tab">
          <span className="tab-ico">🏋️</span><span className="tab-txt">Exercises</span>
        </NavLink>
        <NavLink end to="/history" className="tab">
          <span className="tab-ico">🕰️</span><span className="tab-txt">History</span>
        </NavLink>
        <NavLink end to="/settings" className="tab">
          <span className="tab-ico">⚙️</span><span className="tab-txt">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
