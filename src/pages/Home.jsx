import React from "react";
import { Link } from "react-router-dom";

const Tile = ({ to, emoji, label }) => (
  <Link to={to} className="home-tile">
    <span className="home-emoji" aria-hidden>{emoji}</span>
    <span className="home-label">{label}</span>
  </Link>
);

export default function Home() {
  return (
    <div className="home">
      <div className="home-grid">
        <Tile to="/session"   emoji="🕒" label="Session" />
        <Tile to="/plan"      emoji="📋" label="Plan" />
        <Tile to="/exercises" emoji="🏋️" label="Exercises" />
        <Tile to="/history"   emoji="🕰️" label="History" />
        <Tile to="/settings"  emoji="⚙️" label="Settings" />
      </div>
    </div>
  );
}
