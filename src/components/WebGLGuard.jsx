import React, { useMemo } from "react";
import { detectEngine } from "../utils/engineDetector.js";

export function WebGLGuard({ children }) {
  const engine = useMemo(() => detectEngine(), []);

  if (!engine.supported) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#060c18",
          color: "#e2e8f0",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(20, 184, 166, 0.35)",
            borderRadius: 16,
            padding: "2.5rem 2rem",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚀</div>
          <h2
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#14b8a6",
              margin: "0 0 0.75rem",
            }}
          >
            WebGL Not Available
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#94a3b8",
              margin: "0 0 1.5rem",
            }}
          >
            This interactive 3D visualization requires WebGL, which your browser
            does not support or has disabled.
          </p>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              lineHeight: 1.7,
              textAlign: "left",
            }}
          >
            <p style={{ margin: "0 0 0.5rem", fontWeight: 600, color: "#94a3b8" }}>
              Try one of these:
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              <li>Update your browser to the latest version</li>
              <li>Enable hardware acceleration in browser settings</li>
              <li>Try Chrome, Firefox, or Edge</li>
              <li>Check that your GPU drivers are up to date</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
