import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Session from "./pages/Session.jsx";
import Plan from "./pages/Plan.jsx";
import Exercises from "./pages/Exercises.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import "./modern.css";

const NavBtn = ({to, children})=>(
  <Link to={to} className="btn">{children}</Link>
);

const Dashboard = ()=>(
  <div className="container">
    <h1 className="app-title">Workout Tracker</h1>
    <div className="row">
      <NavBtn to="/session" className="btn primary">Session</NavBtn>
      <NavBtn to="/plan">Plan</NavBtn>
      <NavBtn to="/exercises">Exercises</NavBtn>
      <NavBtn to="/history">History</NavBtn>
      <NavBtn to="/settings">Settings</NavBtn>
    </div>
  </div>
);

const Shell = ({children})=>{
  const nav = useNavigate();
  return (
    <div className="container">
      <h1 className="app-title">Workout Tracker</h1>
      <div className="row" style={{gap:12, marginBottom:16}}>
        <Link to="/session" className="btn">Session</Link>
        <Link to="/plan" className="btn">Plan</Link>
        <Link to="/exercises" className="btn">Exercises</Link>
        <Link to="/history" className="btn">History</Link>
      </div>
      {children}
    </div>
  );
};

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/session" element={<Shell><Session/></Shell>} />
      <Route path="/plan" element={<Shell><Plan/></Shell>} />
      <Route path="/exercises" element={<Shell><Exercises/></Shell>} />
      <Route path="/history" element={<Shell><History/></Shell>} />
      <Route path="/settings" element={<Shell><Settings/></Shell>} />
      <Route path="*" element={<Dashboard/>}/>
    </Routes>
  );
}
