# Part 8 — End-to-End Business Workflow Automation (Python)

Production-grade Python test automation framework using **Playwright Python** and **pytest** for E2E testing of the **WebMind AI Application**.

---

## 🎯 Business Workflow Automated

This framework automates the full RAG (Retrieval-Augmented Generation) business lifecycle from start to finish:

1. **User Authentication (Login)**: Secure authentication and session initiation.
2. **Knowledge Ingestion (Create)**: Adding & indexing a target website URL into vector embeddings.
3. **Knowledge Base Verification (Read)**: Validating index creation and website presence in the list.
4. **AI RAG Interaction (Execute)**: Sending a business query and verifying AI generated answers with citations.
5. **Teardown & Cleanup (Delete & Logout)**: Removing the Knowledge Base and ending the user session safely.

---

## 📁 Project Architecture

```
BusinessWorkflowAutomation/
│
├── pages/                        # Page Object Model (POM)
│   ├── base_page.py              # Parent base class for shared Playwright actions
│   ├── login_page.py             # Page object for /login
│   ├── dashboard_page.py         # Page object for /dashboard
│   ├── knowledge_base_page.py     # Page object for /workspace/index (CRUD)
│   └── chat_page.py              # Page object for /workspace/chat/:id (AI Chat)
│
├── tests/                        # Pytest Test Suites
│   ├── conftest.py               # Fixtures (browser contexts, page objects, screenshot hook)
│   ├── test_e2e_business_workflow.py # Master Part 8 E2E End-to-End Business Workflow Test
│   ├── test_login.py             # Login feature tests
│   ├── test_crud.py              # Knowledge Base CRUD feature tests
│   └── test_ai_chat.py           # AI Chat feature tests
│
├── utils/                        # Helpers & Configuration
│   ├── config.py                 # Environment settings & test datasets
│   └── helpers.py                # Reusable helper functions
│
├── reports/                      # Pytest HTML Test Reports
├── screenshots/                  # Failure screenshots directory
│
├── pytest.ini                    # Pytest master settings & markers
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
└── README.md                     # Documentation
```

---

## ⚡ Setup & Execution

### 1. Prerequisites
- Python 3.10+
- Target WebMind AI application running at `http://localhost:5173`

### 2. Installation
Navigate into `BusinessWorkflowAutomation/` and install dependencies:

```bash
cd BusinessWorkflowAutomation
pip install -r requirements.txt
playwright install chromium
```

### 3. Run Tests

```bash
# Run all the Test
python -m pytest tests/ -v
# Run the Master Part 8 End-to-End Business Workflow test
pytest tests/test_e2e_business_workflow.py

# Run all tests with HTML report generation
pytest

# Run tests by custom markers
pytest -m e2e
pytest -m smoke
pytest -m crud
pytest -m chat
```
