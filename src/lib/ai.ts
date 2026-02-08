import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true // Hanya untuk demo dummy client-side
});

export const getAIResponse = async (messages: any[]) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free", // atau model murah lainnya
      messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "Maaf, sistem sedang sibuk. Silakan coba lagi.";
  }
};