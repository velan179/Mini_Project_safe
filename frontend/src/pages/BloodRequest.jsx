import { useState } from "react";
import { API_ENDPOINTS, getHeaders } from "../services/apiConfig.js";

function BloodRequest() {
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    unitsNeeded: 1,
    urgency: "medium",
    reason: "",
    location: {},
    phone: "",
    neededBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const urgencyLevels = ["low", "medium", "high", "critical"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "unitsNeeded" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.patientName ||
      !form.bloodGroup ||
      !form.hospital ||
      !form.phone ||
      !form.unitsNeeded
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.REQUESTS_CREATE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Blood request created successfully!");
        setForm({
          patientName: "",
          bloodGroup: "",
          hospital: "",
          unitsNeeded: 1,
          urgency: "medium",
          reason: "",
          location: {},
          phone: "",
          neededBy: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message || "Failed to create blood request");
      }
    } catch (err) {
      setError("Error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Request Blood</h2>
      <p style={styles.subtitle}>
        Submit an urgent blood request during emergencies
      </p>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Patient Name *</label>
          <input
            name="patientName"
            placeholder="Full name of patient"
            value={form.patientName}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>Blood Group *</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              <option value="">Select</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Units Needed *</label>
            <input
              name="unitsNeeded"
              type="number"
              min="1"
              max="20"
              value={form.unitsNeeded}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label>Hospital Name *</label>
          <input
            name="hospital"
            placeholder="Hospital name"
            value={form.hospital}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>Contact Phone *</label>
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Urgency Level</label>
            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label>Needed By (Date & Time)</label>
          <input
            name="neededBy"
            type="datetime-local"
            value={form.neededBy}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Reason/Medical Condition</label>
          <textarea
            name="reason"
            placeholder="Describe the medical situation..."
            value={form.reason}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: "100px" }}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Blood Request"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Segoe UI, system-ui, sans-serif",
    color: "#fff",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    opacity: "0.9",
    marginBottom: "30px",
  },
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "12px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  error: {
    maxWidth: "600px",
    margin: "0 auto 20px",
    padding: "12px",
    background: "rgba(239, 68, 68, 0.9)",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "14px",
  },
  success: {
    maxWidth: "600px",
    margin: "0 auto 20px",
    padding: "12px",
    background: "rgba(34, 197, 94, 0.9)",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default BloodRequest;