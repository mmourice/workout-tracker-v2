// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";

import Home from "./pages/Home.jsx";
import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      {/* Layout controls header + bottom nav; children render in <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="session" element={<Session />} />
        <Route path="plan" element={<Plan />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
