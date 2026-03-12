import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={container}>
      <button
        style={btn}
        onClick={() =>
          setLanguage(language === "en" ? "ta" : "en")
        }
      >
        🌐 {language === "en" ? "தமிழ்" : "English"}
      </button>
    </div>
  );
}

const container = {
  position: "fixed",
  top: 16,
  right: 16,
  zIndex: 999,
};

const btn = {
  background: "rgba(255,255,255,0.25)",
  border: "none",
  borderRadius: 20,
  padding: "6px 14px",
  cursor: "pointer",
  fontSize: 12,
  color: "white",
};
