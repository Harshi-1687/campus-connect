import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export async function improveDescription({
  title,
  club,
  venue,
  time,
  description,
}) {
  const prompt = `
Improve the following college event description.
Make it professional, clear, and engaging.
Do NOT add options or bullet points.
Return ONLY the improved description text.

Event Title: ${title}
Organized by: ${club}
Venue: ${venue}
Time: ${time}

Original Description:
${description}
`;

  const result = await model.generateContent(prompt);
  const candidates = result.response?.candidates;

  if (!candidates || candidates.length === 0) {
    throw new Error("No AI candidates returned");
  }

  // 🔑 Combine ALL text parts safely
  const parts = candidates[0].content?.parts || [];

  const improvedText = parts
    .map((p) => p.text || "")
    .join("")
    .trim();

  if (!improvedText) {
    throw new Error("AI returned empty text");
  }

  return improvedText;
}
