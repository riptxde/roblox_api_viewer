/**
 * Utility functions
 */

/**
 * Format a date/time string to a human-readable format with relative time
 * @param {string} dateTimeString - ISO date string
 * @returns {string} Formatted date with relative time
 */
export function formatUpdateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const now = new Date();

  // Calculate time difference
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  // Format as readable date/time
  const dateStr = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Create "ago" string
  let agoStr = "";
  if (diffDays > 0) {
    agoStr = `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    if (diffHours > 0) {
      agoStr += ` and ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    }
  } else if (diffHours > 0) {
    agoStr = `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  } else {
    agoStr = "less than an hour";
  }

  return `${dateStr} (${agoStr} ago)`;
}

/**
 * Create a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement} Element
 * @throws {Error} If element not found
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with ID "${id}" not found`);
  }
  return element;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
