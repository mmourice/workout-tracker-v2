import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

function Home() {
  const NavTile = ({ to, children }) => (
    <Link className="tile tile--nav" to={to}>
      <span>{children}</span>
    </Link>
  );

  return (
    <div className="home hero">
      <h1 className="hero-title">Workout Tracker</h1>

      <nav className="stack-nav">
        <NavTile to="/session">Session</NavTile>
        <NavTile to="/plan">Plan</NavTile>
        <NavTile to="/exercises">Exercises</NavTile>
        <NavTile to="/history">History</NavTile>
        <NavTile to="/settings">Settings</NavTile>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<Session />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
