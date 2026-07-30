/**
 * webmindUtils.test.js
 * Jest unit tests for WebMind frontend business-logic functions.
 * 15 tests covering positive, negative, and edge-case scenarios.
 */

const {
  isValidEmail,
  isStrongPassword,
  passwordsMatch,
  sanitizeFullName,
  isValidUrl,
  isEmptyMessage,
  formatCitation,
  isDuplicateWebsite,
} = require("./webmindUtils");

// ---------------------------------------------------------
// isValidEmail
// ---------------------------------------------------------
describe("isValidEmail", () => {
  test("[Positive] accepts a standard, well-formed email", () => {
    expect(isValidEmail("pradeep@example.com")).toBe(true);
  });

  test("[Negative] rejects an email missing the @ symbol", () => {
    expect(isValidEmail("plainaddress")).toBe(false);
  });
});

// ---------------------------------------------------------
// isStrongPassword
// ---------------------------------------------------------
describe("isStrongPassword", () => {
  test("[Positive] accepts a password with letters, numbers, and 8+ length", () => {
    expect(isStrongPassword("Test1234").valid).toBe(true);
  });

  test("[Negative] rejects a password with only letters (no numbers)", () => {
    const result = isStrongPassword("PasswordOnly");
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/letters and numbers/i);
  });
});

// ---------------------------------------------------------
// passwordsMatch
// ---------------------------------------------------------
describe("passwordsMatch", () => {
  test("[Positive] returns true when password and confirm password match", () => {
    expect(passwordsMatch("Test@1234", "Test@1234")).toBe(true);
  });

  test("[Negative] returns false when password and confirm password differ", () => {
    expect(passwordsMatch("Test@1234", "Test@5678")).toBe(false);
  });
});

// ---------------------------------------------------------
// sanitizeFullName
// ---------------------------------------------------------
describe("sanitizeFullName", () => {
  test("[Positive] accepts and trims a normal full name", () => {
    const result = sanitizeFullName("  Pradeep Kumar  ");
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBe("Pradeep Kumar");
  });

  test("[Negative] rejects an emoji-only name (no letters)", () => {
    const result = sanitizeFullName("😀🚀🔥");
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/must contain letters/i);
  });
});

// ---------------------------------------------------------
// isValidUrl
// ---------------------------------------------------------
describe("isValidUrl", () => {
  test("[Positive] accepts a valid https URL", () => {
    expect(isValidUrl("https://www.python.org")).toBe(true);
  });

  test("[Negative] rejects a malformed URL", () => {
    expect(isValidUrl("htp:/notaurl")).toBe(false);
  });
});

// ---------------------------------------------------------
// isEmptyMessage
// ---------------------------------------------------------
describe("isEmptyMessage", () => {
  test("[Edge] returns true for a whitespace-only message", () => {
    expect(isEmptyMessage("     ")).toBe(true);
  });
});

// ---------------------------------------------------------
// formatCitation
// ---------------------------------------------------------
describe("formatCitation", () => {
  test("[Positive] formats a citation with title and section", () => {
    const result = formatCitation({ title: "About Python | Python.org", section: "Overview" });
    expect(result).toBe("About Python | Python.org (Section: Overview)");
  });

  test("[Edge] falls back to 'N/A' when section is missing", () => {
    const result = formatCitation({ title: "PSF Grants Program" });
    expect(result).toBe("PSF Grants Program (Section: N/A)");
  });
});

// ---------------------------------------------------------
// isDuplicateWebsite
// ---------------------------------------------------------
describe("isDuplicateWebsite", () => {
  test("[Positive] detects an exact duplicate URL", () => {
    expect(isDuplicateWebsite(["https://www.python.org"], "https://www.python.org")).toBe(true);
  });

  test("[Negative] returns false for a genuinely new URL", () => {
    expect(isDuplicateWebsite(["https://www.python.org"], "https://www.wikipedia.org")).toBe(false);
  });
});
