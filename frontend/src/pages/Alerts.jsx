import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/alerts").then((res) => {
      setAlerts(res.data);
    });
  }, []);

  return (
    <div style={container}>
      <h1 style={title}>Safety Alerts</h1>
      <p style={subtitle}>
        Real-time warnings from authorities and community
      </p>

      <div style={list}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              ...card,
              borderLeft:
                alert.severity === "high"
                  ? "6px solid #ef4444"
                  : "6px solid #facc15",
            }}
          >
            <h3>{alert.title}</h3>
            <p style={location}>📍 {alert.location}</p>
            <p style={time}>⏰ {alert.time}</p>
          </div>
        ))}
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
    "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(251,191,36,0.9))",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "white",
};

const title = {
  textAlign: "center",
  fontSize: 32,
  fontWeight: 700,
};

const subtitle = {
  textAlign: "center",
  opacity: 0.9,
  marginBottom: 30,
};

const list = {
  maxWidth: 720,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const card = {
  background: "rgba(255,255,255,0.15)",
  padding: 20,
  borderRadius: 18,
  backdropFilter: "blur(12px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const location = {
  fontSize: 13,
  opacity: 0.9,
};

const time = {
  fontSize: 12,
  opacity: 0.8,
};

const backBtn = {
  display: "block",
  margin: "40px auto 0",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.6)",
  color: "white",
  padding: "10px 22px",
  borderRadius: 24,
  cursor: "pointer",
};
