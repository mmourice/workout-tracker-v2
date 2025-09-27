import React from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

const Pill = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "pill " + (isActive ? "pill--active" : "pill--ghost")
    }
  >
    {children}
  </NavLink>
);

export default function App() {
  return (
    <div className="shell">
      <header className="hero">
        <h1 className="title">
          Workout<br />Tracker
        </h1>
        <nav className="home-grid">
          <Pill to="/session">Session</Pill>
          <Pill to="/plan">Plan</Pill>
          <Pill to="/exercises">Exercises</Pill>
          <Pill to="/history">History</Pill>
          <Pill to="/settings">Settings</Pill>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Session />} />
          <Route path="/session" element={<Session />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="*"
            element={
              <div className="card">
                <h2>Not found</h2>
                <Link className="pill pill--ghost" to="/session">Go to Session</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
