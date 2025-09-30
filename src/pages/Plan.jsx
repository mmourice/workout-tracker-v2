import React, { useEffect, useMemo, useState } from "react";

/* ------------ Storage helpers ------------ */
const PLANS_KEY = "wt_plans";
const EXS_KEY = "wt_exercises";

function loadPlans() {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return []; // no seed
}

function savePlans(plans) {
  try {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch {}
}

function loadExercisesDB() {
  try {
    const raw = localStorage.getItem(EXS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {}; // fallback
}

/* ------------ Tiny primitives (reuse our sheet/modal styles) ------------ */
function Sheet({ open, onClose, children, labelledBy }) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------ Main Page ------------ */
export default function Plan() {
  const [plans, setPlans] = useState(() => loadPlans());
  const [exDB, setExDB] = useState(() => loadExercisesDB());

  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPlanId, setPickerPlanId] = useState(null);
  const [pickerQuery, setPickerQuery] = useState("");

  const [qtyOpen, setQtyOpen] = useState(false);
  const [qtyFor, setQtyFor] = useState({ planId: null, name: "", sets: 3, reps: 10 });

  // Persist plans
  useEffect(() => savePlans(plans), [plans]);
  // Lock scroll when any sheet is open
  const anySheet = showAddPlan || pickerOpen || qtyOpen;
  useEffect(() => {
    if (!anySheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [anySheet]);

  /* ---------- CRUD: plans ---------- */
  function createPlan(e) {
    e.preventDefault();
    const name = newPlanName.trim();
    if (!name) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    setPlans((ps) => [...ps, { id, name, items: [] }]);
    setNewPlanName("");
    setShowAddPlan(false);
    openExercisePicker(id); // jump straight to adding exercises
  }

  function removePlan(id) {
    setPlans((ps) => ps.filter((p) => p.id !== id));
  }

  function openExercisePicker(planId) {
    setPickerPlanId(planId);
    setPickerQuery("");
    // refresh ex DB in case user edited Exercises page
    setExDB(loadExercisesDB());
    setPickerOpen(true);
  }

  /* ---------- Add exercise to plan (through picker + qty dialog) ---------- */
  // Exercise list flattened with search
  const pickerList = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    const rows = [];
    Object.keys(exDB).forEach((group) => {
      const list = (exDB[group] || []).filter((n) => n.toLowerCase().includes(q));
      if (list.length) rows.push({ group, list });
    });
    return rows;
  }, [exDB, pickerQuery]);

  function chooseExercise(name) {
    setPickerOpen(false);
    setQtyFor((q) => ({ ...q, planId: pickerPlanId, name, sets: 3, reps: 10 }));
    setQtyOpen(true);
  }

  function addExerciseToPlan(e) {
    e.preventDefault();
    const { planId, name, sets, reps } = qtyFor;
    setPlans((ps) =>
      ps.map((p) =>
        p.id !== planId
          ? p
          : {
              ...p,
              items: [...p.items, { id: crypto.randomUUID?.() || name + Date.now(), name, sets, reps }],
            }
      )
    );
    setQtyOpen(false);
  }

  function removeItem(planId, itemId) {
    setPlans((ps) =>
      ps.map((p) =>
        p.id !== planId ? p : { ...p, items: p.items.filter((it) => it.id !== itemId) }
      )
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="title">Plan</h1>
        <button className="btn primary" onClick={() => setShowAddPlan(true)}>+ Add plan</button>
      </div>

      {/* Plans grid */}
      <div className="plan-grid">
        {plans.length === 0 && (
          <div className="empty big">No plans yet. Tap “Add plan” to get started.</div>
        )}

        {plans.map((p) => (
          <div key={p.id} className="plan-card">
            <div className="plan-head">
              <div className="plan-title">{p.name}</div>
              <div className="plan-actions">
                <button className="link small" onClick={() => openExercisePicker(p.id)}>
                  Add exercise
                </button>
                <button className="icon-x" aria-label="Delete plan" onClick={() => removePlan(p.id)}>
                  ×
                </button>
              </div>
            </div>

            {p.items.length === 0 ? (
              <div className="empty">Empty</div>
            ) : (
              <div className="plan-items">
                {p.items.map((it) => (
                  <span key={it.id} className="chip chip-tag">
                    {it.name} <span className="chip-mono">&nbsp;{it.sets}×{it.reps}</span>
                    <button
                      className="chip-x"
                      aria-label={`Remove ${it.name}`}
                      onClick={() => removeItem(p.id, it.id)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sheet: Add Plan */}
      <Sheet open={showAddPlan} onClose={() => setShowAddPlan(false)} labelledBy="add-plan-title">
        <h3 id="add-plan-title" className="sheet-title">Add Plan</h3>
        <form onSubmit={createPlan}>
          <div className="form-card">
            <div className="form-row">
              <label className="label" htmlFor="plan-name">Plan name</label>
              <input
                id="plan-name"
                className="input"
                placeholder="e.g., Upper A"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>
          <div className="sheet-actions">
            <button type="button" className="btn ghost" onClick={() => setShowAddPlan(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary wide">Create</button>
          </div>
        </form>
      </Sheet>

      {/* Sheet: Exercise Picker */}
      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} labelledBy="picker-title">
        <h3 id="picker-title" className="sheet-title">Exercises</h3>

        <div className="form-row">
          <input
            className="input"
            placeholder="Search…"
            value={pickerQuery}
            onChange={(e) => setPickerQuery(e.target.value)}
          />
        </div>

        <div className="picker-groups">
          {pickerList.length === 0 && <div className="empty">No matches</div>}
          {pickerList.map(({ group, list }) => (
            <section key={group} className="group">
              <div className="group-head">
                <h4 className="group-title">{group}</h4>
              </div>
              <div className="chips">
                {list.map((name) => (
                  <button key={name} className="chip chip-btn" onClick={() => chooseExercise(name)}>
                    {name}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Sheet>

      {/* Sheet: Sets / Reps */}
      <Sheet open={qtyOpen} onClose={() => setQtyOpen(false)} labelledBy="qty-title">
        <h3 id="qty-title" className="sheet-title">{qtyFor.name}</h3>
        <form onSubmit={addExerciseToPlan}>
         <div className="form-card row-two">
  <div className="field">
    <label className="label" htmlFor="sets">Sets</label>
    <input
      id="sets"
      className="input"
      inputMode="numeric"
      pattern="[0-9]*"
      value={qtyFor.sets}
      onChange={(e) =>
        setQtyFor((q) => ({ ...q, sets: Math.max(1, parseInt(e.target.value || "0", 10) || 1) }))
      }
    />
  </div>

  <div className="field">
    <label className="label" htmlFor="reps">Reps</label>
    <input
      id="reps"
      className="input"
      inputMode="numeric"
      pattern="[0-9]*"
      value={qtyFor.reps}
      onChange={(e) =>
        setQtyFor((q) => ({ ...q, reps: Math.max(1, parseInt(e.target.value || "0", 10) || 1) }))
      }
    />
  </div>
</div>
          <div className="sheet-actions">
            <button type="button" className="btn ghost" onClick={() => setQtyOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn primary wide">Add</button>
          </div>
        </form>
      </Sheet>
    </div>
  );
}
