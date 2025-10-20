import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";

import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      {/* All pages render inside Layout -> <Outlet/> */}
      <Route element={<Layout />}>
        <Route index element={<Session />} />             {/* default: / -> Session */}
        <Route path="/session" element={<Session />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Session />} />          {/* catch-all */}
      </Route>
    </Routes>
  );
}
