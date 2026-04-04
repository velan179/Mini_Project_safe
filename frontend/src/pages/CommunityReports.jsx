import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getHeaders } from "../services/apiConfig.js";

export default function CommunityReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("safety-concern");
  const [severity, setSeverity] = useState("medium");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const reportTypes = [
    "safety-concern",
    "incident",
    "scam-alert",
    "missing-person",
    "other",
  ];
  const severityLevels = ["low", "medium", "high"];

  // ✅ Fetch reports from backend
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.REPORTS_LIST, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.data || []);
      } else {
        setError(data.message || "Failed to fetch reports");
      }
    } catch (err) {
      setError("Error fetching reports: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new report
  const addReport = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.REPORTS_CREATE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title,
          description,
          reportType,
          severity,
          isAnonymous,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setReports((prev) => [data.data, ...prev]);
        setTitle("");
        setDescription("");
        setReportType("safety-concern");
        setSeverity("medium");
        setError("");
        setSuccessMsg("Report posted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.message || "Failed to post report");
      }
    } catch (err) {
      setError("Error posting report: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Like handler
  const handleLike = async (reportId) => {
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_LIKE(reportId), {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) =>
            r._id === reportId ? { ...r, likes: (r.likes || 0) + 1 } : r
          )
        );
      }
    } catch (err) {
      console.error("Error liking report:", err);
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_DELETE(reportId), {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r._id !== reportId));
        setSuccessMsg("Report deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setError("Error deleting report: " + err.message);
    }
  };

  return (
    <div style={container}>
      <h1 style={pageTitle}>Community Safety Reports</h1>
      <p style={subtitle}>
        Real experiences shared by travelers & locals
      </p>

      <p style={helperText}>
        Reports help others avoid unsafe places, scams, and risky situations.
      </p>

      {error && <div style={messageBox}>{error}</div>}
      {successMsg && <div style={{ ...messageBox, background: "rgba(34,197,94,0.9)" }}>{successMsg}</div>}

      {/* Add Report Form */}
      <form onSubmit={addReport} style={form}>
        <h3 style={formTitle}>Share Your Experience</h3>

        <input
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
          disabled={loading}
        />

        <textarea
          placeholder="Describe your experience or safety concern in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={textarea}
          disabled={loading}
        />

        <div style={rowStyle}>
          <div style={formGroup}>
            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={input}
              disabled={loading}
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroup}>
            <label>Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={input}
              disabled={loading}
            >
              {severityLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={checkboxGroup}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            id="anonymous"
            disabled={loading}
          />
          <label htmlFor="anonymous">Post anonymously</label>
        </div>

        <button
          type="submit"
          style={{
            ...postBtn,
            opacity: title && description && !loading ? 1 : 0.6,
            cursor: title && description && !loading ? "pointer" : "not-allowed",
          }}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Report"}
        </button>
      </form>

      {/* Reports List */}
      <div style={list}>
        {loading && reports.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            Loading reports...
          </p>
        ) : reports.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.8 }}>
            No reports yet. Be the first to share your experience!
          </p>
        ) : (
          reports.map((r) => {
            const reportDate = new Date(r.reportedAt || r.createdAt);
            const formattedTime = reportDate.toLocaleDateString() + " " + reportDate.toLocaleTimeString();

            return (
              <div
                key={r._id}
                style={{
                  ...card,
                  borderLeft:
                    r.severity === "high"
                      ? "4px solid #ef4444"
                      : r.severity === "medium"
                      ? "4px solid #facc15"
                      : "4px solid #22c55e",
                }}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <span style={tag}>{r.reportType?.replace(/-/g, " ").toUpperCase()}</span>
                    <h3 style={cardTitle}>{r.title}</h3>
                    <p style={text}>{r.description}</p>
                  </div>
                  <div style={{ textAlign: "right", marginLeft: "10px" }}>
                    {!r.isAnonymous && r.userId ? (
                      <p style={author}>{r.userId.firstName} {r.userId.lastName}</p>
                    ) : (
                      <p style={author}>Anonymous</p>
                    )}
                  </div>
                </div>

                <div style={footer}>
                  <span style={time}>⏱ {formattedTime}</span>

                  <button
                    style={likeBtn}
                    onClick={() => handleLike(r._id)}
                  >
                    👍 {r.likes || 0}
                  </button>

                  {!r.isAnonymous && (
                    <button
                      style={deleteBtn}
                      onClick={() => deleteReport(r._id)}
                    >
                      🗑 Delete
                    </button>
                  )}
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

const messageBox = {
  maxWidth: "720px",
  margin: "0 auto 20px",
  padding: "12px",
  borderRadius: "8px",
  background: "rgba(239, 68, 68, 0.9)",
  textAlign: "center",
  fontSize: "14px",
};

const formGroup = {
  flex: 1,
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginBottom: "15px",
};

const checkboxGroup = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
  opacity: 0.9,
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "2px solid rgba(255,255,255,0.3)",
  background: "rgba(0,0,0,0.3)",
  color: "white",
  fontSize: "14px",
  marginBottom: "12px",
  boxSizing: "border-box",
};

const formTitle = {
  marginBottom: "15px",
  fontSize: "18px",
  fontWeight: "600",
};

const cardTitle = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "8px 0",
};

const deleteBtn = {
  border: "none",
  background: "rgba(239,68,68,0.6)",
  color: "white",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  cursor: "pointer",
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

const pageTitle = {
  textAlign: "center",
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 6,
};

const subtitle = {
  textAlign: "center",
  opacity: 0.9,
};

const helperText = {
  textAlign: "center",
  fontSize: 12,
  opacity: 0.8,
  marginBottom: 26,
};

const form = {
  maxWidth: 720,
  margin: "0 auto 30px",
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(12px)",
  padding: 24,
  borderRadius: 20,
};

const textarea = {
  width: "100%",
  minHeight: 90,
  resize: "none",
  borderRadius: 14,
  border: "none",
  outline: "none",
  padding: "14px 16px",
  fontSize: 14,
  background: "#1f2937",
  color: "white",
  marginBottom: 14,
  boxSizing: "border-box",
};

const postBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: 20,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
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
  borderRadius: 18,
  padding: "18px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  transition: "all 0.25s ease",
};

const tag = {
  fontSize: 11,
  padding: "4px 10px",
  borderRadius: 12,
  background: "rgba(0,0,0,0.35)",
  display: "inline-block",
  marginBottom: 10,
};

const text = {
  fontSize: 14,
  marginBottom: 12,
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 11,
  opacity: 0.85,
  gap: "10px",
};

const author = {
  fontWeight: 600,
};

const time = {};

const likeBtn = {
  border: "none",
  background: "rgba(255,255,255,0.25)",
  color: "white",
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  cursor: "pointer",
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
