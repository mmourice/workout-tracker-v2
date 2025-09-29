import React, { useEffect, useMemo, useState } from "react";

/** === Data & Storage helpers === */
const GROUPS = ["Chest","Back","Shoulders","Legs","Arms","Core","Cardio","Other"];

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
  const seeded = DEFAULTS;
  try { localStorage.setItem("wt_exercises", JSON.stringify(seeded)); } catch {}
  return seeded;
}

function saveExercises(obj) {
  try { localStorage.setItem("wt_exercises", JSON.stringify(obj)); } catch {}
}

/** === Small Modal (inline to keep file simple) === */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** === Exercises Page === */
export default function Exercises() {
  const [db, setDb] = useState(() => loadExercises());
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", group: "Chest", link: "" });

  // persist on change
  useEffect(() => { saveExercises(db); }, [db]);

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
    setDb(prev => ({ ...prev, [group]: prev[group].filter(n => n !== name) }));
  }

  function addExercise(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    setDb(prev => {
      const list = new Set(prev[form.group] || []);
      list.add(name);
      return { ...prev, [form.group]: [...list] };
    });
    setForm({ name: "", group: form.group, link: "" });
    setAdding(false);
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
        <button className="btn primary" onClick={() => setAdding(true)}>
          + Add Exercise
        </button>
      </div>

      {/* Groups list (not collapsible, per your spec) */}
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
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Add Exercise Modal */}
   <div className="modal">
  <div className="sheet-card">
    <h3 className="sheet-title">Add Exercise</h3>
    <form onSubmit={handleAddExercise}>
      <div className="form-card">
        <div className="form-row">
          <label className="label">Name</label>
          <input
            className="input"
            placeholder="e.g., Incline Dumbbell Press"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="label">Group</label>
          <select
            className="select"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          >
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Legs">Legs</option>
            <option value="Arms">Arms</option>
            <option value="Core">Core</option>
            <option value="Cardio">Cardio</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-row">
          <label className="label">Link (YouTube, optional)</label>
          <input
            className="input"
            placeholder="https://…"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
        </div>
      </div>

      <div className="sheet-actions">
        <button type="button" className="btn ghost" onClick={() => setShowAdd(false)}>Cancel</button>
        <button type="submit" className="btn primary wide">Add</button>
      </div>
    </form>
  </div>
</div>
  );
}
