import { chunkText } from "./chunker.js";
import { generateEmbedding } from "./embedder.js";

export async function processPage(page) {
  const { url, text } = page;

  const chunks = chunkText(text);

  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const embedding = await generateEmbedding(chunk);
    if (!embedding) continue;

    results.push({
      url,
      chunk,
      embedding,
      chunkIndex: i,
    });
  }

  return results;
}
