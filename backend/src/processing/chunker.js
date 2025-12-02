function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
}

function splitIntoSentences(text) {
  return text
    .match(/[^\.!\?]+[\.!\?]+/g) // sentence regex
    ?.map((s) => s.trim()) || [text];
}

export function chunkText(text, url, chunkSize = 700) {
  const cleaned = cleanText(text);
  const sentences = splitIntoSentences(cleaned);

  const chunks = [];
  let current = "";
  let tokenCount = 0;
  let seq = 1;

  for (const sentence of sentences) {
    const sentenceTokens = sentence.split(" ").length;

    if (tokenCount + sentenceTokens > chunkSize) {
      chunks.push({
        seq,
        url,
        chunk: current.trim(),
        tokens: tokenCount,
      });

      seq++;
      current = sentence + " ";
      tokenCount = sentenceTokens;
    } else {
      current += sentence + " ";
      tokenCount += sentenceTokens;
    }
  }

  if (current.trim().length > 0) {
    chunks.push({
      seq,
      url,
      chunk: current.trim(),
      tokens: tokenCount,
    });
  }

  return chunks;
}
