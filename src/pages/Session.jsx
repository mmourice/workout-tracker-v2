// src/pages/Session.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PlusIcon, TrashIcon } from "../Icons.jsx";

// --- tiny helpers -----------------------------------------------------------
const fmt = (s) => String(s).trim();
const clampNum = (v) => (Number.isFinite(+v) ? String(v) : "");

// mock plan per day (replace with store later)
const DEFAULT_PLAN = {
  "Upper A": [
    { id: "inc-chest", name: "Incline Chest Press", link: "https://www.youtube.com/results?search_query=incline+chest+press", sets: 4, reps: 10 },
    { id: "row-cable", name: "Seated Cable Row", link: "https://www.youtube.com/results?search_query=seated+cable+row", sets: 4, reps: 10 },
  ],
  "Upper B": [
    { id: "lat-raise", name: "Lateral Raises", link: "https://www.youtube.com/results?search_query=lateral+raise", sets: 3, reps: 12 },
  ],
  Lower: [
    { id: "squat", name: "Back Squat", link: "https://www.youtube.com/results?search_query=back+squat", sets: 5, reps: 5 },
  ],
  "Full Body": [],
};

// build session state from plan
function buildSessionFromPlan(plan) {
  // each set = { weight:'', reps:'' }
  return plan.map((ex) => ({
    id: ex.id,
    name: ex.name,
    link: ex.link || "",
    rest: 90, // seconds
    running: false,
    sets: Array.from({ length: ex.sets }, () => ({
      weight: "",
      reps: "",
      targetReps: ex.reps ?? 10,
    })),
  }));
}

// --- RestTimer hook (start/pause) -------------------------------------------
function useRestTimer(initial = 90) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);
  const tick = useRef(null);

  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => {
        setSeconds((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const set = (v) => setSeconds(v);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { seconds, display: `${mm}:${ss}`, running, start, pause, set };
}

// --- UI bits ----------------------------------------------------------------
const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 16px",
      borderRadius: 999,
      border: active ? "0" : "1px solid rgba(255,255,255,0.25)",
      background: active ? "#F16202" : "transparent",
      color: active ? "#171717" : "#fff",
      fontWeight: 600,
      boxShadow: active ? "0 0 24px rgba(241,98,2,0.25)" : "none",
    }}
  >
    {children}
  </button>
);

const IconBtn = ({ onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 38,
      width: 38,
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.04)",
    }}
  >
    {children}
  </button>
);

const Field = ({ placeholder, value, onChange, inputMode = "decimal" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode={inputMode}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
        }}
        placeholder={focused ? "" : placeholder}
      />
    </div>
  );
};

// --- Exercise Card -----------------------------------------------------------
function ExerciseCard({ exercise, onChange, onAddSet, onRemoveSet }) {
  const t = useRestTimer(90);

  useEffect(() => {
    // keep timer seconds in parent state if needed later
  }, [t.seconds]); // eslint-disable-line

  const twoCol = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  };

  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.14)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 18,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <a
          href={exercise.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 800,
            textDecoration: "underline",
            textUnderlineOffset: 4,
            flex: 1,
          }}
        >
          {exercise.name}
        </a>

        {/* timer pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.05)",
            minWidth: 90,
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          {t.display}
          {t.running ? (
            <button
              onClick={t.pause}
              style={{
                marginLeft: 6,
                border: "none",
                background: "transparent",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              ▮▮
            </button>
          ) : (
            <button
              onClick={t.start}
              style={{
                marginLeft: 6,
                border: "none",
                background: "transparent",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              ▶
            </button>
          )}
        </div>

        <IconBtn onClick={onAddSet} title="Add set">
          <PlusIcon />
        </IconBtn>
      </header>

      {/* sets grid, two per row */}
      <div style={twoCol}>
        {exercise.sets.map((s, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: 12,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <button
                onClick={() => onRemoveSet(idx)}
                title="Remove set"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ color: "#F16202", fontWeight: 800, marginBottom: 12 }}>
              Set {idx + 1}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field
                placeholder="kg"
                value={s.weight}
                onChange={(v) =>
                  onChange(idx, { ...s, weight: clampNum(v.replace(/[^\d.]/g, "")) })
                }
              />
              <Field
                placeholder="reps"
                value={s.reps}
                onChange={(v) =>
                  onChange(idx, { ...s, reps: clampNum(v.replace(/[^\d]/g, "")) })
                }
                inputMode="numeric"
              />
            </div>
            {!!s.targetReps && !fmt(s.reps) && (
              <div style={{ marginTop: 8, opacity: 0.6, fontSize: 12 }}>
                target: {s.targetReps}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Page --------------------------------------------------------------------
export default function Session() {
  const days = ["Upper A", "Upper B", "Lower", "Full Body"];
  const [day, setDay] = useState(days[0]);

  // local session state (so this page works standalone)
  const [session, setSession] = useState(() =>
    buildSessionFromPlan(DEFAULT_PLAN[days[0]] || [])
  );

  useEffect(() => {
    setSession(buildSessionFromPlan(DEFAULT_PLAN[day] || []));
  }, [day]);

  const onChangeSet = (exIndex, setIndex, next) => {
    setSession((prev) => {
      const copy = structuredClone(prev);
      copy[exIndex].sets[setIndex] = next;
      return copy;
    });
  };

  const addSet = (exIndex) => {
    setSession((prev) => {
      const copy = structuredClone(prev);
      copy[exIndex].sets.push({ weight: "", reps: "", targetReps: 10 });
      return copy;
    });
  };

  const removeSet = (exIndex, setIndex) => {
    setSession((prev) => {
      const copy = structuredClone(prev);
      copy[exIndex].sets.splice(setIndex, 1);
      return copy;
    });
  };

  return (
    <div className="page" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 14 }}>Pick day</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        {days.map((d) => (
          <Chip key={d} active={d === day} onClick={() => setDay(d)}>
            {d}
          </Chip>
        ))}
      </div>

      {/* exercise cards */}
      <div style={{ marginTop: 10 }}>
        {session.length === 0 && (
          <div style={{ opacity: 0.7 }}>No exercises for this day yet.</div>
        )}

        {session.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onChange={(setIdx, next) => onChangeSet(i, setIdx, next)}
            onAddSet={() => addSet(i)}
            onRemoveSet={(setIdx) => removeSet(i, setIdx)}
          />
        ))}
      </div>
    </div>
  );
}
