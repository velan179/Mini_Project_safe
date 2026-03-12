import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function AiAssistant() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello 👋 I'm your Travel Safety Assistant powered by Gemini AI. Ask me anything about staying safe while travelling!",
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

  // ✅ REAL Gemini API CALL
  const getAIReply = async (userInput, chatHistory) => {
    // Build Gemini conversation history
    const contents = chatHistory.map((msg) => ({
      role: msg.from === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Add current user message
    contents.push({ role: "user", parts: [{ text: userInput }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: "You are a helpful Travel Safety Assistant. Give concise, practical advice on staying safe while travelling. Cover topics like lost documents, scams, emergency contacts, safe areas, travel advisories, and general safety tips. Keep answers friendly, brief (2-4 sentences), and actionable.",
              },
            ],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Gemini API error");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
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
            <div>{msg.text}</div>
            <p style={timeText}>{msg.time}</p>
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
