import React, { useMemo, useState } from "react";
import { useStore } from "../store.jsx";
import { TrashIcon } from "../Icons.jsx";

export default function History(){
  const { history, deleteHistory } = useStore();
  const exercises = useMemo(()=> [...new Set(history.map(h=>h.exercise))], [history]);
  const [filter,setFilter] = useState(exercises[0] || "");

  const rows = history.filter(h=> !filter || h.exercise===filter);

  return (
    <div>
      <div className="label">Exercise</div>
      <div className="chips">
        {exercises.map(name=>(
          <button key={name} className={`chip ${filter===name?'active':''}`} onClick={()=>setFilter(name)}>{name}</button>
        ))}
      </div>

      {rows.map(r=>(
        <div className="card mt16" key={r.id} style={{padding:16}}>
          <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:700}}>{new Date(r.dateISO).toLocaleDateString()}</div>
            <button className="btn icon" onClick={()=>{ if(confirm("Delete log?")) deleteHistory(r.id); }}><TrashIcon/></button>
          </div>
          <div className="setGrid mt12">
            {r.sets.map((s,i)=>(
              <div key={i} className="card" style={{padding:12}}>
                <div className="label">Set {i+1}</div>
                <div className="row">
                  <div className="pill">{s.kg} kg</div>
                  <div className="pill">{s.reps} reps</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {rows.length===0 && <div className="card mt16" style={{padding:16}}>No history yet.</div>}
    </div>
  );
}
