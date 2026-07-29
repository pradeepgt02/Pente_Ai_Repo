# Application Overview

## Application Selected

- **Application Name:** WebMind – AI Powered RAG Website Chatbot
- **Application URL (Frontend):** https://claysys-rag-project.vercel.app (also tested locally at `localhost:5173`)
- **Backend API:** https://huggingface.co/spaces/Pradeep002/claysys-rag-project
- **Reason for Choosing:** WebMind is a project I personally built and have full visibility into — including its architecture, backend logic, and data flow. This lets me test it more deeply than a black-box third-party AI app, and gives me direct access to the API layer for Part 10 (Postman). It also satisfies the assignment's core requirements: it has full user authentication (signup/login with JWT and password hashing) and a clear, meaningful business workflow (add a website → crawl and index it → ask questions → receive AI-generated, source-cited answers).

---

## 1. Purpose of the Application

WebMind converts any public website into a searchable, conversational knowledge base. Instead of manually browsing a site, a user provides a URL, the system crawls and indexes the site's content, and the user can then ask natural-language questions about that website. Answers are generated using Retrieval-Augmented Generation (RAG) so that responses are grounded in the actual indexed content rather than the model's general knowledge — reducing hallucination and providing verifiable source citations.

## 2. Target Users

- **Researchers / Students** who need to quickly extract information from documentation-heavy or content-heavy websites.
- **Developers** who want to "chat with" technical documentation instead of manually searching it.
- **Product / Business users** who want quick answers from a company's public website, knowledge base, or help center without reading every page.
- **Content analysts** who need to compare or summarize information across many pages of a website.

## 3. Major Features

| Feature | Description |
|---|---|
| User Authentication | Signup and Login with email/password, JWT-based sessions, password hashing (confirmed via "JWT Encrypted & Password Hash Protected" and "Secure Password Hashing & Encryption" labels on the login/signup screens) |
| Dashboard | Post-login landing page showing a personalized welcome, recent chats, and existing knowledge bases |
| Add Website (Knowledge Base creation) | User submits a URL; the system crawls the site recursively and builds a knowledge base from it |
| Recursive Website Crawler | Crawls linked pages within the target domain, not just a single page |
| Indexed Content Viewer | A side panel ("Indexed content") listing every crawled page with its title, URL, chunk count, and indexing status (e.g., "Welcome to Python.org" — 6 chunks, "PSF Grants Program" — 28 chunks) |
| AI Chat / Q&A | User asks questions in natural language about a selected knowledge base (website) |
| Retrieval-Augmented Generation | Answers are generated only from retrieved, indexed content — not from the LLM's general/base knowledge |
| Source Citations | Each AI answer includes a "Retrieved References" section showing the exact source page and section used to generate the answer |
| Grounded Fallback / Anti-Hallucination Behavior | When no relevant indexed content exists for a query, the system explicitly responds "I could not find this information in the indexed website pages" instead of guessing |
| Multi-Conversation Workspace | Multiple chat threads can exist per user, organized under "Conversations" in the sidebar |
| Multiple Knowledge Bases | A user can index and switch between multiple different websites, each maintained as a separate knowledge base |
| Theme Toggle | Light/dark mode switch in the workspace header |
| Session Management | Logged-in user profile shown in header with logout option |

## 4. AI Capabilities

- **Retrieval-Augmented Generation (RAG):** Combines semantic search over a vector store (FAISS) with an LLM (Groq API) to generate answers.
- **Embeddings-based Semantic Search:** Website text is chunked and converted into vector embeddings so that relevant content can be retrieved by meaning, not just keyword match.
- **Grounded Answer Generation:** The LLM is constrained to answer using retrieved chunks, with the system able to detect and disclose when no relevant context is found — directly observed in testing (e.g., asking "hello" returned a "not found" response, while "what is python" returned a cited answer from `python.org/about/`).
- **Source Attribution:** Every generated answer is paired with a citation link back to the specific indexed page/section it came from.

## 5. Primary Business Workflows

**Workflow A — Account Creation & Onboarding**
1. New user visits `/signup`
2. Enters Full Name, Email, Password, Confirm Password
3. Account is created (password hashed) → redirected to Login
4. User logs in via `/login` → redirected to `/dashboard`

**Workflow B — Knowledge Base Creation (Core Business Workflow)**
1. From the Dashboard, user clicks "+ Add Website" or "+ New Chat"
2. User submits a target website URL
3. Backend crawler recursively crawls the site, extracts text, generates embeddings, and stores them in the FAISS vector store
4. Indexing status/progress becomes visible (page count, chunk count, vector count — e.g., "24 pages · 176 chunks · 176 vectors")

**Workflow C — Conversational Q&A (Core Business Workflow)**
1. User selects a knowledge base (indexed website) from the Workspace
2. User types a natural-language question into the chat input
3. System retrieves the most relevant chunks via semantic search
4. LLM generates an answer grounded in those chunks
5. Answer is displayed along with a "Retrieved References" card citing the exact source page
6. If no relevant content is found, the system explicitly informs the user rather than fabricating an answer

**Workflow D — Session & Access Management**
1. User remains authenticated across Dashboard/Workspace navigation via JWT session
2. User can log out from the profile menu, ending the session and returning to `/login`

---

## 6. Observed Environment (for reference in Test Strategy)

- **Frontend:** React + TypeScript + Vite, served locally at `localhost:5173` during this testing cycle
- **Backend:** FastAPI (Python), deployed on Hugging Face Spaces for the live version
- **Vector Store:** FAISS
- **LLM Provider:** Groq API
- **Auth:** JWT + password hashing (client-visible security messaging confirms this)

---

## 7. Architecture Diagram

```
                         User (Browser)
                              │
                              ▼
                    React Frontend (Vite/TS)
                    - Login / Signup
                    - Dashboard
                    - Workspace / Chat UI
                              │
                        REST API calls
                     (Auth, Crawl, Chat)
                              │
                              ▼
                    FastAPI Backend
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
 Auth Service          Crawling Engine        Chat / RAG Service
 - Signup/Login        - Recursive crawler     - Query embedding
 - JWT issuance        - Text extraction       - Semantic retrieval
 - Password hashing    - Chunking               - Prompt construction
        │                     │                     │
        │                     ▼                     │
        │            Embedding Generation            │
        │                     │                     │
        │                     ▼                     │
        │             FAISS Vector Store ◄───────────┘
        │              (per-website index)
        │                     │
        │                     ▼
        │              Groq LLM API
        │                     │
        ▼                     ▼
   User Session        Answer + Source Citations
                        returned to Frontend
```

**Flow summary:** User authenticates → submits a website URL → backend crawls and chunks the site → chunks are embedded and stored in FAISS (one knowledge base per website) → user asks a question → question is embedded, relevant chunks are retrieved from FAISS → retrieved chunks + question are sent to the Groq LLM → LLM generates a grounded answer → answer and its source reference(s) are returned and rendered in the chat UI, or a "not found" response is returned if no relevant chunk exists.

---

## 8. Technology Stack Table

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | React + TypeScript | UI components and application logic |
| Build Tool | Vite | Development server and bundling |
| Styling | Tailwind CSS | UI styling |
| Routing | React Router | Client-side navigation (`/login`, `/signup`, `/dashboard`, `/workspace/chat/...`) |
| HTTP Client | Axios | API communication between frontend and backend |
| Backend Framework | FastAPI (Python) | REST API server |
| Web Scraping | BeautifulSoup, Playwright | Crawling and extracting website content |
| RAG Orchestration | LangChain | Chaining retrieval and generation steps |
| Vector Database | FAISS | Storing and searching content embeddings |
| LLM Provider | Groq API | Generating natural-language answers |
| Authentication | JWT, password hashing | User signup/login/session security |
| Frontend Hosting | Vercel | Live frontend deployment |
| Backend Hosting | Hugging Face Spaces | Live backend/API deployment |
| Local Dev Environment | localhost:5173 (frontend), local FastAPI server (backend) | Environment used for this QA testing cycle |

---

## 9. Assumptions

- The application under test is the **local development build** (`localhost:5173`) unless otherwise noted; behavior on the live Vercel/Hugging Face deployment may differ slightly (e.g., cold-start latency on Hugging Face Spaces).
- Test websites used for crawling (e.g., `www.python.org`) are publicly accessible, stable, and permit crawling (no login wall, no aggressive anti-bot/robots.txt blocking) for the duration of testing.
- The Groq API and any third-party embedding service are assumed to be available and within rate limits during the testing window; failures due to third-party outages are out of scope for defect logging against WebMind itself.
- A single test user account is used across most manual/automation test cases unless multi-user/session isolation is explicitly being tested.
- "Business workflow" for this assignment is defined as: **Add Website → Crawl/Index → Ask Question → Receive Cited Answer**, since this is the core value-delivering path of the application.
- No formal SLA, uptime, or performance benchmark was provided by the project owner, so reasonable industry-standard thresholds (e.g., page response < 3s, chat response < 10s) are assumed for non-functional testing.

---

## 10. Known Limitations

- **No persistent database confirmed for all data** — per the project's own roadmap, some data handling (chat history, indexed content) may rely on file-based or in-memory storage rather than a production-grade persistent database; this affects data-durability testing.
- **No PDF/document knowledge base support** — only public website URLs can be indexed; PDF/file upload is listed as a future improvement, not a current feature.
- **No streaming responses** — answers are returned as a complete block rather than streamed token-by-token, which may affect perceived performance on longer answers.
- **Single-language assumption** — multi-language support is not yet implemented, which is relevant to Part 9 (AI Testing → multilingual prompts) as a likely gap/defect area rather than a working feature.
- **No admin dashboard** — there is no visible administrative interface for managing users, usage, or indexed sites at a system level.
- **Crawler scope is domain-recursive but may have depth/page limits** — the exact crawl depth and page-count ceiling is not documented and should be discovered empirically during testing (e.g., what happens on a very large site).
- **Third-party dependency risk** — the application's core AI functionality depends entirely on the availability and response quality of the Groq API; this is a single point of failure outside the application's own control.

---

## 11. Non-Functional Characteristics

| Characteristic | Description / Expectation |
|---|---|
| **Performance** | Website crawling/indexing is expected to take longer for larger sites (proportional to page count); chat responses should return within a few seconds once indexing is complete |
| **Security** | Passwords are hashed (not stored in plain text); sessions are managed via JWT; authentication is required before accessing Dashboard/Workspace routes |
| **Reliability** | The system should gracefully handle unavailable/unreachable target websites during crawl, and should not crash or hang the UI on failure |
| **Usability** | Chat interface follows familiar chatbot UX patterns (message bubbles, timestamps, source citation cards) with a light/dark theme toggle |
| **Scalability** | Each website is maintained as an independent knowledge base/vector index, allowing multiple knowledge bases per user without cross-contamination of content |
| **Accuracy / Trustworthiness** | Answers must be traceable to a source; the system is expected to explicitly decline to answer (rather than hallucinate) when no relevant indexed content exists — this is a core trust characteristic to be verified in Part 9 |
| **Maintainability** | Modular backend structure (separate crawler, embeddings, RAG, and services layers per the project's folder structure) supports independent testing of each component |
| **Portability** | Frontend and backend are decoupled and independently deployable (Vercel + Hugging Face Spaces), supporting environment-specific testing (local vs. live)|
