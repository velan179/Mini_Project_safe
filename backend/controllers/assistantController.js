import { errorResponse, successResponse } from '../utils/responseHandler.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const buildSystemPrompt = (location) => {
  const locationContext = location?.lat && location?.lng
    ? `The user's current location is Latitude: ${location.lat}, Longitude: ${location.lng}.`
    : "The user's location is currently unavailable.";

  return `You are a highly helpful and smart Travel Safety Assistant for the Tourist Safety App.
Give concise, practical advice on staying safe while travelling. Cover topics like lost documents, scams, emergency contacts, safe areas, travel advisories, and general safety tips. Keep answers friendly, brief (2-4 sentences), and actionable.

${locationContext}

IMPORTANT INSTRUCTIONS:
1. If the user asks for nearby services (Hospitals, Police Stations, Blood Banks, etc.), use their location to suggest nearby options or advise them to check the [Safety Map](/map) or [Emergency Contacts](/contacts).
2. If the user asks about blood donations or blood banks, suggest they visit the [Blood Request](/blood-request) or [Blood Donors](/blood-donors) page.
3. If the user is in an emergency or asks how to trigger an SOS, provide clear, step-by-step instructions. Tell them to press the [SOS Alert](/sos) button immediately.
4. You can route users to different parts of the application using markdown links. ONLY use these exact links:
   - [Safety Map](/map)
   - [SOS Alert](/sos)
   - [Emergency Contacts](/contacts)
   - [Community Reports](/community)
   - [Evidence Capture](/evidence)
   - [Blood Request](/blood-request)
   - [Blood Donors](/blood-donors)

Do not use any other markdown formatting besides these links. Just text and links.`;
};

export const chatWithAssistant = async (req, res, next) => {
  try {
    if (!GEMINI_API_KEY) {
      return errorResponse(
        res,
        500,
        'AI service is not configured. Set GEMINI_API_KEY in the backend environment.'
      );
    }

    const { message, history = [], location = null } = req.body;

    if (!message || !message.trim()) {
      return errorResponse(res, 400, 'Message is required');
    }

    const contents = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              typeof item.text === 'string' &&
              item.text.trim() &&
              (item.from === 'user' || item.from === 'bot')
          )
          .map((item) => ({
            role: item.from === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          }))
      : [];

    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: buildSystemPrompt(location) }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return errorResponse(
        res,
        response.status,
        err.error?.message || 'AI service request failed'
      );
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      return errorResponse(res, 500, 'AI service returned an empty response');
    }

    return successResponse(res, 200, 'Assistant reply generated successfully', {
      reply,
    });
  } catch (error) {
    next(error);
  }
};
