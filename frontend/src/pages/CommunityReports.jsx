import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CommunityReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("All");

  // ✅ Fetch reports from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/reports").then((res) => {
      setReports(res.data);
    });
  }, []);

  // ✅ Add new report
  const addReport = () => {
    if (!message.trim()) return;

    axios
      .post("http://localhost:5000/api/reports", {
        author: "You",
        text: message,
        type: "Unsafe Area",
        time: "Just now",
        likes: 0,
        liked: false,
      })
      .then((res) => {
        setReports((prev) => [res.data, ...prev]);
        setMessage("");
      });
  };

  // ✅ Like handler (prevent multiple likes)
  const handleLike = (index) => {
    const updated = [...reports];

    if (updated[index].liked) return;

    updated[index].likes += 1;
    updated[index].liked = true;

    setReports(updated);
  };

  return (
    <div style={container}>
      <h1 style={title}>Community Safety Reports</h1>
      <p style={subtitle}>
        Real experiences shared by travelers & locals
      </p>

      <p style={helperText}>
        Reports help others avoid unsafe places, scams, and risky situations.
      </p>

      {/* Filters */}
      <div style={filters}>
        {["All", "Unsafe Area", "Crowd Alert", "Scam Warning"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...filterBtn,
              background:
                filter === f
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,0.15)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Add Report */}
      <div style={form}>
        <textarea
          placeholder="Share your experience, warning, or safety tip..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={textarea}
        />

        <button
          onClick={addReport}
          style={{
            ...postBtn,
            opacity: message ? 1 : 0.6,
            cursor: message ? "pointer" : "not-allowed",
          }}
        >
          Post Report
        </button>
      </div>

      {/* Reports List */}
      <div style={list}>
        {reports
          .filter((r) => filter === "All" || r.type === filter)
          .map((r, i) => (
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
              <span style={tag}>{r.type}</span>

              <p style={text}>{r.text}</p>

              <div style={footer}>
                <span style={author}>{r.author}</span>

                <button
                  style={{
                    ...likeBtn,
                    opacity: r.liked ? 0.6 : 1,
                    cursor: r.liked ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleLike(i)}
                >
                  👍 {r.likes}
                </button>

                <span style={time}>⏱ {r.time}</span>
              </div>

              <p style={microText}>
                👍 Shared to keep travelers safe
              </p>
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
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "white",
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
};

const helperText = {
  textAlign: "center",
  fontSize: 12,
  opacity: 0.8,
  marginBottom: 26,
};

const filters = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const filterBtn = {
  fontSize: 12,
  padding: "6px 14px",
  borderRadius: 20,
  border: "none",
  color: "white",
  cursor: "pointer",
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
};

const postBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: 20,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 600,
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
};

const microText = {
  fontSize: 11,
  opacity: 0.75,
  marginTop: 10,
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
