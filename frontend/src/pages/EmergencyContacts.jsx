import { useNavigate } from "react-router-dom";

export default function EmergencyContacts() {
  const navigate = useNavigate();

  const contacts = [
    {
      name: "Police",
      number: "100",
      desc: "For immediate police assistance",
      color: "#2563eb",
      icon: "🚓",
    },
    {
      name: "Ambulance",
      number: "108",
      desc: "Medical emergencies & accidents",
      color: "#dc2626",
      icon: "🚑",
    },
    {
      name: "Women Helpline",
      number: "181",
      desc: "Support for women in distress",
      color: "#9333ea",
      icon: "🧕",
    },
    {
      name: "Fire Service",
      number: "101",
      desc: "Fire & rescue services",
      color: "#ea580c",
      icon: "🔥",
    },
    {
      name: "Tourist Helpline",
      number: "1363",
      desc: "Tourism support & guidance",
      color: "#059669",
      icon: "🧭",
    },
  ];

  return (
    <div style={container}>
      <h1 style={title}>Emergency Contacts</h1>
      <p style={subtitle}>
        Quick access to help services near you
      </p>
      <p style={{ textAlign: "center", fontSize: 12, opacity: 0.85, marginBottom: 30 }}>
  These services can be contacted instantly during emergencies or SOS activation.
</p>

      <div style={grid}>
        {contacts.map((c, i) => (
          <div
  key={i}
  style={{ ...card, borderLeft: `6px solid ${c.color}` }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.35)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.25)";
  }}
>

            <div style={icon}>{c.icon}</div>

            <div style={{ flex: 1 }}>
              <h3 style={cardTitle}>{c.name}</h3>
              <p style={desc}>{c.desc}</p>
              <p style={number}>📞 {c.number}</p>
            </div>

            <button
              style={{ ...callBtn, background: c.color }}
              onClick={() =>
                alert(`Calling ${c.name} (${c.number})`)
              }
            >
              Call
            </button>
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
    "linear-gradient(135deg, rgba(14,165,233,0.95), rgba(34,197,94,0.95))",
  color: "white",
  fontFamily: "Segoe UI, system-ui, sans-serif",
};

const title = {
  textAlign: "center",
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 6,
};

const subtitle = {
  textAlign: "center",
  opacity: 0.9,
  marginBottom: 30,
};

const grid = {
  maxWidth: 900,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
};

const card = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(12px)",
  borderRadius: 20,
  padding: 20,
  display: "flex",
  alignItems: "center",
  gap: 16,
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  transition: "all 0.25s ease",

};

const icon = {
  fontSize: 36,
};

const cardTitle = {
  fontSize: 18,
  marginBottom: 4,
};

const desc = {
  fontSize: 13,
  opacity: 0.9,
};

const number = {
  fontSize: 14,
  marginTop: 6,
};

const callBtn = {
  border: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: 20,
  cursor: "pointer",
  fontWeight: 600,
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
