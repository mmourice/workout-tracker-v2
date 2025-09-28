import React from "react";

/* --------------------------- small utilities --------------------------- */
const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

function useLocalStore(key, initialValue) {
  const initial =
    typeof initialValue === "function" ? initialValue() : initialValue;

  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}

/* ------------------------------ data shape ----------------------------- */

const GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Legs",
  "Arms",
  "Core",
  "Cardio",
  "Other",
];

const emptyExercises = () =>
  GROUPS.reduce((acc, g) => {
    acc[g] = []; // { id,name,link,defaultSets,defaultReps }
    return acc;
  }, {});

const initialState = () => ({
  theme: "dark",
  units: "kg",
  exercises: emptyExercises(),
  plan: [
    { id: "upper-a", name: "Upper A", items: [] }, // items: [{ id,name,group }]
    { id: "upper-b", name: "Upper B", items: [] },
    { id: "lower", name: "Lower", items: [] },
    { id: "full-body", name: "Full Body", items: [] },
  ],
  session: {
    dayId: "upper-a",
    items: [
      // { id,name,link,restSec,sets:[{kg:"",reps:""}] }
    ],
  },
  history: [
    // { id,dateISO, dayName, items:[{name, sets:[{kg,reps}]}] }
  ],
});

/* ------------------------------- context -------------------------------- */

const StoreContext = React.createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useLocalStore("wt_v2", initialState);

  /* ------------------------------- actions ------------------------------ */

  // Settings
  const setUnits = (units) =>
    setData((d) => ({
      ...d,
      units: units === "lb" ? "lb" : "kg",
    }));
  const setTheme = (theme) =>
    setData((d) => ({
      ...d,
      theme: theme === "light" ? "light" : "dark",
    }));

  // Exercises catalog
  const addExercise = ({ name, group, link = "", defaultSets = 3, defaultReps = 10 }) =>
    setData((d) => {
      if (!GROUPS.includes(group)) return d;
      const exists = d.exercises[group].some(
        (e) => e.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (exists) return d;
      const ex = { id: uid(), name: name.trim(), link, defaultSets, defaultReps };
      return {
        ...d,
        exercises: { ...d.exercises, [group]: [...d.exercises[group], ex] },
      };
    });

  const deleteExercise = (group, id) =>
    setData((d) => {
      if (!GROUPS.includes(group)) return d;
      return {
        ...d,
        exercises: {
          ...d.exercises,
          [group]: d.exercises[group].filter((e) => e.id !== id),
        },
      };
    });

  // Plan (days)
  const addToPlan = (dayId, { name, group }) =>
    setData((d) => {
      const plan = d.plan.map((day) =>
        day.id === dayId
          ? { ...day, items: [...day.items, { id: uid(), name, group }] }
          : day
      );
      return { ...d, plan };
    });

  const removeFromPlan = (dayId, itemId) =>
    setData((d) => {
      const plan = d.plan.map((day) =>
        day.id === dayId
          ? { ...day, items: day.items.filter((i) => i.id !== itemId) }
          : day
      );
      return { ...d, plan };
    });

  // Session
  const startSession = (dayId) =>
    setData((d) => ({ ...d, session: { dayId, items: [] } }));

  const addSessionItem = ({ name, link = "", sets = 2, restSec = 90 }) =>
    setData((d) => {
      const newItem = {
        id: uid(),
        name,
        link,
        restSec,
        sets: Array.from({ length: Math.max(1, sets) }, () => ({
          kg: "",
          reps: "",
        })),
      };
      return { ...d, session: { ...d.session, items: [...d.session.items, newItem] } };
    });

  const removeSessionItem = (itemId) =>
    setData((d) => ({
      ...d,
      session: {
        ...d.session,
        items: d.session.items.filter((it) => it.id !== itemId),
      },
    }));

  const addSet = (itemId) =>
    setData((d) => ({
      ...d,
      session: {
        ...d.session,
        items: d.session.items.map((it) =>
          it.id === itemId ? { ...it, sets: [...it.sets, { kg: "", reps: "" }] } : it
        ),
      },
    }));

  const removeSet = (itemId, setIndex) =>
    setData((d) => ({
      ...d,
      session: {
        ...d.session,
        items: d.session.items.map((it) =>
          it.id === itemId
            ? { ...it, sets: it.sets.filter((_, i) => i !== setIndex) }
            : it
        ),
      },
    }));

  const updateSet = (itemId, setIndex, field, value) =>
    setData((d) => ({
      ...d,
      session: {
        ...d.session,
        items: d.session.items.map((it) =>
          it.id === itemId
            ? {
                ...it,
                sets: it.sets.map((s, i) =>
                  i === setIndex ? { ...s, [field]: value } : s
                ),
              }
            : it
        ),
      },
    }));

  const clearSession = () =>
    setData((d) => ({ ...d, session: { dayId: d.session.dayId, items: [] } }));

  const saveSessionToHistory = () =>
    setData((d) => {
      if (d.session.items.length === 0) return d;
      const dayName = d.plan.find((x) => x.id === d.session.dayId)?.name || "";
      const entry = {
        id: uid(),
        dateISO: new Date().toISOString(),
        dayName,
        items: d.session.items.map((it) => ({
          name: it.name,
          sets: it.sets.map((s) => ({ kg: s.kg, reps: s.reps })),
        })),
      };
      return {
        ...d,
        history: [entry, ...d.history],
        session: { dayId: d.session.dayId, items: [] },
      };
    });

  const deleteHistory = (entryId) =>
    setData((d) => ({ ...d, history: d.history.filter((h) => h.id !== entryId) }));

  /* ------------------------------- value -------------------------------- */

  const value = {
    data,
    GROUPS,
    // settings
    setUnits,
    setTheme,
    // catalog
    addExercise,
    deleteExercise,
    // plan
    addToPlan,
    removeFromPlan,
    // session
    startSession,
    addSessionItem,
    removeSessionItem,
    addSet,
    removeSet,
    updateSet,
    clearSession,
    saveSessionToHistory,
    // history
    deleteHistory,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore() must be used within <StoreProvider>");
  }
  return ctx;
}
