import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const texts = {
    en: {
      homeTitle: "Welcome to TourSafe",
      homeSubtitle: "Your safety companion for confident travel",
      sosTitle: "Emergency SOS",
      sosHint: "Use only in real emergencies",
      contactsTitle: "Emergency Contacts",
      assistantTitle: "AI Safety Assistant",
      communityTitle: "Community Safety Reports",
    },
    ta: {
      homeTitle: "டூர் சேஃப்-க்கு வரவேற்கிறோம்",
      homeSubtitle: "பாதுகாப்பான பயணத்திற்கு உங்கள் துணை",
      sosTitle: "அவசர உதவி",
      sosHint: "உண்மையான அவசரங்களில் மட்டும் பயன்படுத்தவும்",
      contactsTitle: "அவசர தொடர்புகள்",
      assistantTitle: "AI பாதுகாப்பு உதவியாளர்",
      communityTitle: "சமூக பாதுகாப்பு அறிக்கைகள்",
    },
  };

  const t = (key) => texts[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
