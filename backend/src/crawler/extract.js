import axios from "axios";
import * as cheerio from "cheerio";

export async function extractPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 Custom-RAG-Crawler",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").text().trim() || "No Title";

    // Remove irrelevant elements
    [
      "script",
      "style",
      "nav",
      "footer",
      "header",
      "noscript",
      "svg",
      "img"
    ].forEach((tag) => $(tag).remove());

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    const headings = [];
    $("h1, h2, h3, h4, h5, h6").each((i, el) => {
      headings.push($(el).text().trim());
    });

    //all <a href="">
    const links = [];
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      if (href) links.push(href);
    });

    return {
      success: true,
      url,
      title,
      text: bodyText,
      headings,
      links,
    };
  } catch (err) {
    console.error(` Extraction failed at ${url}: ${err.message}`);
    return { success: false, url, text: "", headings: [], links: [] };
  }
}
