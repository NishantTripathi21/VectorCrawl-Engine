import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEmbedding } from "../processing/embedder.js";
import { queryVectors } from "../db/queryVectors.js";

export const answerQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required"
      });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const queryEmbedding = await getEmbedding(question);
    const results = await queryVectors(queryEmbedding, 5);

    if (!results || results.length === 0) {
      return res.json({
        success: true,
        answer: "No relevant information was found in the website content."
      });
    }
    const context = results
      .map(
        (match, i) =>
          `Chunk ${i + 1} from ${match.metadata.url}:\n${match.metadata.chunk}`
      )
      .join("\n\n-----\n\n");
    const prompt = `
You are an assistant. Answer the question using ONLY the website content below.
If the answer is not present, respond exactly: "I don't know based on the website data."

Website Content:
${context}

User Question:
${question}

Answer:
`;
    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    return res.json({
      success: true,
      answer,
      contextUsed: results.length
    });

  } catch (err) {
    console.error("Gemini RAG Error:", err.response?.data || err.message || err);
    next(err);
  }
};
