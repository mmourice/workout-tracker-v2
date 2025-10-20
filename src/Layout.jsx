import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const TITLES = {
  "/session": "Session",
  "/plan": "Plan",
  "/exercises": "Exercises",
  "/history": "History",
  "/settings": "Settings",
  "/": "Workout Tracker",
};

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = TITLES[pathname] || "Workout Tracker";

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <button className="home-btn" aria-label="Home" onClick={() => navigate("/")}>
          <span className="home-ico">⌂</span>
        </button>
        <h1 className="app-title">{title}</h1>
        <div className="head-spacer" />
      </header>

      {/* THIS is the missing piece - renders the page */}
      <main className="app-body">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="app-tabbar">
        <NavLink to="/session" className="tab">
          <span className="ico">🕒</span><span>Session</span>
        </NavLink>
        <NavLink to="/plan" className="tab">
          <span className="ico">📋</span><span>Plan</span>
        </NavLink>
        <NavLink to="/exercises" className="tab">
          <span className="ico">🏋️</span><span>Exercises</span>
        </NavLink>
        <NavLink to="/history" className="tab">
          <span className="ico">🕑</span><span>History</span>
        </NavLink>
        <NavLink to="/settings" className="tab">
          <span className="ico">⚙️</span><span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
