import React from "react";
import { Routes, Route, Link } from "react-router-dom";

function Page({ title }) {
  return (
    <div style={{ padding: 24, color: "#fff", fontFamily: "system-ui" }}>
      <h1>{title}</h1>
      <p>This is a placeholder page. Build succeeded ✅</p>
      <p><Link to="/">← Back home</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(1200px 600px at 10% -10%, #1e1729 10%, #000 60%)"
    }}>
      <div style={{ padding: 24 }}>
        <h1 style={{ color: "#fff", marginBottom: 16 }}>Workout Tracker</h1>
        <nav style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 180px))" }}>
          <Link to="/session" style={pill}>Session</Link>
          <Link to="/plan"    style={pill}>Plan</Link>
          <Link to="/exercises" style={pill}>Exercises</Link>
          <Link to="/history" style={pill}>History</Link>
          <Link to="/settings" style={pill}>Settings</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/session" element={<Page title="Session" />} />
        <Route path="/plan" element={<Page title="Plan" />} />
        <Route path="/exercises" element={<Page title="Exercises" />} />
        <Route path="/history" element={<Page title="History" />} />
        <Route path="/settings" element={<Page title="Settings" />} />
      </Routes>
    </div>
  );
}

const pill = {
  padding: "12px 16px",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 20,
  textDecoration: "none",
  textAlign: "center",
  background: "rgba(255,255,255,0.05)"
};
