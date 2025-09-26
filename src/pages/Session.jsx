import React, { useMemo, useState } from "react";
import { useStore } from "../store.jsx";
import { PlusIcon, TrashIcon, ClockIcon } from "../Icons.jsx";

const useTimer = (initial=90)=>{
  const [sec,setSec]=useState(initial);
  const [on,setOn]=useState(false);
  React.useEffect(()=>{
    if(!on) return;
    const t=setInterval(()=> setSec(s=> Math.max(0,s-1)), 1000);
    return ()=>clearInterval(t);
  },[on]);
  return {
    sec, on,
    start:()=>setOn(true),
    pause:()=>setOn(false),
    reset:(n=initial)=>{setOn(false);setSec(n);}
  };
};

export default function Session(){
  const { days, units, saveSession } = useStore();
  const [dayId,setDayId] = useState(days[0]?.id || "");
  const day = days.find(d=>d.id===dayId) || days[0] || {items:[]};

  // sessionEntries: { [exercise]: [{kg:'', reps:''}, ...] }
  const [sessionEntries, setEntries] = useState({});
  const ensureSets=(name)=> sessionEntries[name] || [{kg:"",reps:""},{kg:"",reps:""}];

  const onChange = (ex, i, key, val)=>{
    const arr = [...ensureSets(ex)];
    arr[i] = {...arr[i],[key]:val};
    setEntries(s=>({...s,[ex]:arr}));
  };
  const addSet=(ex)=> setEntries(s=>({...s,[ex]:[...ensureSets(ex), {kg:"",reps:""}]}));
  const removeSet=(ex, i)=> setEntries(s=>{
    const arr=[...ensureSets(ex)];
    arr.splice(i,1);
    return {...s,[ex]:arr};
  });
  const removeExercise=(ex)=> setEntries(s=>{ const c={...s}; delete c[ex]; return c; });

  const timerByExercise = useMemo(()=> Object.fromEntries(day.items.map(n=>[n,useTimer(90)])), [dayId]);

  const doSave = ()=>{
    saveSession(dayId, sessionEntries);
    setEntries({});
    alert("Session saved!");
  };

  return (
    <div>
      <div className="sectionTitle">Pick day</div>
      <div className="chips">
        {days.map(d=>(
          <button key={d.id}
            className={`chip ${d.id===dayId?'active':''}`}
            onClick={()=>setDayId(d.id)}>{d.name}</button>
        ))}
      </div>

      <div className="row" style={{gap:12, margin:"8px 0 18px"}}>
        <button className="btn">Copy last</button>
        <button className="btn">Clear</button>
        <button className="btn primary" onClick={doSave}>Save Session</button>
      </div>

      {day.items.map(ex=>(
        <div className="card mt16" key={ex} style={{padding:16}}>
          <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
            <div style={{fontSize:20,fontWeight:700}}>{ex}</div>
            <div className="kv">
              <span className="btn icon"><ClockIcon/></span>
              <div className="btn">{String(timerByExercise[ex].sec).padStart(2,"0")}s</div>
              <button className="btn" onClick={()=>timerByExercise[ex].start()}>Start</button>
              <button className="btn" onClick={()=>timerByExercise[ex].pause()}>Pause</button>
              <button className="btn" onClick={()=>timerByExercise[ex].reset()}>Reset</button>
              <button className="btn icon" onClick={()=>addSet(ex)} title="Add set"><PlusIcon/></button>
              <button className="btn icon" onClick={()=>removeExercise(ex)} title="Remove exercise"><TrashIcon/></button>
            </div>
          </div>

          <div className="setGrid mt16">
            {(ensureSets(ex)).map((s,i)=>(
              <div key={i} className="card" style={{padding:12, position:"relative"}}>
                <div className="label">Set {i+1}</div>
                <div className="row">
                  <input className="input" inputMode="decimal" placeholder={units}
                         value={s.kg} onChange={e=>onChange(ex,i,"kg",e.target.value)}/>
                  <input className="input" inputMode="numeric" placeholder="reps"
                         value={s.reps} onChange={e=>onChange(ex,i,"reps",e.target.value)}/>
                </div>
                <button className="btn icon" style={{position:"absolute",right:8,top:8}}
                        onClick={()=>removeSet(ex,i)} title="Delete set">×</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {day.items.length===0 && (
        <div className="card mt16" style={{padding:16}}>No exercises in this day. Add some in Plan.</div>
      )}
    </div>
  );
}
