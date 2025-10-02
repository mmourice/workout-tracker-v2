// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";    // <- the header + footer wrapper
import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      {/* Wrap all pages with the global Layout */}
      <Route element={<Layout />}>
        {/* Default: go straight to Session */}
        <Route path="/" element={<Navigate to="/session" replace />} />

        <Route path="/session" element={<Session />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />

        {/* Fallback: any unknown route -> Session */}
        <Route path="*" element={<Navigate to="/session" replace />} />
      </Route>
    </Routes>
  );
}
