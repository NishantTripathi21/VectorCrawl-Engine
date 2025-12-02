import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateAnswer(context, query) {
  try {
    const prompt = `
            You are an assistant that answers questions ONLY using the context below.
            If the answer is not in the context, say "I don't know".

            Context:
            ${context}

            Question: ${query}

            Answer (with sources):
            `;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("❌ LLM error:", err);
    return "LLM failed to answer.";
  }
}
