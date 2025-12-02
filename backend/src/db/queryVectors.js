import { getPineconeIndex } from "./pinecone.js";

export async function queryVectors(queryEmbedding, topK = 5) {
  try {
    const index = getPineconeIndex();

    const result = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return result.matches;
  } catch (err) {
    console.error("Pinecone query error:", err);
    throw new Error("Failed to query Pinecone");
  }
}
