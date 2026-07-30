# Part 6 — Unit Testing

Unit tests for reusable business-logic functions used across WebMind's frontend
(signup/login validation, chat input handling, citation formatting) and backend
(URL validation, text chunking for indexing, password hashing, input sanitization,
duplicate-URL detection).

Per the assignment requirement, tests cover **positive, negative, boundary, and
edge-case** scenarios.

## Folder Structure

```
UnitTesting/
├── Jest/
│   ├── webmindUtils.js          # Frontend business-logic functions under test
│   ├── webmindUtils.test.js     # 17 Jest tests
│   └── package.json
└── Pytest/
    ├── webmind_utils.py         # Backend business-logic functions under test
    ├── test_webmind_utils.py    # 12 Pytest tests
    └── requirements.txt
```

## Running the Jest Suite

```bash
cd UnitTesting/Jest
npm install
npm test
```

**Result:** 17/17 tests passed (minimum required: 15).

## Running the Pytest Suite

```bash
cd UnitTesting/Pytest
pip install -r requirements.txt
pytest -v
```

**Result:** 12/12 tests passed (minimum required: 10).

## Coverage Summary

| Function | Positive | Negative | Boundary | Edge |
|---|---|---|---|---|
| Email validation (JS & Py) | ✅ | ✅ | ✅ (Py) | — |
| Password strength check (JS) | ✅ | ✅ | ✅ | — |
| Password match check (JS) | ✅ | ✅ | — | — |
| Full name sanitization (JS) | ✅ | ✅ | ✅ | — |
| URL validation (JS & Py) | ✅ | ✅ | — | — |
| Empty chat message check (JS) | — | — | — | ✅ |
| Citation formatting (JS) | ✅ | — | — | ✅ |
| Duplicate URL detection (JS) | ✅ | ✅ | — | — |
| Text chunking / indexing (Py) | ✅ | — | ✅ | — |
| Password hashing/verification (Py) | ✅ | ✅ | — | — |
| Input sanitization / XSS (Py) | ✅ | ✅ | — | — |

Every category the assignment requires — **positive, negative, boundary, edge** —
is represented at least once in each suite (Jest and Pytest independently).
