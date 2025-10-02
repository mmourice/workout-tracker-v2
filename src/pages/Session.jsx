import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
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
function loadLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
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

/* Build initial sets map from a plan's items */
function seedSets(items) {
  const obj = {};
  for (const it of items || []) {
    const count = Math.max(1, Number(it.sets || 1));
    obj[it.id] = Array.from({ length: count }, () => ({ kg: "", reps: "" }));
  }
  return obj;
}

export default function Session() {
  /* Rest timer */
  const [showTimer, setShowTimer] = useState(false);

  /* Plans + selection */
  const [plans, setPlans] = useState(() => loadPlans());
  const planOptions = useMemo(
    () => plans.map((p) => ({ id: p.id, name: p.name })),
    [plans]
  );
  const [activePlanId, setActivePlanId] = useState(planOptions[0]?.id || null);

  /* Keep activePlanId valid if plans list changes */
  useEffect(() => {
    if (!plans.length) {
      setActivePlanId(null);
      return;
    }
    if (!activePlanId || !plans.some((p) => p.id === activePlanId)) {
      setActivePlanId(plans[0].id);
    }
  }, [plans]); // eslint-disable-line

  const activePlan = useMemo(
    () => plans.find((p) => p.id === activePlanId) || null,
    [plans, activePlanId]
  );

  /* Sets state per exercise */
  const [setsMap, setSetsMap] = useState(() =>
    activePlan ? seedSets(activePlan.items) : {}
  );

  /* Reseed sets when the selected plan changes */
  useEffect(() => {
    setSetsMap(activePlan ? seedSets(activePlan.items) : {});
  }, [activePlanId]); // eslint-disable-line

  /* ----- set mutations ----- */
  function updateCell(exId, idx, field, value) {
    setSetsMap((m) => {
      const row = m[exId] ? [...m[exId]] : [];
      row[idx] = { ...row[idx], [field]: value };
      return { ...m, [exId]: row };
    });
  }
  function addSet(exId) {
    setSetsMap((m) => {
      const row = m[exId] ? [...m[exId]] : [];
      row.push({ kg: "", reps: "" });
      return { ...m, [exId]: row };
    });
  }
  function removeSet(exId, idx) {
    setSetsMap((m) => {
      const row = (m[exId] || []).filter((_, i) => i !== idx);
      return { ...m, [exId]: row.length ? row : [{ kg: "", reps: "" }] };
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
    <Layout
      title="Session"
      active="session"
      headerRight={
        <button
          className="icon-btn"
          aria-label="Rest timer"
          onClick={() => setShowTimer(true)}
        >
          <StopwatchIcon />
        </button>
      }
    >
      {/* plan chips row (no page <h1> anymore, header handles title) */}
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
      </div>

      {/* exercise list for the selected plan */}
      {activePlan && (activePlan.items || []).length > 0 ? (
        <div className="stack">
          {(activePlan.items || []).map((it) => (
            <div key={it.id} className="exercise-card">
              <div className="exercise-header">
                <div className="exercise-title">
                  {it.name}{" "}
                  <span className="exercise-scheme">
                    {it.sets}×{it.reps}
                  </span>
                </div>
                <div className="exercise-actions">
                  <button className="chip" onClick={() => addSet(it.id)}>
                    + Add set
                  </button>
                  <button
                    className="icon-x"
                    aria-label="Remove exercise"
                    onClick={() => removeExercise(it.id)}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="sets-col">
                {(setsMap[it.id] || []).map((row, i) => (
                  <div key={i} className="inputs-row">
                    <div className="set-label">
                      Set {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="row-inputs">
                      <input
                        className="input"
                        placeholder="reps"
                        value={row.reps || ""}
                        onChange={(e) =>
                          updateCell(it.id, i, "reps", e.target.value)
                        }
                      />
                      <input
                        className="input"
                        placeholder="kg"
                        value={row.kg || ""}
                        onChange={(e) =>
                          updateCell(it.id, i, "kg", e.target.value)
                        }
                      />
                    </div>

                    <button
                      className="icon-x sm"
                      aria-label={`Remove set ${i + 1}`}
                      onClick={() => removeSet(it.id, i)}
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

      {activePlan && (
        <div style={{ marginTop: 20 }}>
          <button className="btn primary wide" onClick={endSession}>
            End Session
          </button>
        </div>
      )}

      {showTimer && (
        <RestTimer open={showTimer} onClose={() => setShowTimer(false)} />
      )}
    </Layout>
  );
}
