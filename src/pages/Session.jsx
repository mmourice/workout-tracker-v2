import React, { useEffect, useMemo, useState } from "react";
import RestTimer from "../components/RestTimer.jsx";
import { StopwatchIcon } from "../Icons.jsx";

/* ---------- storage keys ---------- */
const PLANS_KEY = "wt_plans";
const LOGS_KEY = "wt_logs";

/* ---------- helpers ---------- */
function loadPlans() {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveLogs(arr) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(arr));
  } catch {}
}
function loadLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* Build initial sets state per exercise id */
function seedSets(items) {
  const obj = {};
  for (const it of items) {
    const count = Math.max(1, Number(it.sets || 1));
    obj[it.id] = Array.from({ length: count }, () => ({ kg: "", reps: "" }));
  }
  return obj;
}

export default function Session() {
  /* rest timer */
  const [showTimer, setShowTimer] = useState(false);

  /* plans + selection */
  const initialPlans = loadPlans();
  const [plans, setPlans] = useState(initialPlans);
  const [activePlanId, setActivePlanId] = useState(
    initialPlans[0]?.id || null
  );

  const planOptions = useMemo(
    () => plans.map((p) => ({ id: p.id, name: p.name })),
    [plans]
  );
  const activePlan = useMemo(
    () => plans.find((p) => p.id === activePlanId) || null,
    [plans, activePlanId]
  );

  /* sets state keyed by exercise id */
  const [setsMap, setSetsMap] = useState(() =>
    activePlan ? seedSets(activePlan.items || []) : {}
  );

  /* reseed sets when plan or its items change */
  useEffect(() => {
    setSetsMap(activePlan ? seedSets(activePlan.items || []) : {});
  }, [activePlanId, plans]); // re-evaluate if plans change too

  /* ----- mutations ----- */
  function updateCell(exId, idx, field, value) {
    setSetsMap((m) => {
      const arr = m[exId] ? [...m[exId]] : [];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...m, [exId]: arr };
    });
  }
  function addSet(exId) {
    setSetsMap((m) => {
      const arr = m[exId] ? [...m[exId]] : [];
      arr.push({ kg: "", reps: "" });
      return { ...m, [exId]: arr };
    });
  }
  function removeSet(exId, idx) {
    setSetsMap((m) => {
      const arr = (m[exId] || []).filter((_, i) => i !== idx);
      return { ...m, [exId]: arr.length ? arr : [{ kg: "", reps: "" }] };
    });
  }
  function removeExercise(exId) {
    setSetsMap((m) => {
      const copy = { ...m };
      delete copy[exId];
      return copy;
    });
    // visual-only removal in the session; does not modify saved plan
  }

  /* ----- end session: save whole workout ----- */
  function endSession() {
    if (!activePlan) return;
    const payload = {
      id: crypto.randomUUID?.() || String(Date.now()),
      dateISO: new Date().toISOString(),
      planId: activePlan.id,
      planName: activePlan.name,
      exercises: (activePlan.items || []).map((it) => ({
        id: it.id,
        name: it.name,
        target: { sets: it.sets, reps: it.reps },
        sets: (setsMap[it.id] || []).map((s) => ({
          kg: s.kg || "0",
          reps: s.reps || "0",
        })),
      })),
    };
    const logs = loadLogs();
    logs.push(payload);
    saveLogs(logs);
    alert("Session saved ✔");
  }

  return (
    <div className="page">
      <h1 className="title">Session</h1>

      {/* plan chips row */}
      <div className="chip-row" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {planOptions.length === 0 && (
          <div className="empty">No plans yet. Add one in Plan page.</div>
        )}

        {planOptions.map((p) => (
          <button
            key={p.id}
            className={`plan-chip ${p.id === activePlanId ? "active" : ""}`}
            onClick={() => setActivePlanId(p.id)}
          >
            {p.name}
          </button>
        ))}

        <button
          className="timer-btn"
          aria-label="Open rest timer"
          onClick={() => setShowTimer(true)}
          style={{ marginLeft: "auto" }}
        >
          <StopwatchIcon />
        </button>
      </div>

      {/* exercise list for the selected plan */}
      {activePlan && (activePlan.items || []).length > 0 ? (
        <div className="stack">
          {(activePlan.items || []).map((ex) => (
            <div key={ex.id} className="exercise-card">
              <div className="exercise-header">
                <div className="exercise-title">
                  {ex.name}{" "}
                  <span className="exercise-scheme">
                    {ex.sets}×{ex.reps}
                  </span>
                </div>

                <div className="exercise-actions">
                  <button className="chip" onClick={() => addSet(ex.id)}>
                    + Add set
                  </button>
                  <button
                    className="icon-x"
                    aria-label="Remove exercise"
                    onClick={() => removeExercise(ex.id)}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="sets-col">
                {(setsMap[ex.id] || []).map((row, i) => (
                  <div key={i} className="inputs-row">
                    <label className="set-label">
                      Set {String(i + 1).padStart(2, "0")}
                    </label>

                    {/* reps */}
                    <input
                      className="input"
                      placeholder="reps"
                      value={row.reps ?? ""}
                      onChange={(e) =>
                        updateCell(ex.id, i, "reps", e.target.value)
                      }
                    />

                    <div className="spacer" />

                    {/* kg */}
                    <input
                      className="input"
                      placeholder="kg"
                      value={row.kg ?? ""}
                      onChange={(e) =>
                        updateCell(ex.id, i, "kg", e.target.value)
                      }
                    />

                    <button
                      className="icon-x sm"
                      aria-label={`Remove set ${i + 1}`}
                      onClick={() => removeSet(ex.id, i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">This plan has no exercises yet.</div>
      )}

      {/* End session */}
      {activePlan && (
        <div style={{ marginTop: 20 }}>
          <button className="btn primary wide" onClick={endSession}>
            End Session
          </button>
        </div>
      )}

      {/* timer sheet */}
      {showTimer && (
        <RestTimer open={showTimer} onClose={() => setShowTimer(false)} />
      )}
    </div>
  );
}
