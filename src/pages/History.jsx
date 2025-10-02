import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";

/* LocalStorage helpers */
const KEY = "wt_logs";
function loadLogs() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function saveLogs(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {}
}

/* Render helpers for mixed schemas */
function isNewSession(entry) {
  // New schema has exercises array and planName
  return Array.isArray(entry?.exercises);
}

function formatDateLabel(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString();
}

export default function History() {
  const [logs, setLogs] = useState(() => loadLogs());
  useEffect(() => { saveLogs(logs); }, [logs]);

  // Group by YYYY-MM-DD (from entry.dateISO)
  const grouped = useMemo(() => {
    const byDate = {};
    for (const e of logs) {
      const d = (e.dateISO || "").slice(0, 10);
      if (!d) continue;
      byDate[d] = byDate[d] || [];
      byDate[d].push(e);
    }
    return Object.entries(byDate)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, items]) => ({ date, items: items.sort((a,b) => (a.dateISO < b.dateISO ? 1 : -1)) }));
  }, [logs]);

  const removeOne = (id) => setLogs(prev => prev.filter(e => e.id !== id));
  const clearAll = () => {
    if (confirm("Delete all saved sessions?")) setLogs([]);
  };

  return (
    <Layout title="History" active="history">
      <div className="history-toolbar">
        <button className="btn ghost" onClick={clearAll} disabled={!logs.length}>
          Clear all
        </button>
      </div>

      {!logs.length && (
        <div className="empty big">No saved sessions yet.</div>
      )}

      <div className="history-list">
        {grouped.map(({ date, items }) => (
          <section key={date} className="h-group">
            <h2 className="h-date">{formatDateLabel(date)}</h2>

            {items.map((e) => {
              if (isNewSession(e)) {
                // New schema: a full session with plan + many exercises
                return (
                  <article key={e.id} className="h-card">
                    <div className="h-head">
                      <div className="h-title">
                        {e.planName || "Session"}
                      </div>
                      <button
                        className="icon-x"
                        aria-label="Delete session"
                        onClick={() => removeOne(e.id)}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>

                    {/* exercises list */}
                    <div className="h-exercises">
                      {e.exercises?.length ? (
                        e.exercises.map((ex) => (
                          <div key={ex.id} className="h-ex">
                            <div className="h-ex-name">
                              {ex.name}
                              <span className="chip-mono">&nbsp;{ex?.target?.sets}×{ex?.target?.reps}</span>
                            </div>
                            {/* sets */}
                            {ex.sets?.length ? (
                              <div className="h-sets">
                                {ex.sets.map((s, i) => (
                                  <div key={i} className="h-set">
                                    <span className="h-set-label">Set {i + 1}</span>
                                    <span className="h-dot" />
                                    <span className="h-set-val">{s.kg} kg</span>
                                    <span className="h-dot" />
                                    <span className="h-set-val">{s.reps} reps</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="muted">No sets captured</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="muted">No exercises captured</div>
                      )}
                    </div>

                    {e.dateISO && (
                      <div className="h-time muted">
                        Saved at{" "}
                        {new Date(e.dateISO).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </article>
                );
              }

              // Old schema: single exercise entry
              return (
                <article key={e.id} className="h-card">
                  <div className="h-head">
                    <div className="h-title">
                      {e.exerciseName || "Exercise"}
                    </div>
                    <button
                      className="icon-x"
                      aria-label="Delete entry"
                      onClick={() => removeOne(e.id)}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>

                  <div className="h-sets">
                    {e.sets?.length ? (
                      e.sets.map((s, i) => (
                        <div key={i} className="h-set">
                          <span className="h-set-label">Set {i + 1}</span>
                          <span className="h-dot" />
                          <span className="h-set-val">{s.kg} kg</span>
                          <span className="h-dot" />
                          <span className="h-set-val">{s.reps} reps</span>
                        </div>
                      ))
                    ) : (
                      <div className="muted">No sets captured</div>
                    )}
                  </div>

                  {e.dateISO && (
                    <div className="h-time muted">
                      Saved at{" "}
                      {new Date(e.dateISO).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </Layout>
  );
}
