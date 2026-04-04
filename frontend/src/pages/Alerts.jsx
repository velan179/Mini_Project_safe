import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getHeaders } from "../services/apiConfig.js";

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ALERTS_LIST, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data || []);
      } else {
        setError(data.message || "Failed to fetch alerts");
      }
    } catch (err) {
      setError("Error fetching alerts: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1 style={title}>Safety Alerts</h1>
      <p style={subtitle}>
        Real-time warnings from authorities and community
      </p>

      {error && <div style={messageBox}>{error}</div>}

      <div style={list}>
        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            Loading alerts...
          </p>
        ) : alerts.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            No active alerts at the moment
          </p>
        ) : (
          alerts.map((alert) => {
            const alertDate = new Date(alert.timestamp || alert.createdAt);
            const formattedTime = alertDate.toLocaleDateString() + " " + alertDate.toLocaleTimeString();

            return (
              <div
                key={alert._id}
                style={{
                  ...card,
                  borderLeft:
                    alert.severity === "critical"
                      ? "6px solid #dc2626"
                      : alert.severity === "high"
                      ? "6px solid #ef4444"
                      : alert.severity === "medium"
                      ? "6px solid #facc15"
                      : "6px solid #10b981",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={cardTitle}>{alert.title}</h3>
                    <p style={description}>{alert.description}</p>
                    {alert.location?.city && (
                      <p style={location}>
                        📍 {alert.location.city}
                        {alert.location.address && ` - ${alert.location.address}`}
                      </p>
                    )}
                    <p style={time}>⏰ {formattedTime}</p>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        ...badge,
                        background:
                          alert.severity === "critical"
                            ? "#dc2626"
                            : alert.severity === "high"
                            ? "#ef4444"
                            : alert.severity === "medium"
                            ? "#facc15"
                            : "#10b981",
                      }}
                    >
                      {alert.severity?.toUpperCase() || "N/A"}
                    </span>
                    <span
                      style={{
                        ...badge,
                        background: alert.status === "active" ? "#10b981" : "#6b7280",
                        marginTop: "8px",
                      }}
                    >
                      {alert.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

const badge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  color: "white",
};

const messageBox = {
  padding: "12px",
  background: "rgba(239, 68, 68, 0.9)",
  borderRadius: "8px",
  maxWidth: "800px",
  margin: "0 auto 20px",
  textAlign: "center",
};

const description = {
  margin: "8px 0",
  opacity: 0.95,
  fontSize: "14px",
};

const cardTitle = {
  margin: "0 0 8px 0",
  fontSize: "18px",
  fontWeight: "600",
};

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
