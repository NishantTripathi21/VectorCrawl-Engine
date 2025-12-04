import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEmbedding } from "../processing/embedder.js";
import { queryVectors } from "../db/queryVectors.js";

export const answerQuestion = async (req, res, next) => {
  try {
    const { question, sessionId } = req.body;

    if (!question || !sessionId) {
      return res.status(400).json({
        success: false,
        error: "Both 'question' and 'sessionId' are required",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const queryEmbedding = await getEmbedding(question);

    // Query Pinecone ONLY inside this session's namespace
    const results = await queryVectors(queryEmbedding, sessionId, 5);

    if (!results || results.length === 0) {
      return res.json({
        success: true,
        answer: "No relevant information was found in this session's website content.",
      });
    }

    const context = results
      .map(
        (match, i) =>
          `Chunk ${i + 1} from ${match.metadata.url}:\n${match.metadata.chunk}`
      )
      .join("\n\n-----\n\n");

    const prompt = `
Use the following website content to answer the question. Prioritize this content.
If the answer is not directly found, infer from structure or related text.
Only say "I don't know based on the website data." if absolutely no relevant information exists.

Website Content:
${context}

Question:
${question}

Answer:
`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return res.json({
      success: true,
      answer,
      contextUsed: results.length,
    });

  } catch (err) {
    console.error(
      "Gemini RAG Error:",
      err.response?.data || err.message || err
    );
    next(err);
  }
};
