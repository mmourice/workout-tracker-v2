import React, { useEffect, useMemo, useState } from "react";

/* =========================================
   Data & storage helpers
========================================= */
const GROUPS = ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core", "Cardio", "Other"];

const DEFAULTS = {
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
  Legs: [],
  Arms: [],
  Core: [],
  Cardio: [],
  Other: [],
};

function loadExercises() {
  try {
    const raw = localStorage.getItem("wt_exercises");
    if (raw) return JSON.parse(raw);
  } catch {}
  // seed once
  try {
    localStorage.setItem("wt_exercises", JSON.stringify(DEFAULTS));
  } catch {}
  return DEFAULTS;
}

function saveExercises(obj) {
  try {
    localStorage.setItem("wt_exercises", JSON.stringify(obj));
  } catch {}
}

/* =========================================
   Bottom-sheet modal (inline)
========================================= */
function Sheet({ open, onClose, children, titleId }) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================
   Page
========================================= */
export default function Exercises() {
  const [db, setDb] = useState(() => loadExercises());
  const [query, setQuery] = useState("");

  // bottom-sheet state
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("Chest");
  const [newLink, setNewLink] = useState("");

  // persist on change
  useEffect(() => {
    saveExercises(db);
  }, [db]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return db;
    const out = {};
    for (const g of GROUPS) {
      out[g] = (db[g] || []).filter((n) => n.toLowerCase().includes(q));
    }
    return out;
  }, [db, query]);

  function removeExercise(group, name) {
    setDb((prev) => ({
      ...prev,
      [group]: (prev[group] || []).filter((n) => n !== name),
    }));
  }

  function handleAddExercise(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setDb((prev) => {
      const list = new Set(prev[newGroup] || []);
      list.add(name);
      return { ...prev, [newGroup]: [...list] };
    });

    // optional: store link somewhere later; for now we keep link in future schema
    setNewName("");
    setNewGroup(newGroup);
    setNewLink("");
    setShowAdd(false);
  }

  return (
    <div className="page">
      <h1 className="title">Exercises</h1>

      <div className="ex-toolbar">
        <input
          className="input search"
          placeholder="Search exercises…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn primary" onClick={() => setShowAdd(true)}>
          + Add Exercise
        </button>
      </div>

      {/* Groups list (not collapsible) */}
      <div className="groups">
        {GROUPS.map((g) => (
          <section key={g} className="group">
            <div className="group-head">
              <h2 className="group-title">{g}</h2>
            </div>

            <div className="chips">
              {(filtered[g] || []).length === 0 && (
                <div className="empty">No exercises</div>
              )}

              {(filtered[g] || []).map((name) => (
                <span key={name} className="chip chip-tag">
                  {name}
                  <button
                    className="chip-x"
                    aria-label={`Remove ${name}`}
                    onClick={() => removeExercise(g, name)}
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Add Exercise – full-width bottom sheet with a single card that contains all inputs */}
      <Sheet open={showAdd} onClose={() => setShowAdd(false)} titleId="add-ex-title">
        <h3 id="add-ex-title" className="sheet-title">Add Exercise</h3>

        <form onSubmit={handleAddExercise}>
          <div className="form-card">
            <div className="form-row">
              <label className="label" htmlFor="ex-name">Name</label>
              <input
                id="ex-name"
                className="input"
                placeholder="e.g., Incline Dumbbell Press"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label className="label" htmlFor="ex-group">Group</label>
              <select
                id="ex-group"
                className="select"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
              >
                {GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="label" htmlFor="ex-link">Link (YouTube, optional)</label>
              <input
                id="ex-link"
                className="input"
                placeholder="https://…"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                inputMode="url"
              />
            </div>
          </div>

          <div className="sheet-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary wide">Add</button>
          </div>
        </form>
      </Sheet>
    </div>
  );
}
