import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";
import { PlusIcon, ChevronRight } from "../Icons.jsx";

const useQuery = ()=> new URLSearchParams(useLocation().search);

export default function Exercises(){
  const { exercises, addExercise, addExerciseToDay } = useStore();
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({name:"", group:"Chest", sets:3, reps:10, url:""});
  const nav = useNavigate();
  const q = useQuery();
  const addToDay = q.get("addToDay");

  const groups = useMemo(()=>Object.keys(exercises),[exercises]);

  const onCreate = ()=>{
    if(!form.name.trim()) return;
    addExercise(form.group, form.name.trim());
    setOpen(null);
  };

  const onPick = (group, name)=>{
    if(addToDay){
      addExerciseToDay(addToDay, name);
      nav(-1); // back to Plan
    }
  };

  return (
    <div>
      <div className="label">Manage exercises by muscle group</div>
      <div className="row" style={{margin:"8px 0 16px"}}>
        <button className="btn primary" onClick={()=>{setForm({name:"",group:"Chest",sets:3,reps:10,url:""});setOpen("create");}}>
          <PlusIcon/> Add Exercise
        </button>
      </div>

      {groups.map(g=>(
        <div key={g} className="card mt16 tile" style={{padding:16}}>
          <div className="sectionTitle">{g}</div>
          <div className="pills">
            {exercises[g].map(name=>(
              <button key={name} className="pill" onClick={()=>onPick(g,name)} title="Tap to add to plan (if opened from Plan)">
                {name}
              </button>
            ))}
          </div>
          <div className="chev"><ChevronRight/></div>
        </div>
      ))}

      {open==="create" && (
        <div className="modalScrim" onClick={()=>setOpen(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Add Exercise</h3>
            <div className="label">Name</div>
            <input className="input" placeholder="e.g., Incline Chest Press"
                   value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
            <div className="row mt12">
              <div style={{flex:1}}>
                <div className="label">Group</div>
                <select className="input" value={form.group} onChange={e=>setForm(f=>({...f,group:e.target.value}))}>
                  {groups.map(g=><option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <div className="label">Sets</div>
                <input className="input" type="number" value={form.sets} onChange={e=>setForm(f=>({...f,sets:e.target.value}))}/>
              </div>
              <div style={{flex:1}}>
                <div className="label">Reps</div>
                <input className="input" type="number" value={form.reps} onChange={e=>setForm(f=>({...f,reps:e.target.value}))}/>
              </div>
            </div>
            <div className="label mt12">YouTube link (optional)</div>
            <input className="input" placeholder="https://www.youtube.com/watch?v=..." value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))}/>
            <div className="row mt16">
              <button className="btn primary" onClick={onCreate}>Create</button>
              <button className="btn" onClick={()=>setOpen(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
