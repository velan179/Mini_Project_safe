import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { apiCall, API_ENDPOINTS } from "../services/apiConfig";

export default function AiAssistant() {
  const navigate = useNavigate();
  const { location } = useLocation();

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello 👋 I'm your Travel Safety Assistant powered by Gemini AI. Ask me anything about staying safe while travelling! If you need help finding nearby services or triggering an SOS, just ask.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ✅ Backend AI service call
  const getAIReply = async (userInput, chatHistory) => {
    const response = await apiCall("POST", API_ENDPOINTS.AI_CHAT, {
      message: userInput,
      history: chatHistory,
      location: location
        ? {
            lat: location.lat,
            lng: location.lng,
          }
        : null,
    });

    return response?.data?.reply || "I couldn't generate a reply right now.";
  };

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const userMsg = {
      from: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentInput = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const reply = await getAIReply(currentInput, messages);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `⚠️ Sorry, I couldn't reach the AI service. (${error.message})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  // ✅ PARSE MARKDOWN LINKS
  const renderMessageText = (text) => {
    // Regex to match [Link Text](/path)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      parts.push(
        <Link
          key={match.index}
          to={match[2]}
          style={{
            color: "#22c55e",
            textDecoration: "underline",
            fontWeight: 600,
          }}
        >
          {match[1]}
        </Link>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div style={container}>
      {/* Header */}
      <div style={assistantHeader}>
        <div style={avatar}>🤖</div>
        <div>
          <h2 style={{ margin: 0 }}>Travel Safety Assistant</h2>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>
            Always here to help you stay safe
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div style={suggestions}>
        {["Is it safe at night?", "Lost passport", "Nearby police", "Travel scam tips"].map(
          (q) => (
            <button key={q} style={suggestionBtn} onClick={() => setInput(q)}>
              {q}
            </button>
          )
        )}
      </div>

      {/* Chat Box */}
      <div style={chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className="message-animate"
            style={msg.from === "user" ? userBubble : botBubble}
          >
            <div>{renderMessageText(msg.text)}</div>
            <p style={msg.from === "user" ? timeText : botTimeText}>{msg.time}</p>
          </div>
        ))}

        {typing && (
          <div style={typingBubble}>
            🤖 Assistant is typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div style={inputBar}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          style={sendBtn}
          onClick={sendMessage}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Send
        </button>
      </div>

      {/* Back */}
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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const assistantHeader = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 20,
};

const avatar = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
};

const suggestions = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 12,
};

const suggestionBtn = {
  fontSize: 12,
  padding: "6px 12px",
  borderRadius: 16,
  border: "none",
  background: "rgba(255,255,255,0.25)",
  color: "white",
  cursor: "pointer",
};

const chatBox = {
  width: "100%",
  maxWidth: 700,
  flex: 1,
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(12px)",
  borderRadius: 20,
  padding: 20,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const userBubble = {
  alignSelf: "flex-end",
  background: "#22c55e",
  color: "white",
  padding: "10px 14px",
  borderRadius: "16px 16px 0 16px",
  maxWidth: "75%",
  fontSize: 14,
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const botBubble = {
  alignSelf: "flex-start",
  background: "rgba(0,0,0,0.45)",
  color: "white",
  padding: "10px 14px",
  borderRadius: "16px 16px 16px 0",
  maxWidth: "75%",
  fontSize: 14,
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const timeText = {
  fontSize: 10,
  opacity: 0.7,
  marginTop: 4,
  textAlign: "right",
};

const botTimeText = {
  fontSize: 10,
  opacity: 0.7,
  marginTop: 4,
  textAlign: "left",
};

const typingBubble = {
  alignSelf: "flex-start",
  fontSize: 12,
  opacity: 0.8,
  fontStyle: "italic",
  marginTop: 4,
};

const inputBar = {
  width: "100%",
  maxWidth: 700,
  display: "flex",
  gap: 10,
  marginTop: 16,
  background: "rgba(255,255,255,0.15)",
  padding: 10,
  borderRadius: 18,
  backdropFilter: "blur(10px)",
};

const inputStyle = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: 14,
  border: "none",
  outline: "none",
  fontSize: 14,
  background: "rgba(255,255,255,0.95)",
  color: "#0f172a",
};

const sendBtn = {
  padding: "12px 18px",
  borderRadius: 14,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  transition: "transform 0.2s ease",
};

const backBtn = {
  marginTop: 16,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.6)",
  color: "white",
  padding: "8px 18px",
  borderRadius: 20,
  cursor: "pointer",
};
