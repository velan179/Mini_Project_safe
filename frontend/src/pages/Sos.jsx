import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";

export default function Sos() {
  const [panic, setPanic] = useState(false);
  const { location, enableLocationAccess } = useLocation();

  useEffect(() => {
    if (panic && !location) {
      enableLocationAccess();
    }
  }, [panic, location, enableLocationAccess]);

  return (
    <div style={container(panic)}>
      {!panic ? (
  <div style={content}>
    <h1 style={title}>Emergency SOS</h1>

    <p style={subtitle}>
      Use this button only if you are in immediate danger.
    </p>

    <button
  style={sosButton}
  onClick={() => setPanic(true)}
  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <span style={sosIcon}>SOS</span>
</button>
<p style={{ fontSize: 13, opacity: 0.85, marginTop: 14 }}>
  Press and hold for 3 seconds to activate
</p>


    <p style={hint}>
      Pressing SOS will alert emergency services and your trusted contacts.
    </p>
    <button
  onClick={() => window.history.back()}
  style={{
    marginTop: 30,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.6)",
    color: "white",
    padding: "8px 18px",
    borderRadius: 20,
    fontSize: 13,
    cursor: "pointer",
  }}
>
  Cancel
</button>

  </div>
) : (
  <div style={content}>
    <h1 style={panicTitle}>Stay Calm</h1>

    <p style={panicText}>
      Help is being contacted. You are not alone.
    </p>

    <div style={breathingBox}>
      <p style={breathingText}>Breathe slowly</p>
      <p style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>
  Inhale… Hold… Exhale…
</p>

      <div style={circle}></div>
    </div>

    <p style={steps}>
      • Stay in a safe place <br />
      • Keep your phone with you <br />
      • Follow on-screen instructions
    </p>
    <p style={{ fontSize: 12, opacity: 0.75, marginTop: 24 }}>
  {location
    ? `📍 Location shared: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
    : "⚠️ Location unavailable — enable GPS for full emergency support."}
</p>

  </div>
)}

    </div>
  );
}

/* ---------- STYLES ---------- */

const container = (panic) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "30px",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  background: panic
    ? "linear-gradient(135deg, #0f172a, #020617)"
    : "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  transition: "background 0.5s ease",
});

const title = {
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 10,
};

const subtitle = {
  fontSize: 15,
  opacity: 0.9,
  marginBottom: 40,
};

const sosButton = {
  width: 180,
  height: 180,
  borderRadius: "50%",
  border: "none",
  background: "white",
  cursor: "pointer",
  boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  transition: "transform 0.2s ease",

  display: "flex",          // ✅ IMPORTANT
  alignItems: "center",      // ✅ IMPORTANT
  justifyContent: "center",  // ✅ IMPORTANT
  animation: "pulse 2s infinite",

};


const hint = {
  marginTop: 30,
  fontSize: 13,
  opacity: 0.85,
  maxWidth: 320,
};

const panicTitle = {
  fontSize: 34,
  fontWeight: 700,
  marginBottom: 12,
};

const panicText = {
  fontSize: 16,
  opacity: 0.9,
  marginBottom: 30,
};

const breathingBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 30,
};

const breathingText = {
  fontSize: 14,
  marginBottom: 12,
};

const circle = {
  width: 140,
  height: 140,
  borderRadius: "50%",
  border: "3px solid rgba(255,255,255,0.7)",
  animation: "breathe 4s ease-in-out infinite",
  boxShadow: "0 0 40px rgba(255,255,255,0.15)",
};



const steps = {
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.9,
};
const content = {
  width: "100%",
  maxWidth: 360,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const sosIcon = {
  background: "linear-gradient(135deg, #fb7185, #ec4899)",
  color: "white",
  fontSize: 32,
  fontWeight: 700,
  padding: "14px 18px",
  borderRadius: 10,
  letterSpacing: 1,
};
