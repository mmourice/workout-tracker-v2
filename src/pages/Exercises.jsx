import React, { useMemo, useState } from "react";
import { useStore, groups } from "../store.jsx";
import { useNavigate } from "react-router-dom";

function AddModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("Chest");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [link, setLink] = useState("");

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Add Exercise</h3>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Incline Chest Press" />
        <div className="grid-3">
          <div>
            <label>Group</label>
            <select value={group} onChange={e=>setGroup(e.target.value)}>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label>Sets</label>
            <input type="number" value={sets} onChange={e=>setSets(Number(e.target.value||0))} />
          </div>
          <div>
            <label>Reps</label>
            <input type="number" value={reps} onChange={e=>setReps(Number(e.target.value||0))} />
          </div>
        </div>
        <label>YouTube link (optional)</label>
        <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://www.youtube.com/..." />
        <div className="row end gap">
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={()=>{
            onCreate({ name, group, defaultSets: sets, defaultReps: reps, link });
            onClose();
          }}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default function Exercises() {
  const { state, addExercise, deleteExercise, addExerciseToDay } = useStore();
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const nav = useNavigate();

  const byGroup = useMemo(() => {
    const map = Object.fromEntries(groups.map(g => [g, []]));
    state.exercises.forEach(ex => {
      if (!q || ex.name.toLowerCase().includes(q.toLowerCase())) {
        if (!map[ex.group]) map[ex.group] = [];
        map[ex.group].push(ex);
      }
    });
    return map;
  }, [state.exercises, q]);

  const pendingDay = state.plan.pendingAddToDayId;

  return (
    <div className="container">
      <h1 className="app-title">Exercises</h1>

      <input className="search" placeholder="Search exercises..." value={q} onChange={e=>setQ(e.target.value)} />
      <button className="primary" onClick={()=>setShowAdd(true)}>＋ Add Exercise</button>

      {groups.map(g => (
        <div key={g} className="group-block">
          <div className="group-title">{g}</div>
          <div className="chip-cloud">
            {byGroup[g]?.map(ex => (
              <div key={ex.id} className="chip-row">
                <button
                  className="chip"
                  title={pendingDay ? "Add to day" : "Open video"}
                  onClick={()=>{
                    if (pendingDay) {
                      addExerciseToDay(pendingDay, ex.id);
                      alert(`Added to day ✔`);
                      nav("/plan");
                    } else {
                      window.open(ex.link || `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name)}`, "_blank");
                    }
                  }}
                >
                  {ex.name}
                </button>
                <button className="ghost small danger" onClick={()=>deleteExercise(ex.id)}>🗑︎</button>
              </div>
            ))}
            {(!byGroup[g] || byGroup[g].length===0) && <div className="muted">No exercises in {g}.</div>}
          </div>
        </div>
      ))}

      <AddModal
        open={showAdd}
        onClose={()=>setShowAdd(false)}
        onCreate={(payload)=>{
          const id = addExercise(payload);
          if (state.plan.pendingAddToDayId) {
            addExerciseToDay(state.plan.pendingAddToDayId, id);
          }
        }}
      />
    </div>
  );
}
