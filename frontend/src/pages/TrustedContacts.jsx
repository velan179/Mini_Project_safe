import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getHeaders } from "../services/apiConfig.js";

export default function TrustedContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Family");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CONTACTS_LIST, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      } else {
        setError("Failed to fetch contacts");
      }
    } catch (err) {
      setError("Error fetching contacts: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new contact
  const addContact = async () => {
    if (!name || !phone) {
      setError("Name and phone are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CONTACTS_CREATE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, phone, email, relationship }),
      });
      const data = await response.json();
      if (data.success) {
        setContacts((prev) => [...prev, data.data]);
        setName("");
        setPhone("");
        setEmail("");
        setSuccessMsg("Contact added successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.message || "Failed to add contact");
      }
    } catch (err) {
      setError("Error adding contact: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Set primary guardian
  const setPrimary = async (contactId) => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.CONTACTS_SET_PRIMARY(contactId),
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchContacts();
        setSuccessMsg("Primary contact set successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.message || "Failed to set primary contact");
      }
    } catch (err) {
      setError("Error setting primary contact: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete contact
  const deleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CONTACTS_DELETE(contactId), {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setContacts((prev) => prev.filter((c) => c._id !== contactId));
        setSuccessMsg("Contact deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.message || "Failed to delete contact");
      }
    } catch (err) {
      setError("Error deleting contact: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      {/* Error Message */}
      {error && (
        <div
          style={{
            ...messageBox,
            background: "rgba(239, 68, 68, 0.9)",
          }}
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div
          style={{
            ...messageBox,
            background: "rgba(34, 197, 94, 0.9)",
          }}
        >
          {successMsg}
        </div>
      )}

      {/* Contact List */}
      <div style={list}>
        {loading && contacts.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            Loading contacts...
          </p>
        ) : contacts.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            No trusted contacts yet. Add one to get started!
          </p>
        ) : (
          contacts.map((c) => (
            <div
              key={c._id}
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
                  {c.name} {c.isPrimary && "⭐"}
                </h3>
                <p style={phoneText}>{c.phone}</p>
                {c.email && <p style={emailText}>{c.email}</p>}
                <p style={relationshipText}>{c.relationship}</p>
              </div>

              <div style={actions}>
                {!c.isPrimary && (
                  <button
                    style={primaryBtn}
                    onClick={() => setPrimary(c._id)}
                    disabled={loading}
                  >
                    Make Primary
                  </button>
                )}

                <button
                  style={deleteBtn}
                  onClick={() => deleteContact(c._id)}
                  disabled={loading}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Contact Section */}
      <div style={form}>
        <h3 style={formTitle}>Add New Contact</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          disabled={loading}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
          disabled={loading}
        />

        <input
          placeholder="Email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          disabled={loading}
          type="email"
        />

        <select
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          style={input}
          disabled={loading}
        >
          <option>Family</option>
          <option>Friend</option>
          <option>Colleague</option>
          <option>Emergency Contact</option>
          <option>Other</option>
        </select>

        <button
          style={{
            ...addBtn,
            opacity: name && phone && !loading ? 1 : 0.6,
            cursor: name && phone && !loading ? "pointer" : "not-allowed",
          }}
          onClick={addContact}
          disabled={loading}
        >
          {loading ? "Adding..." : "+ Add Contact"}
        </button>
      </div>

      <button style={backBtn} onClick={() => navigate("/home")} disabled={loading}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

const messageBox = {
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "20px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "500",
};

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
