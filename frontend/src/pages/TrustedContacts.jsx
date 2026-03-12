import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function TrustedContacts() {
  useEffect(() => {
  axios.get("http://localhost:5000/api/contacts").then((res) => {
    setContacts(res.data);
  });
}, []);

  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ Add new contact
  const addContact = () => {
  if (!name || !phone) return;

  axios
    .post("http://localhost:5000/api/contacts", {
      name,
      phone,
    })
    .then((res) => {
      setContacts((prev) => [...prev, res.data]);
      setName("");
      setPhone("");
    });
};


  // ✅ Set primary guardian
  const setPrimary = (index) => {
    const updated = contacts.map((c, i) => ({
      ...c,
      primary: i === index,
    }));
    setContacts(updated);
  };

  // ✅ Delete contact
  const deleteContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  return (
    <div style={container}>
      <h1 style={title}>Trusted Contacts</h1>
      <p style={subtitle}>
        People who will be alerted during emergencies
      </p>

      <p style={helper}>
        These contacts receive your live location and alerts during SOS.
      </p>

      {/* Contact List */}
      <div style={list}>
        {contacts.map((c, i) => (
          <div
            key={i}
            style={card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 25px 60px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(0,0,0,0.25)";
            }}
          >
            <div>
              <h3 style={cardTitle}>
                {c.name} {c.primary && "⭐"}
              </h3>
              <p style={phoneText}>{c.phone}</p>
            </div>

            <div style={actions}>
              {!c.primary && (
                <button
                  style={primaryBtn}
                  onClick={() => setPrimary(i)}
                >
                  Make Primary
                </button>
              )}

              <button
                style={deleteBtn}
                onClick={() => deleteContact(i)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact */}
      <div style={form}>
        <h3 style={formTitle}>Add New Contact</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        <button
          style={{
            ...addBtn,
            opacity: name && phone ? 1 : 0.6,
            cursor: name && phone ? "pointer" : "not-allowed",
          }}
          onClick={addContact}
        >
          + Add Contact
        </button>
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
};

const title = {
  textAlign: "center",
  fontSize: 32,
  fontWeight: 700,
};

const subtitle = {
  textAlign: "center",
  opacity: 0.9,
};

const helper = {
  textAlign: "center",
  fontSize: 12,
  opacity: 0.8,
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
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(12px)",
  borderRadius: 20,
  padding: "20px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.25s ease",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const cardTitle = {
  fontSize: 18,
  marginBottom: 6,
};

const phoneText = {
  fontSize: 14,
  opacity: 0.9,
};

const actions = {
  display: "flex",
  gap: 10,
};

const primaryBtn = {
  border: "none",
  padding: "6px 12px",
  borderRadius: 14,
  fontSize: 12,
  background: "#22c55e",
  color: "white",
  cursor: "pointer",
};

const deleteBtn = {
  border: "none",
  padding: "6px 10px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.25)",
  color: "white",
  cursor: "pointer",
};

const form = {
  maxWidth: 720,
  margin: "40px auto 0",
  background: "rgba(0,0,0,0.25)",
  padding: "28px",
  borderRadius: 20,
};

const formTitle = {
  marginBottom: 16,
  fontSize: 18,
};

const input = {
  width: "100%",
  padding: "14px 1px",
  borderRadius: 14,
  border: "none",
  outline: "none",
  marginBottom: 14,
  fontSize: 14,
  background: "#1f2937",
  color: "white",
};

const addBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: 20,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 600,
};

const backBtn = {
  display: "block",
  margin: "30px auto 0",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.6)",
  color: "white",
  padding: "10px 22px",
  borderRadius: 24,
  cursor: "pointer",
};
