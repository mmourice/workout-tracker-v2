import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";
import { TrashIcon, PlusIcon } from "../Icons.jsx";

export default function Plan(){
  const { days, addDay, removeDay, removeExerciseFromDay } = useStore();
  const nav = useNavigate();

  const createDay = ()=>{
    const name = prompt("Day name");
    if(name) addDay(name);
  };

  return (
    <div>
      <button className="btn primary" onClick={createDay}><PlusIcon/> Add Day</button>

      {days.map(d=>(
        <div className="card mt16" key={d.id} style={{padding:16}}>
          <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div className="label">Day name</div>
              <input className="input" defaultValue={d.name} readOnly />
            </div>
            <button className="btn icon" title="Delete day" onClick={()=>removeDay(d.id)}><TrashIcon/></button>
          </div>

          <div className="label mt16">Exercises</div>
          {d.items.map(name=>(
            <div key={name} className="row" style={{alignItems:"center",justifyContent:"space-between",borderBottom:"1px dashed var(--stroke)", padding:"8px 0"}}>
              <div>{name}</div>
              <button className="btn icon" onClick={()=>removeExerciseFromDay(d.id,name)} title="Remove"><TrashIcon/></button>
            </div>
          ))}

          <div className="mt12">
            <button className="btn" onClick={()=>nav(`/exercises?addToDay=${encodeURIComponent(d.id)}`)}>
              <PlusIcon/> Add exercise
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
