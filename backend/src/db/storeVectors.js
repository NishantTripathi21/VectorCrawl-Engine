import { getPineconeIndex } from "./pinecone.js";

export async function storeVectors(vectors) {
  try {
    const index = getPineconeIndex();

    const result = await index.upsert(vectors);

    return {
      success: true,
      result,
      count: vectors.length,
    };
  } catch (err) {
    console.error("Pinecone upsert error:", err);
    throw new Error("Failed to upsert vectors to Pinecone");
  }
}
