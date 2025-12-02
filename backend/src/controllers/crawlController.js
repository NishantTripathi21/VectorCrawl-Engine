import { crawlWebsite } from "../crawler/crawl.js";
import { chunkText } from "../processing/chunker.js";
import { getBatchEmbeddings } from "../processing/embedder.js";
import { storeVectors } from "../db/storeVectors.js";
import { v4 as uuidv4 } from "uuid";
import { processCrawledPages } from "../utils/processCrawledPages.js";

export const startCrawlProcess = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    console.log("Starting crawl pipeline for:", url);

    // Crawl
    const pages = await crawlWebsite(url, 20);

    console.log(`Crawled pages: ${pages.length}`);

    //(chunk → embed → store)
    const result = await processCrawledPages(pages);

    // Final response
    return res.json({
      success: true,
      message: "Crawling + embedding + storing completed!",
      pagesCrawled: pages.length,
      ...result,
    });

  } catch (err) {
    next(err);
  }
};