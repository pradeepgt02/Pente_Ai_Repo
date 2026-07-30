/**
 * webmindUtils.js
 * Reusable frontend business-logic functions for WebMind
 * (Signup/Login validation, chat input handling, citation formatting)
 */

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates password strength.
 * Rules: minimum 8 characters, at least one letter and one number.
 * @param {string} password
 * @returns {{ valid: boolean, reason: string }}
 */
function isStrongPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    return { valid: false, reason: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, reason: "Password must be at least 8 characters long." };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { valid: false, reason: "Password must contain both letters and numbers." };
  }
  return { valid: true, reason: "" };
}

/**
 * Confirms that password and confirmPassword match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean}
 */
function passwordsMatch(password, confirmPassword) {
  return typeof password === "string" &&
    typeof confirmPassword === "string" &&
    password === confirmPassword;
}

/**
 * Sanitizes and validates a Full Name field for signup.
 * Rejects empty, whitespace-only, or emoji/non-alphabetic-only names.
 * @param {string} name
 * @returns {{ valid: boolean, sanitized: string, reason: string }}
 */
function sanitizeFullName(name) {
  if (typeof name !== "string") {
    return { valid: false, sanitized: "", reason: "Full Name is required" };
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, sanitized: "", reason: "Full Name is required" };
  }
  // Reject names with no letters at all (e.g., emoji-only, symbols-only)
  const hasLetter = /[a-zA-Z]/.test(trimmed);
  if (!hasLetter) {
    return { valid: false, sanitized: trimmed, reason: "Full Name must contain letters" };
  }
  if (trimmed.length > 100) {
    return { valid: false, sanitized: trimmed.slice(0, 100), reason: "Full Name exceeds maximum length" };
  }
  return { valid: true, sanitized: trimmed, reason: "" };
}

/**
 * Validates that a URL is well-formed (used by the Add Website form).
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  if (typeof url !== "string" || url.trim().length === 0) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}

/**
 * Checks whether a chat message is empty/blank and should be blocked from sending.
 * @param {string} message
 * @returns {boolean} true if the message is empty/whitespace-only
 */
function isEmptyMessage(message) {
  return typeof message !== "string" || message.trim().length === 0;
}

/**
 * Formats a citation object for display in the "Retrieved References" card.
 * @param {{ title: string, section?: string, url?: string }} citation
 * @returns {string}
 */
function formatCitation(citation) {
  if (!citation || typeof citation.title !== "string" || citation.title.trim().length === 0) {
    return "Untitled Source";
  }
  const section = citation.section && citation.section.trim().length > 0 ? citation.section.trim() : "N/A";
  return `${citation.title.trim()} (Section: ${section})`;
}

/**
 * Determines whether a knowledge base URL is a duplicate of an already-indexed one.
 * Normalizes trailing slashes and protocol/host casing before comparing.
 * @param {string[]} existingUrls
 * @param {string} newUrl
 * @returns {boolean}
 */
function isDuplicateWebsite(existingUrls, newUrl) {
  if (!Array.isArray(existingUrls) || typeof newUrl !== "string") return false;
  const normalize = (u) => u.trim().toLowerCase().replace(/\/+$/, "");
  const target = normalize(newUrl);
  return existingUrls.some((u) => normalize(u) === target);
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  passwordsMatch,
  sanitizeFullName,
  isValidUrl,
  isEmptyMessage,
  formatCitation,
  isDuplicateWebsite,
};
