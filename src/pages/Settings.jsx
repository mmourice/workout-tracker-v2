import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";

/* storage keys used across the app */
const K_UNITS = "wt_units";
const K_LOGS = "wt_logs";
const K_PLANS = "wt_plans";
const K_EXS = "wt_exercises";

/* small bottom sheet for the reset confirm */
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

export default function Settings() {
  const [units, setUnits] = useState(() => {
    try {
      return localStorage.getItem(K_UNITS) || "kg";
    } catch {
      return "kg";
    }
  });

  const [showReset, setShowReset] = useState(false);

  // persist units when changed
  useEffect(() => {
    try { localStorage.setItem(K_UNITS, units); } catch {}
  }, [units]);

  // lock scroll when sheet open
  useEffect(() => {
    if (!showReset) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showReset]);

  function resetAll() {
    try {
      localStorage.removeItem(K_LOGS);
      localStorage.removeItem(K_PLANS);
      localStorage.removeItem(K_EXS);
      // keep units; or uncomment next line to reset units too:
      // localStorage.removeItem(K_UNITS);
    } catch {}
    setShowReset(false);
    alert("All local data cleared.");
    // optional: force a reload so pages see the cleared state
    // location.reload();
  }

  return (
    <Layout title="Settings" active="settings">
      <div className="stack">
        {/* Units */}
        <section className="card">
          <h2 className="section-title">Units</h2>
          <div className="chip-row">
            <button
              className={`chip ${units === "kg" ? "active" : ""}`}
              onClick={() => setUnits("kg")}
            >
              kg
            </button>
            <button
              className={`chip ${units === "lb" ? "active" : ""}`}
              onClick={() => setUnits("lb")}
            >
              lb
            </button>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            Your choice is saved on this device and will be used for placeholders and displays.
          </p>
        </section>

        {/* Data management */}
        <section className="card">
          <h2 className="section-title">Data</h2>
          <button className="btn ghost" onClick={() => setShowReset(true)}>
            Reset app (clear plans, exercises, history)
          </button>
          <p className="muted" style={{ marginTop: 8 }}>
            This only clears data stored locally in your browser. It won’t affect other devices.
          </p>
        </section>
      </div>

      {/* reset confirmation sheet */}
      <Sheet open={showReset} onClose={() => setShowReset(false)} labelledBy="reset-title">
        <h3 id="reset-title" className="sheet-title">Reset app?</h3>
        <div className="form-card">
          <p>
            This will permanently delete all <strong>Plans</strong>, <strong>Exercises</strong>, and
            <strong> History</strong> saved on this device. You can’t undo this.
          </p>
        </div>
        <div className="sheet-actions">
          <button className="btn ghost" onClick={() => setShowReset(false)}>
            Cancel
          </button>
          <button className="btn primary wide" onClick={resetAll}>
            Reset
          </button>
        </div>
      </Sheet>
    </Layout>
  );
}
