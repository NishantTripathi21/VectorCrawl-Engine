import { getEmbedding } from "../processing/embedder.js";
import { queryVectors } from "../db/queryVectors.js";
import Groq from "groq-sdk";

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const answerQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    // Step 1: Convert question -> embedding
    const queryEmbedding = await getEmbedding(question);

    // Step 2: Pinecone top-k retrieval
    const results = await queryVectors(queryEmbedding, 5);

    if (!results || results.length === 0) {
      return res.json({
        success: true,
        answer: "No relevant information was found in the crawled website.",
      });
    }

    // Step 3: Build context from retrieved chunks
    const context = results
      .map((match, i) => `Chunk ${i + 1}:\n${match.metadata.chunk}`)
      .join("\n\n-----\n\n");

    // Step 4: Build final RAG prompt
    const prompt = `
You are an AI assistant. Answer the question using ONLY the provided website content below.
If the information is not available in the content, respond: "I don't know based on the website data."

Website Content:
${context}

User Question: ${question}

Answer:
`;

    // Step 5: Groq LLM call
    const response = await groqClient.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.0
  });

    const answer = response.choices[0].message.content;

    return res.json({
      success: true,
      answer,
      contextUsed: results.length,
    });

  } catch (err) {
    console.error("RAG Error:", err);
    next(err);
  }
};
