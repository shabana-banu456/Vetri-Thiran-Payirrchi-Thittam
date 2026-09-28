const { GoogleGenAI } = require("@google/genai");

let client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }

  return client;
}

async function chat(prompt, context = "") {
  const api = getClient();

  if (!api) {
    return "AI service is not configured. Add GEMINI_API_KEY to .env";
  }

  const systemInstruction = `
You are AI FitTrack, a fitness information assistant.

Give general wellness and fitness information.
Do not diagnose medical conditions.
Do not replace a doctor or qualified healthcare professional.

${context ? `Application context:\n${context}` : ""}
`;

  const modelName =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const maxRetries = 3;
let lastError;

for (let attempt = 0; attempt <= maxRetries; attempt++) {
  try {
    const response = await api.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "No response generated.";

  } catch (error) {
    lastError = error;

    const status =
      error?.status ||
      error?.code ||
      error?.response?.status;

    console.log(`Gemini attempt ${attempt + 1} failed:`, status);

    if (status !== 503 || attempt === maxRetries) {
      throw error;
    }

    const delay = 2000 * Math.pow(2, attempt);

    console.log(`Retrying Gemini in ${delay / 1000}s...`);

    await new Promise(resolve =>
      setTimeout(resolve, delay)
    );
  }
}

throw lastError;
}
async function embedding(text) {
  const api = getClient();

  if (!api) {
    return null;
  }

  const response = await api.models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768
    }
  });

  return response.embeddings[0].values;
}
module.exports = {
  chat,
  embedding
};