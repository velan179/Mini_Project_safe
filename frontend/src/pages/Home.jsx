import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";

export default function Home() {
  const navigate = useNavigate();
  const { location, locationError, locationLoading, requestLocation } =
    useLocation();

  // ✅ Request GPS location automatically when the user lands on Home after login
  useEffect(() => {
    requestLocation();
  }, []);

  const cards = [
    {
      title: "Emergency SOS",
      desc: "Get immediate help and alert your trusted contacts.",
      icon: "🆘",
      path: "/sos",
      danger: true,
    },
    {
      title: "Evidence Capture",
      desc: "Capture photos and recordings securely during emergencies.",
      icon: "📸",
      path: "/evidence",
    },
    {
      title: "Live Safety Map",
      desc: "View safe and risky areas around you in real time.",
      icon: "🗺️",
      path: "/map",
    },
    {
      title: "Safety Alerts",
      desc: "Receive important alerts about nearby risks.",
      icon: "🔔",
      path: "/alerts",
    },
    {
      title: "Emergency Contacts",
      desc: "Quick access to police, ambulance, and help lines.",
      icon: "📞",
      path: "/contacts",
    },
    {
      title: "AI Safety Assistant",
      desc: "Ask questions and get safety guidance instantly.",
      icon: "🤖",
      path: "/assistant",
    },
    {
      title: "Offline Mode",
      desc: "Access emergency features even without internet connection.",
      icon: "📴",
      path: "/offline",
    },
    {
      title: "Community Reports",
      desc: "View and share safety experiences with others.",
      icon: "🗣️",
      path: "/community",
    },
    {
      title: "Trusted Contacts",
      desc: "Family & friends alerted during emergencies.",
      icon: "👥",
      path: "/guardians",
    },
  ];

  /* ---- Location banner ---- */
  const renderLocationBanner = () => {
    if (locationLoading) {
      return (
        <div style={locationBanner("rgba(255,255,255,0.15)")}>
          <span style={locationIconStyle}>📡</span>
          <div style={{ flex: 1 }}>
            <p style={locationTitle}>Fetching your location…</p>
            <p style={locationSub}>
              Please allow location access when the browser prompts you.
            </p>
          </div>
          <div style={spinner}></div>
        </div>
      );
    }

    if (location) {
      return (
        <div style={locationBanner("rgba(34,197,94,0.25)")}>
          <span style={locationIconStyle}>📍</span>
          <div style={{ flex: 1 }}>
            <p style={locationTitle}>
              Location Active{" "}
              <span style={badge}>✅ GPS</span>
            </p>
            <p style={locationSub}>
              Lat:&nbsp;<strong>{location.lat.toFixed(6)}</strong>
              &nbsp;&nbsp;Lng:&nbsp;<strong>{location.lng.toFixed(6)}</strong>
            </p>
            <p style={{ ...locationSub, marginTop: 4, opacity: 0.7 }}>
              Real-time safety services are active for your current position.
            </p>
          </div>
          <button
            style={retryBtn}
            onClick={requestLocation}
            title="Refresh location"
          >
            🔄
          </button>
        </div>
      );
    }

    if (locationError) {
      return (
        <div style={locationBanner("rgba(239,68,68,0.28)")}>
          <span style={locationIconStyle}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ ...locationTitle, color: "#fecaca" }}>
              Location Access Denied
            </p>
            <p style={locationSub}>{locationError}</p>
          </div>
          <button style={retryBtn} onClick={requestLocation}>
            🔄 Retry
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <h1 style={title}>Welcome to TourSafe</h1>
        <p style={subtitle}>Your safety companion for confident travel</p>
        <p style={statusStyle}>
          🟢 You're protected. Emergency services are available in your area.
        </p>
      </div>

      {/* Location Banner */}
      {renderLocationBanner()}

      {/* Cards */}
      <div style={grid}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              ...cardStyle,
              background: card.danger
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "rgba(255,255,255,0.18)",
            }}
            onClick={() => navigate(card.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = card.danger
                ? "0 25px 60px rgba(239,68,68,0.7)"
                : "0 25px 60px rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(0,0,0,0.25)";
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
          >
            <div style={iconStyle}>{card.icon}</div>
            <h3 style={cardTitle}>{card.title}</h3>
            <p style={cardDesc}>{card.desc}</p>
            {card.danger && (
              <p style={{ fontSize: 11, marginTop: 10, opacity: 0.9 }}>
                ⚠️ Use only in real emergencies
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const container = {
  minHeight: "100vh",
  padding: "40px 30px",
  background:
    "linear-gradient(135deg, rgba(14,165,233,0.9), rgba(34,197,94,0.9))",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "white",
};

const header = {
  textAlign: "center",
  marginBottom: 28,
};

const title = {
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 8,
};

const subtitle = {
  fontSize: 15,
  opacity: 0.9,
};

const statusStyle = {
  marginTop: 12,
  fontSize: 13,
  opacity: 0.9,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 24,
  maxWidth: 1000,
  margin: "0 auto",
};

const cardStyle = {
  padding: "28px 24px",
  borderRadius: 22,
  cursor: "pointer",
  transition: "all 0.25s ease",
  backdropFilter: "blur(12px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const iconStyle = {
  fontSize: 36,
  marginBottom: 12,
};

const cardTitle = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 6,
};

const cardDesc = {
  fontSize: 14,
  opacity: 0.9,
};

/* ---- Location banner styles ---- */
const locationBanner = (bg) => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
  background: bg,
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 18,
  padding: "18px 24px",
  maxWidth: 700,
  margin: "0 auto 32px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
});

const locationIconStyle = {
  fontSize: 32,
  flexShrink: 0,
};

const locationTitle = {
  fontSize: 15,
  fontWeight: 600,
  margin: 0,
};

const locationSub = {
  fontSize: 13,
  opacity: 0.85,
  margin: "4px 0 0",
};

const badge = {
  display: "inline-block",
  background: "rgba(34,197,94,0.4)",
  border: "1px solid rgba(34,197,94,0.6)",
  borderRadius: 30,
  fontSize: 11,
  padding: "2px 10px",
  marginLeft: 8,
  verticalAlign: "middle",
};

const retryBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "1px solid rgba(255,255,255,0.4)",
  color: "white",
  borderRadius: 30,
  padding: "6px 14px",
  cursor: "pointer",
  fontSize: 13,
  flexShrink: 0,
};

const spinner = {
  width: 22,
  height: 22,
  border: "3px solid rgba(255,255,255,0.3)",
  borderTop: "3px solid white",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  flexShrink: 0,
};
