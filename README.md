# 🔍 RAG-Based Search Engine for Any Website
A powerful **Retrieval-Augmented Generation (RAG)** engine that allows users to chat with any website. The system crawls a URL, processes the content into vector embeddings, stores them in Pinecone, and uses **Google Gemini Flash** to answer questions with zero hallucinations.

---

## 🚀 Overview

This project transforms static websites into interactive knowledge bases. The backend pipeline performs the following:
1.  **Crawls** the target website (BFS traversal).
2.  **Extracts & Cleans** HTML text (removing ads, scripts, and styles).
3.  **Chunks** content into semantic segments.
4.  **Embeds** text using **Jina AI**.
5.  **Stores** vectors in **Pinecone**.
6.  **Retrieves** context and answers user queries via **Google Gemini Flash**.

---

## ✨ Features

### 🕷️ Website Crawler
* **BFS Strategy:** Crawls internal links systematically.
* **Smart Extraction:** Uses Cheerio to strip unnecessary tags (scripts, styles, ads).
* **Safety:** Handles infinite loops and duplicate pages.

### ✂️ Intelligent Processing
* **Text Chunking:** Splits content into 500–1000 token segments while preserving semantic meaning.
* **Metadata Enrichment:** Tags chunks with Source URL, sequence number, and title.
* **Token Counting:** Uses `tiktoken` for precise context window management.

### 🧠 AI & Vectors
* **Embeddings:** Uses **Jina AI** (768 dimensions) for fast, free, and accurate vectorization.
* **Vector Database:** **Pinecone** for storage, similarity search, and metadata filtering.
* **LLM Integration:** **Google Gemini Flash** for high-speed, context-aware answers.

---

## 🏗 Project Structure

```text
backend/
│
├─ src/
│   ├─ crawler/
│   │   |─ crawl.js              # BFS Crawler logic
|   |   |─ exract.js
|   |   |_utils.js
│   │
│   ├─ processing/
│   │   ├─ chunker.js            # Text splitting & token counting
│   │   └─ embedder.js           # Jina AI integration
│   │
│   ├─ db/
│   │   ├─ pinecone.js           # DB Configuration
│   │   ├─ storeVectors.js       # Upsert logic
│   │   └─ queryVectors.js       # Similarity search
│   │
│   ├─ utils/
│   │   └─ processCrawledPages.js # Pipeline orchestration
│   │
│   ├─ controllers/
│   │   ├─ crawlController.js
│   │   └─ ragController.js
│   │
│   ├─ routes/
│   │   ├─ crawlRoutes.js
│   │   └─ ragRoutes.js
│   │
│   └─ server.js                  # Entry point
│
├─ package.json
└─ .env
```

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone [https://github.com/NishantTripathi21/VectorCrawl-Engine](https://github.com/NishantTripathi21/VectorCrawl-Engine)
cd VectorCrawl-Engine/backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the `backend` folder and add your API keys:

```env
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=rag-search

# Jina AI (Embeddings)
JINA_API_KEY=your_jina_key

# Google Gemini (LLM)
GEMINI_API_KEY=your_gemini_api_key
```

### 4️⃣ Run the Backend
```bash
node src/server.js
```
*Server runs on: `http://localhost:3000`*

---

## 🧠 API Endpoints

### 1️⃣ Start Crawling
**POST** `/api/crawl/start`

Initiates the crawling and embedding pipeline for a specific URL.

**Body:**
```json
{
  "url": "[https://example.com](https://example.com)"
}
```

**Response:**
```json
{
  "success": true,
  "pagesCrawled": 5,
  "chunksCreated": 120,
  "vectorsStored": 120
}
```

### 2️⃣ Ask a Question (RAG)
**POST** `/api/rag/ask`

Retrieves relevant context and generates an answer.

**Body:**
```json
{
  "question": "What services does this website offer?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Based on the website content, they offer...",
  "contextUsed": 3
}
```

---

## 🔄 The RAG Pipeline (Under the Hood)

1.  **Crawl & Extract:**
    * Normalize URLs.
    * Extract raw text using `Cheerio`.
2.  **Chunking:**
    * Split text into 500-1000 token chunks.
    * Attach metadata (URL, Page Title).
3.  **Embedding:**
    * Convert text chunks to vectors using `jina-embeddings-v2-base-en`.
4.  **Storage:**
    * Upsert vectors to Pinecone.
5.  **Retrieval:**
    * User asks a question → Convert question to vector.
    * Query Pinecone for top-k similar chunks.
6.  **Generation:**
    * Feed `Context + Question` to **Gemini Flash**.
    * Gemini generates an answer based strictly on the context.

---

## 📘 Future Improvements
- [ ] **Real-time Updates:** Implement Server-Sent Events (SSE) for crawling progress.
- [ ] **Multi-Tenancy:** Support multiple users with separate vector namespaces.
- [ ] **Frontend:** Build a Next.js UI for the chat interface.
- [ ] **Job Queue:** Use BullMQ to handle large crawling jobs in the background.

---

## 💡 Key Skills Demonstrated
This project highlights competency in:
* **LLM Integration & RAG Architecture:** Building industry-standard AI pipelines.
* **Vector Search:** Implementing semantic search using Embeddings and Pinecone.
* **Backend Engineering:** Scalable Node.js architecture with separation of concerns.
* **Data Engineering:** Web crawling, data cleaning, and unstructured data processing.

---

## 👨‍💻 Author

**Nishant Tripathi**
* **B.Tech CSE, NIT Srinagar**
* *Role:* • Full Stack Developer • GenAI • Cloud 

[GitHub](https://github.com/NishantTripathi21) | [LinkedIn](https://linkedin.com/in/nishanttripathi21)