import React from "react";
import { useStore } from "../store.jsx";

export default function Settings(){
  const { units, toggleUnits, resetAll } = useStore();
  return (
    <div>
      <div className="card" style={{padding:16}}>
        <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div className="sectionTitle">Units</div>
            <div className="label">Default is kg; toggle to lb</div>
          </div>
          <button className="btn primary" onClick={toggleUnits}>Switch to {units==="kg"?"lb":"kg"}</button>
        </div>
      </div>

      <div className="card mt16" style={{padding:16}}>
        <div className="sectionTitle">Danger</div>
        <button className="btn" onClick={()=>{ if(confirm("Clear all local data?")) resetAll(); }}>Reset App (clear data)</button>
      </div>
    </div>
  );
}
