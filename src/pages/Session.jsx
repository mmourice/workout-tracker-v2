import React, { useState } from "react";
import { Plus, Trash } from "../Icons.jsx";

export default function Session(){
  const [sets, setSets] = useState([{ id: 1, w:"", r:"" }, { id: 2, w:"", r:"" }]);
  const add = ()=> setSets(s => [...s, { id: Date.now(), w:"", r:"" }]);
  const remove = (id)=> setSets(s => s.filter(x => x.id !== id));
  const update = (id, key, val)=> setSets(s => s.map(x => x.id===id? {...x, [key]:val} : x));

  return (
    <section>
      <h2 className="h1">Session</h2>

      <div className="card" style={{padding:18}}>
        <div className="toolbar">
          <button className="btn" onClick={add}><Plus/> Add set</button>
          <button className="btn btn--brand" onClick={()=>alert("Saved (stub)")}>Save Session</button>
        </div>

        <div className="set-grid" style={{marginTop:8}}>
          {sets.map((s, i)=>(
            <div className="set-card" key={s.id}>
              <div className="set-title">Set {i+1}</div>
              <button className="xbtn" onClick={()=>remove(s.id)}>x</button>
              <div className="set-grid">
                <input className="input" placeholder="kg" inputMode="decimal"
                  value={s.w} onChange={e=>update(s.id,"w",e.target.value)} />
                <input className="input" placeholder="reps" inputMode="numeric"
                  value={s.r} onChange={e=>update(s.id,"r",e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
