import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enableLocationAccess } = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "tourist@123" && password === "1234") {
      login();
      await enableLocationAccess();
      navigate("/home");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleEmailFocus = (e) => {
    setEmail("tourist@123");
    setError("");
    e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.6)";
  };

  const handlePasswordFocus = (e) => {
    setPassword("1234");
    setError("");
    e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.6)";
  };

  return (
    <div style={container}>
      <div style={overlay}></div>

      <div style={card} className="fade-slide">
        <h2 style={title}>Welcome Back</h2>
        <p style={subtitle}>Login to continue your safe journey</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            onFocus={handleEmailFocus}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            onFocus={handlePasswordFocus}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />

          {error && <p style={errorText}>{error}</p>}

          <button
            type="submit"
            style={button}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
          >
            Login
          </button>
        </form>

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.3)",
            margin: "24px 0 16px",
          }}
        ></div>

        <p style={hint}>
          Demo login {"->"} <strong>tourist@123 / 1234</strong>
        </p>
      </div>
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  fontFamily: "Segoe UI, system-ui, sans-serif",
  background:
    "linear-gradient(135deg, rgba(14,165,233,0.9), rgba(34,197,94,0.9))",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
};

const card = {
  position: "relative",
  zIndex: 1,
  width: 400,
  padding: "48px 44px",
  borderRadius: 24,
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(14px)",
  boxShadow:
    "0 40px 80px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.15)",
  color: "white",
  textAlign: "center",
};

const title = {
  fontSize: 28,
  fontWeight: 600,
  marginBottom: 8,
};

const subtitle = {
  fontSize: 14,
  opacity: 0.9,
  marginBottom: 30,
};

const input = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: 18,
  borderRadius: 14,
  border: "none",
  outline: "none",
  fontSize: 15,
  boxSizing: "border-box",
  background: "#eef4ff",
  color: "#0f172a",
  transition: "box-shadow 0.25s ease, transform 0.2s ease",
};

const button = {
  width: "100%",
  padding: "14px",
  marginTop: 10,
  borderRadius: 30,
  border: "none",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  background: "white",
  color: "#0f172a",
  transition: "all 0.25s ease",
  boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
};

const errorText = {
  color: "#fecaca",
  fontSize: 13,
  marginBottom: 10,
};

const hint = {
  marginTop: 18,
  fontSize: 12,
  opacity: 0.85,
};
