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

/* A simple per-exercise working state shape:
   { [exerciseId]: [{kg:'', reps:''}, ... ] } */
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
  const [plans, setPlans] = useState(() => loadPlans());
  const planOptions = useMemo(
    () => plans.map((p) => ({ id: p.id, name: p.name })),
    [plans]
  );
  const [activePlanId, setActivePlanId] = useState(planOptions[0]?.id || null);

  /* selected plan + exercise set state */
  const activePlan = useMemo(
    () => plans.find((p) => p.id === activePlanId) || null,
    [plans, activePlanId]
  );

  const [setsMap, setSetsMap] = useState(() =>
    activePlan ? seedSets(activePlan.items || []) : {}
  );

  /* when plan changes, reseed sets */
  useEffect(() => {
    setSetsMap(activePlan ? seedSets(activePlan.items || []) : {});
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
    // remove from plan view only (doesn't modify saved plan)
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

        {/* stopwatch at row end */}
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
          {(activePlan.items || []).map((it) => (
            <div key={it.id} className="card">
              <div className="card-head">
                <div className="card-title">
                  <div style={{ fontWeight: 700 }}>{it.name}</div>
                  <div className="chip-mono" style={{ opacity: 0.8 }}>
                    {it.sets}×{it.reps}
                  </div>
                </div>
                <div className="plan-actions">
                  <button
                    className="chip-ghost small"
                    onClick={() => addSet(it.id)}
                  >
                    + Add set
                  </button>
                  <button
                    className="chip-ghost small danger"
                    onClick={() => removeExercise(it.id)}
                    aria-label="Remove exercise"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="sets-col">
                {(setsMap[it.id] || []).map((row, i) => (
                  <div key={i} className="inputs-row">
                    <div className="label-s">Set {String(i + 1).padStart(2, "0")}</div>

                    <input
                      className="input"
                      placeholder="kg"
                      inputMode="decimal"
                      value={row.kg}
                      onChange={(e) =>
                        updateCell(it.id, i, "kg", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="reps"
                      inputMode="numeric"
                      value={row.reps}
                      onChange={(e) =>
                        updateCell(it.id, i, "reps", e.target.value)
                      }
                    />

                    <button
                      className="icon-x"
                      onClick={() => removeSet(it.id, i)}
                      aria-label={`Remove set ${i + 1}`}
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
