import React, { createContext, useContext, useMemo, useReducer } from "react";

/** ---------- Types (conceptual)
 * Exercise: { id, name, group, defaultSets, defaultReps, link? }
 * Day: { id, name, exerciseIds: string[] }
 * Log: { id, dateISO, dayName, entries: [{ exerciseId, sets: [{ w, r }] }] }
 */

const LS_KEY = "wt_v2_state";

const seedExercises = [
  { id: "ex_incline_chest_press", name: "Incline Chest Press", group: "Chest", defaultSets: 4, defaultReps: 10, link: "https://www.youtube.com/results?search_query=incline+chest+press" },
  { id: "ex_seated_cable_row", name: "Seated Cable Row", group: "Back", defaultSets: 4, defaultReps: 10, link: "https://www.youtube.com/results?search_query=seated+cable+row" },
  { id: "ex_lateral_raises", name: "Lateral Raises", group: "Shoulders", defaultSets: 3, defaultReps: 12, link: "https://www.youtube.com/results?search_query=lateral+raises" },
];

const seedPlan = {
  days: [
    { id: "day_upper_a", name: "Upper A", exerciseIds: ["ex_incline_chest_press", "ex_seated_cable_row", "ex_lateral_raises"] },
    { id: "day_upper_b", name: "Upper B", exerciseIds: [] },
    { id: "day_lower",   name: "Lower",   exerciseIds: [] },
    { id: "day_full",    name: "Full Body", exerciseIds: [] },
  ],
  pendingAddToDayId: null, // used when navigating Plan ➜ Exercises ➜ add
};

const initialState = (() => {
  try {
    const fromLS = JSON.parse(localStorage.getItem(LS_KEY));
    if (fromLS && typeof fromLS === "object") return fromLS;
  } catch {}
  return {
    units: "kg", // 'kg' | 'lb'
    exercises: seedExercises,
    plan: seedPlan,
    logs: [],
  };
})();

function save(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function reducer(state, action) {
  switch (action.type) {
    // Units
    case "SET_UNITS": {
      const next = { ...state, units: action.units };
      save(next); return next;
    }

    // Exercises
    case "ADD_EXERCISE": {
      const next = { ...state, exercises: [...state.exercises, action.exercise] };
      save(next); return next;
    }
    case "DELETE_EXERCISE": {
      const id = action.id;
      const exercises = state.exercises.filter(e => e.id !== id);
      const plan = {
        ...state.plan,
        days: state.plan.days.map(d => ({ ...d, exerciseIds: d.exerciseIds.filter(x => x !== id) }))
      };
      const next = { ...state, exercises, plan };
      save(next); return next;
    }

    // Plan / Days
    case "ADD_DAY": {
      const day = { id: crypto.randomUUID(), name: action.name || "New Day", exerciseIds: [] };
      const next = { ...state, plan: { ...state.plan, days: [...state.plan.days, day] } };
      save(next); return next;
    }
    case "RENAME_DAY": {
      const { dayId, name } = action;
      const days = state.plan.days.map(d => d.id === dayId ? { ...d, name } : d);
      const next = { ...state, plan: { ...state.plan, days } };
      save(next); return next;
    }
    case "DELETE_DAY": {
      const days = state.plan.days.filter(d => d.id !== action.dayId);
      const next = { ...state, plan: { ...state.plan, days } };
      save(next); return next;
    }
    case "ADD_EX_TO_DAY": {
      const { dayId, exerciseId } = action;
      const days = state.plan.days.map(d => d.id === dayId
        ? { ...d, exerciseIds: d.exerciseIds.includes(exerciseId) ? d.exerciseIds : [...d.exerciseIds, exerciseId] }
        : d);
      const next = { ...state, plan: { ...state.plan, days, pendingAddToDayId: null } };
      save(next); return next;
    }
    case "REMOVE_EX_FROM_DAY": {
      const { dayId, exerciseId } = action;
      const days = state.plan.days.map(d => d.id === dayId
        ? { ...d, exerciseIds: d.exerciseIds.filter(id => id !== exerciseId) }
        : d);
      const next = { ...state, plan: { ...state.plan, days } };
      save(next); return next;
    }
    case "SET_PENDING_ADD_DAY": {
      const next = { ...state, plan: { ...state.plan, pendingAddToDayId: action.dayId } };
      save(next); return next;
    }

    // History
    case "SAVE_LOG": {
      const next = { ...state, logs: [action.log, ...state.logs] };
      save(next); return next;
    }
    case "DELETE_LOG": {
      const next = { ...state, logs: state.logs.filter(l => l.id !== action.id) };
      save(next); return next;
    }

    // Danger zone
    case "RESET_APP": {
      localStorage.removeItem(LS_KEY);
      return initialState;
    }

    default: return state;
  }
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(() => ({
    state,

    // Units
    setUnits: (units) => dispatch({ type: "SET_UNITS", units }),

    // Exercises
    addExercise: (payload) => {
      const id = payload.id || ("ex_" + crypto.randomUUID());
      dispatch({ type: "ADD_EXERCISE", exercise: { ...payload, id } });
      return id;
    },
    deleteExercise: (id) => dispatch({ type: "DELETE_EXERCISE", id }),

    // Plan
    addDay: (name) => dispatch({ type: "ADD_DAY", name }),
    renameDay: (dayId, name) => dispatch({ type: "RENAME_DAY", dayId, name }),
    deleteDay: (dayId) => dispatch({ type: "DELETE_DAY", dayId }),
    addExerciseToDay: (dayId, exerciseId) => dispatch({ type: "ADD_EX_TO_DAY", dayId, exerciseId }),
    removeExerciseFromDay: (dayId, exerciseId) => dispatch({ type: "REMOVE_EX_FROM_DAY", dayId, exerciseId }),
    setPendingAddDay: (dayId) => dispatch({ type: "SET_PENDING_ADD_DAY", dayId }),

    // History
    saveLog: (log) => dispatch({ type: "SAVE_LOG", log }),
    deleteLog: (id) => dispatch({ type: "DELETE_LOG", id }),

    // Danger
    resetApp: () => dispatch({ type: "RESET_APP" }),
  }), [state]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

// Selectors
export function getExerciseById(state, id) {
  return state.exercises.find(e => e.id === id);
}
export function getDayById(state, dayId) {
  return state.plan.days.find(d => d.id === dayId);
}
export const groups = ["Chest","Back","Shoulders","Legs","Arms","Core","Cardio","Other"];
