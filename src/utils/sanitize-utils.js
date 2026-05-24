export function sanitizeText(text) {
  if (!text) {
    return "";
  }

  let cleaned = String(text);

  cleaned = cleaned.replace(/<[^>]*>/g, "");
  cleaned = cleaned.replace(/&/g, "&amp;");
  cleaned = cleaned.replace(/</g, "&lt;");
  cleaned = cleaned.replace(/>/g, "&gt;");
  cleaned = cleaned.replace(/"/g, "&quot;");
  cleaned = cleaned.trim();

  return cleaned;
}

export function sanitizeLongText(text) {
  if (!text) {
    return "";
  }

  let cleaned = String(text);

  cleaned = cleaned.replace(/<[^>]*>/g, "");
  cleaned = cleaned.replace(/&/g, "&amp;");
  cleaned = cleaned.replace(/</g, "&lt;");
  cleaned = cleaned.replace(/>/g, "&gt;");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}