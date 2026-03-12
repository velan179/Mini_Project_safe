import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OfflineMode() {
  const navigate = useNavigate();
  const [offline, setOffline] = useState(true);

  return (
    <div style={container}>
      <h1 style={title}>Offline Safety Mode</h1>
      <p style={subtitle}>
        Essential safety features remain available without internet
      </p>

      {/* Toggle */}
      <button
        style={{
          ...toggleBtn,
          background: offline ? "#ef4444" : "#22c55e",
        }}
        onClick={() => setOffline(!offline)}
      >
        {offline ? "📴 Offline Mode Active" : "🌐 Online Mode"}
      </button>

      {/* Cards */}
      <div style={grid}>
        <div style={card}>
          <h3>📞 Emergency Numbers</h3>
          <p>Police, Ambulance, Women Helpline stored locally.</p>
          <span style={tag}>Available Offline</span>
        </div>

        <div style={card}>
          <h3>🗺️ Cached Maps</h3>
          <p>Previously downloaded safe areas remain accessible.</p>
          <span style={tag}>Available Offline</span>
        </div>

        <div style={card}>
          <h3>📘 Safety Instructions</h3>
          <p>Emergency guidance stored for quick reference.</p>
          <span style={tag}>Available Offline</span>
        </div>

        <div style={{ ...card, opacity: offline ? 0.5 : 1 }}>
          <h3>🔔 Live Alerts</h3>
          <p>Requires internet connection.</p>
          <span style={offlineTag}>Online Only</span>
        </div>
      </div>

      {/* Info */}
      <div style={infoBox}>
        <p>
          When internet reconnects, all cached data syncs automatically for the
          latest safety updates.
        </p>
      </div>

      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

/* ---------- STYLES ---------- */

const container = {
  minHeight: "100vh",
  padding: "40px 20px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "white",
  textAlign: "center",
};

const title = {
  fontSize: 32,
  fontWeight: 700,
};

const subtitle = {
  fontSize: 14,
  opacity: 0.85,
  marginBottom: 20,
};

const toggleBtn = {
  border: "none",
  padding: "12px 22px",
  borderRadius: 30,
  fontWeight: 600,
  color: "white",
  cursor: "pointer",
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  maxWidth: 900,
  margin: "0 auto",
};

const card = {
  background: "rgba(255,255,255,0.12)",
  padding: 24,
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
};

const tag = {
  display: "inline-block",
  marginTop: 10,
  padding: "4px 12px",
  borderRadius: 12,
  background: "#22c55e",
  fontSize: 11,
};

const offlineTag = {
  display: "inline-block",
  marginTop: 10,
  padding: "4px 12px",
  borderRadius: 12,
  background: "#ef4444",
  fontSize: 11,
};

const infoBox = {
  maxWidth: 600,
  margin: "30px auto",
  fontSize: 13,
  opacity: 0.8,
};

const backBtn = {
  marginTop: 20,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.4)",
  color: "white",
  padding: "10px 22px",
  borderRadius: 24,
  cursor: "pointer",
};
