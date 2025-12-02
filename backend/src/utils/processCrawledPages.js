// processCrawledPages.js

import { chunkText } from "../processing/chunker.js";
import { getBatchEmbeddings } from "../processing/embedder.js";
import { storeVectors } from "../db/storeVectors.js";
import { v4 as uuidv4 } from "uuid";

export async function processCrawledPages(crawledPages) {
  try {
    console.log("🧩 Starting chunk + embed + store pipeline");

    // 1️⃣ Build chunks
    let allChunks = [];

    crawledPages.forEach((page) => {
      if (page.success && page.text) {
        const chunks = chunkText(page.text, page.url);
        allChunks.push(...chunks);
      }
    });

    console.log(`🧩 Created ${allChunks.length} chunks`);

    if (allChunks.length === 0) {
      throw new Error("No chunks extracted from pages");
    }

    // 2️⃣ Extract raw text
    const textList = allChunks.map((c) => c.chunk);

    // 3️⃣ Generate embeddings in batch
    console.log("🧠 Generating batch embeddings...");
    const embeddings = await getBatchEmbeddings(textList);

    console.log("📦 Embeddings generated:", embeddings.length);

    // 4️⃣ Build Pinecone vector format
    const pineconeVectors = embeddings.map((embedding, i) => ({
      id: uuidv4(),
      values: embedding,
      metadata: {
        url: allChunks[i].url,
        seq: allChunks[i].seq,
        chunk: allChunks[i].chunk,
      },
    }));

    // 5️⃣ Store in Pinecone
    console.log("🟦 Storing vectors in Pinecone...");
    await storeVectors(pineconeVectors);

    console.log("🎉 Chunk + Embed + Pinecone storing DONE");

    return {
      success: true,
      chunksCreated: allChunks.length,
      vectorsStored: pineconeVectors.length,
    };

  } catch (err) {
    console.error("❌ processCrawledPages ERROR:", err);
    throw err;
  }
}
