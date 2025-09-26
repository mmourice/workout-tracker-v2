import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// --- Seed exercises (matches your screenshot structure)
const seed = {
  Chest: [
    "Incline Chest Press",
    "Chest Fly (Machine)",
    "Flat Chest Press-Machine",
    "Flat Chest Press-Barbell",
    "Cable Crossover (Low to High)",
    "Cable Crossover (High to Low)",
    "Incline Dumbbell Press",
  ],
  Back: [
    "Lat Pulldown - wide grip",
    "Reverse Pulldown - medium grip",
    "Cable Seated Row",
    "Back Extension",
    "Cable Crossover (Low to High)",
    "Cable Crossover (High to Low)",
    "Incline Dumbbell Press",
  ],
  Shoulders: [
    "Lat Pulldown - wide grip",
    "Reverse Pulldown - medium grip",
    "Cable Seated Row",
    "Back Extension",
    "Cable Crossover (Low to High)",
    "Cable Crossover (High to Low)",
    "Incline Dumbbell Press",
  ],
};

const defaultDays = [
  { id:"upper-a", name:"Upper A", items:["Incline Chest Press","Seated Cable Row","Lateral Raises"] },
  { id:"upper-b", name:"Upper B", items:[] },
  { id:"lower",   name:"Lower",   items:[] },
  { id:"full",    name:"Full Body", items:[] },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // Settings
      units:"kg", toggleUnits:()=> set(s=>({units: s.units==="kg"?"lb":"kg"})),
      // Data
      exercises: seed,
      days: defaultDays,
      history: [], // {id, dateISO, dayId, exercise, sets:[{kg,reps}]}

      // Plan ops
      addDay:(name)=> set(s=>({days:[...s.days,{id:crypto.randomUUID(),name,items:[]}]})),
      removeDay:(id)=> set(s=>({days:s.days.filter(d=>d.id!==id)})),
      addExerciseToDay:(dayId, name)=> set(s=>{
        const days = s.days.map(d=> d.id===dayId ? {...d, items:[...new Set([...d.items,name])]} : d);
        return {days};
      }),
      removeExerciseFromDay:(dayId, name)=> set(s=>{
        const days = s.days.map(d=> d.id===dayId ? {...d, items:d.items.filter(x=>x!==name)} : d);
        return {days};
      }),
      // Exercises ops
      addExercise:(group,name)=> set(s=>{
        const ex = {...s.exercises};
        ex[group] = ex[group] ? [...new Set([...ex[group], name])] : [name];
        return {exercises:ex};
      }),
      // Session
      saveSession:(dayId, entries)=> {
        const dateISO = new Date().toISOString();
        const rows = [];
        Object.entries(entries).forEach(([exercise, sets])=>{
          rows.push({ id:crypto.randomUUID(), dateISO, dayId, exercise, sets });
        });
        set(s=>({history:[...rows, ...s.history]}));
      },
      deleteHistory:(id)=> set(s=>({history:s.history.filter(h=>h.id!==id)})),
      resetAll:()=> set({units:"kg", exercises:seed, days:defaultDays, history:[]})
    }),
    { name:"wt-v1", storage:createJSONStorage(()=>localStorage) }
  )
);
