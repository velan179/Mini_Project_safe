import { useNavigate } from "react-router-dom";

const bg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div style={wrapper}>
      {/* Animated Background Layer */}
      <div style={bgLayer}></div>

      {/* Gradient Overlay */}
      <div style={overlay}></div>

      {/* Content */}
      <div style={card} className="fade-slide">
        <h1 style={title}>TourSafe</h1>

        <p style={headline}>Travel freely. We’ll watch your back.</p>

        <p style={tagline}>
          Your personal safety companion for confident and secure journeys
        </p>

        <button
          style={button}
          onMouseEnter={(e) =>
            (e.target.style.transform = "translateY(-3px) scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.target.style.transform = "translateY(0) scale(1)")
          }
          onClick={() => navigate("/login")}
        >
          Get Started →
        </button>

        <p style={trust}>
          🔒 Privacy-first • Emergency-ready • Trusted by travelers
        </p>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const wrapper = {
  position: "relative",
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Segoe UI, system-ui, sans-serif",
};

const bgLayer = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  animation: "bgMove 12s ease-in-out infinite",
  willChange: "transform",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(120deg, rgba(14,165,233,0.75), rgba(34,197,94,0.75))",
};

const card = {
  position: "relative",
  zIndex: 2,
  maxWidth: 520,
  textAlign: "center",
  color: "white",
  padding: "55px 60px",
  borderRadius: 24,
  backdropFilter: "blur(10px)",
  background: "rgba(0,0,0,0.35)",
  boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
};

const title = {
  fontSize: 54,
  fontWeight: 700,
  marginBottom: 10,
  letterSpacing: 1,
};

const headline = {
  fontSize: 20,
  fontWeight: 500,
  marginBottom: 12,
  opacity: 0.95,
};

const tagline = {
  fontSize: 16,
  lineHeight: 1.6,
  marginBottom: 35,
  opacity: 0.9,
};

const button = {
  padding: "14px 48px",
  fontSize: 18,
  fontWeight: 600,
  borderRadius: 32,
  border: "none",
  cursor: "pointer",
  background: "white",
  color: "#0f172a",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
};

const trust = {
  marginTop: 25,
  fontSize: 13,
  opacity: 0.85,
};
