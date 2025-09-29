import React, { useEffect, useMemo, useState } from "react";

// LocalStorage helpers
const KEY = "wt_logs";
function loadLogs() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function saveLogs(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {}
}

export default function History() {
  const [logs, setLogs] = useState(() => loadLogs());

  useEffect(() => { saveLogs(logs); }, [logs]);

  const grouped = useMemo(() => {
    // Group by YYYY-MM-DD
    const byDate = {};
    for (const e of logs) {
      const d = (e.dateISO || "").slice(0, 10);
      byDate[d] = byDate[d] || [];
      byDate[d].push(e);
    }
    // Sort newest first
    return Object.entries(byDate)
      .sort((a,b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, items]) => ({ date, items }));
  }, [logs]);

  const removeOne = (id) => setLogs(prev => prev.filter(e => e.id !== id));
  const clearAll = () => {
    if (confirm("Delete all saved sessions?")) setLogs([]);
  };

  return (
    <div className="page">
      <h1 className="title">History</h1>

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
            <h2 className="h-date">
              {new Date(date + "T00:00:00").toLocaleDateString()}
            </h2>

            {items.map((e) => (
              <article key={e.id} className="h-card">
                <div className="h-head">
                  <div className="h-title">
                    {e.exerciseName || "Exercise"}
                  </div>
                  <button
                    className="icon-x"
                    aria-label="Delete entry"
                    onClick={() => removeOne(e.id)}
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
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
