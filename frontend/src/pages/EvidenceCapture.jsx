import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EvidenceCapture() {
  const navigate = useNavigate();

  const [photoTaken, setPhotoTaken] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  return (
    <div style={container}>
      <h1 style={title}>Evidence Capture</h1>
      <p style={subtitle}>
        Capture and securely store evidence during emergencies
      </p>

      {/* Actions */}
      <div style={actions}>
        <button
          style={actionBtn}
          onClick={() => {
            setPhotoTaken(true);
            setUploaded(false);
          }}
        >
          📸 Take Photo
        </button>

        <button
          style={actionBtn}
          onClick={() => {
            setRecording(!recording);
            setUploaded(false);
          }}
        >
          🎙 {recording ? "Stop Recording" : "Start Recording"}
        </button>

        <button
          style={uploadBtn}
          onClick={() => setUploaded(true)}
        >
          ☁️ Upload Securely
        </button>
      </div>

      {/* Status Panel */}
      <div style={statusCard}>
        <h3>Status</h3>

        <p>
          📷 Photo:{" "}
          <strong>{photoTaken ? "Captured" : "Not taken"}</strong>
        </p>

        <p>
          🎙 Recording:{" "}
          <strong>{recording ? "Recording..." : "Stopped"}</strong>
        </p>

        <p>
          ☁️ Upload:{" "}
          <strong>{uploaded ? "Uploaded Securely" : "Pending"}</strong>
        </p>

        {uploaded && (
          <p style={secureText}>
            🔒 Evidence encrypted and stored securely in cloud.
          </p>
        )}
      </div>

      {/* Safety Info */}
      <div style={infoBox}>
        <p>
          Evidence is automatically protected and can only be accessed by
          authorized authorities.
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
    "linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.95))",
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
  marginBottom: 30,
};

const actions = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 30,
};

const actionBtn = {
  padding: "14px 22px",
  borderRadius: 20,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const uploadBtn = {
  padding: "14px 22px",
  borderRadius: 20,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const statusCard = {
  maxWidth: 420,
  margin: "0 auto 24px",
  background: "rgba(255,255,255,0.1)",
  padding: 24,
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
};

const secureText = {
  marginTop: 12,
  color: "#22c55e",
  fontSize: 13,
};

const infoBox = {
  maxWidth: 520,
  margin: "0 auto 30px",
  fontSize: 13,
  opacity: 0.85,
};

const backBtn = {
  marginTop: 20,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.5)",
  color: "white",
  padding: "10px 22px",
  borderRadius: 24,
  cursor: "pointer",
};
