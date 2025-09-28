import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

function Home() {
  return (
    <div className="page">
      <h1>Workout Tracker</h1>
      <nav className="home-grid">
        <Link className="pill" to="/session">Session</Link>
        <Link className="pill" to="/plan">Plan</Link>
        <Link className="pill" to="/exercises">Exercises</Link>
        <Link className="pill" to="/history">History</Link>
        <Link className="pill" to="/settings">Settings</Link>
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
