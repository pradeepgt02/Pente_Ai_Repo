# Part 6 — Unit Testing

Unit tests for reusable business-logic functions used across WebMind's frontend
(signup/login validation, chat input handling, citation formatting) and backend
(URL validation, text chunking for indexing, password hashing, input sanitization,
duplicate-URL detection).

Each function under test is a small, pure, reusable utility that mirrors real
logic WebMind must implement somewhere in its signup, login, crawling, and
chat/citation pipeline. Tests cover **positive**, **negative**, and **edge-case**
scenarios per function.

## Folder Structure

```
UnitTesting/
├── Jest/
│   ├── webmindUtils.js          # Frontend business-logic functions under test
│   ├── webmindUtils.test.js     # 15 Jest tests
│   └── package.json
└── Pytest/
    ├── webmind_utils.py         # Backend business-logic functions under test
    ├── test_webmind_utils.py    # 10 Pytest tests
    └── requirements.txt
```

## Running the Jest Suite

```bash
cd UnitTesting/Jest
npm install
npm test
```

**Result:** 15/15 tests passed (8 functions: `isValidEmail`, `isStrongPassword`,
`passwordsMatch`, `sanitizeFullName`, `isValidUrl`, `isEmptyMessage`,
`formatCitation`, `isDuplicateWebsite` — minimum required: 15).

## Running the Pytest Suite

```bash
cd UnitTesting/Pytest
pip install -r requirements.txt
pytest -v
```

**Result:** 10/10 tests passed (7 functions: `is_valid_url`, `chunk_text`,
`hash_password`, `verify_password`, `sanitize_input`, `is_duplicate_url`,
`is_valid_email` — minimum required: 10).

## Coverage Summary

| Function | Positive | Negative | Edge |
|---|---|---|---|
| Email validation (JS & Py) | ✅ | ✅ | — |
| Password strength check | ✅ | ✅ | — |
| Password match check | ✅ | ✅ | — |
| Full name sanitization | ✅ | ✅ | — |
| URL validation (JS & Py) | ✅ | ✅ | — |
| Empty chat message check | — | — | ✅ |
| Citation formatting | ✅ | — | ✅ |
| Duplicate URL detection | ✅ | ✅ (JS) | — |
| Text chunking (indexing) | ✅ | — | — |
| Password hashing/verification | ✅ | ✅ | — |
| Input sanitization (XSS) | ✅ | ✅ | — |
