// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./modern.css"; // <- keep this name; see step 1

function ErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);
  if (error) {
    return (
      <div style={{ color: "#ff6600", padding: 16, fontFamily: "system-ui" }}>
        <h2>Something went wrong</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(error.stack || error)}</pre>
      </div>
    );
  }
  return (
    <React.Suspense fallback={null}>
      <BoundarySetter onError={setError}>{children}</BoundarySetter>
    </React.Suspense>
  );
}

function BoundarySetter({ onError, children }) {
  React.useEffect(() => {
    const handler = (e) => onError(e.error || e.reason || e);
    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, [onError]);
  return children;
}

const rootEl = document.getElementById("root");
createRoot(rootEl).render(
  <React.StrictMode>
    <HashRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HashRouter>
  </React.StrictMode>
);
