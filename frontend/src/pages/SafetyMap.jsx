import { useNavigate } from "react-router-dom";

export default function SafetyMap() {
  const navigate = useNavigate();

  const points = [
    { name: "Police Station", icon: "🚓", color: "#22c55e" },
    { name: "Hospital", icon: "🏥", color: "#3b82f6" },
    { name: "Crowded Area", icon: "👥", color: "#facc15" },
    { name: "Unsafe Zone", icon: "⚠️", color: "#ef4444" },
  ];

  return (
    <div style={container}>
      <h1 style={title}>Safe Route Navigation</h1>
      <p style={subtitle}>
        Visual guide showing safer areas and nearby help points
      </p>

      {/* Fake Map Area */}
      <div style={mapBox}>
        <p style={mapText}>🗺️ Interactive Map Preview</p>
        <p style={mapSubText}>
          (Live map integration coming soon)
        </p>
      </div>

      {/* Legend */}
      <div style={legend}>
        {points.map((p, i) => (
          <div key={i} style={legendItem}>
            <span
              style={{
                ...dot,
                background: p.color,
              }}
            ></span>
            <span>{p.icon} {p.name}</span>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div style={infoCard}>
        <h3 style={{ marginBottom: 8 }}>How this helps</h3>
        <p style={infoText}>
          ✔ Avoid dark streets and unsafe zones <br />
          ✔ Prefer crowded routes and police nearby <br />
          ✔ Faster emergency access
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
    "linear-gradient(135deg, rgba(14,165,233,0.95), rgba(34,197,94,0.95))",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "white",
  textAlign: "center",
};

const title = {
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 6,
};

const subtitle = {
  fontSize: 14,
  opacity: 0.9,
  marginBottom: 30,
};

const mapBox = {
  maxWidth: 800,
  height: 260,
  margin: "0 auto 30px",
  borderRadius: 24,
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const mapText = {
  fontSize: 20,
  fontWeight: 600,
};

const mapSubText = {
  fontSize: 12,
  opacity: 0.85,
};

const legend = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 18,
  marginBottom: 30,
};

const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
};

const dot = {
  width: 12,
  height: 12,
  borderRadius: "50%",
};

const infoCard = {
  maxWidth: 500,
  margin: "0 auto 30px",
  background: "rgba(0,0,0,0.25)",
  padding: 20,
  borderRadius: 20,
  fontSize: 13,
};

const infoText = {
  opacity: 0.9,
  lineHeight: 1.5,
};

const backBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.6)",
  color: "white",
  padding: "10px 22px",
  borderRadius: 24,
  cursor: "pointer",
};
