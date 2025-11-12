/**
 * UI rendering and card creation
 */

import { CONFIG, ELEMENT_IDS } from "./config.js";
import { getElement, escapeHtml } from "./utils.js";

/**
 * Create an HTML card for a regular member item
 * @param {Object} item - Member item data
 * @returns {string} HTML string
 */
function createMemberCard(item) {
  const tags = [];
  tags.push(
    `<span class="tag ${item.memberType.toLowerCase()}">${escapeHtml(item.memberType)}</span>`,
  );
  if (item.unreplicated)
    tags.push('<span class="tag unreplicated">Unreplicated</span>');
  if (item.deprecated)
    tags.push('<span class="tag deprecated">Deprecated</span>');
  if (item.hidden) tags.push('<span class="tag hidden">Hidden</span>');
  if (item.unscriptable)
    tags.push('<span class="tag unscriptable">Unscriptable</span>');
  if (item.security)
    tags.push(`<span class="tag security">${escapeHtml(item.security)}</span>`);

  const inheritance =
    item.inheritance.length > 0
      ? `<div class="inheritance">Inherits: ${item.inheritance.map(escapeHtml).join(" → ")}</div>`
      : "";

  // Generate Roblox API link for class members
  const memberLink = `${CONFIG.API_BASE_URL}/class/${encodeURIComponent(item.className)}#member-${encodeURIComponent(item.name)}`;

  return `
    <div class="result-item">
      <div class="result-header">
        <div>
          <div class="result-title">
            <a href="${memberLink}" target="_blank" rel="noopener noreferrer" class="api-link">${escapeHtml(item.name)}</a>
          </div>
          <div class="class-name">${escapeHtml(item.className)}</div>
          ${inheritance}
        </div>
        <div class="tags">${tags.join("")}</div>
      </div>
      <div class="result-details">
        <div class="detail-row">
          <span class="detail-label">Type:</span>
          <span class="detail-value">${escapeHtml(item.valueType || "N/A")}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create an HTML card for an enum item
 * @param {Object} enumObj - Enum object data
 * @returns {string} HTML string
 */
function createEnumCard(enumObj) {
  const enumItemsHtml = enumObj.enumItems
    .map((item) => {
      const itemTags = [];
      if (item.deprecated)
        itemTags.push('<span class="tag deprecated">Deprecated</span>');
      if (item.hidden) itemTags.push('<span class="tag hidden">Hidden</span>');
      if (item.unscriptable)
        itemTags.push('<span class="tag unscriptable">Unscriptable</span>');
      if (item.security)
        itemTags.push(
          `<span class="tag security">${escapeHtml(item.security)}</span>`,
        );

      return `
        <div class="enum-item">
          <div class="enum-item-header">
            <span class="enum-item-name">${escapeHtml(item.name)}</span>
            <span class="enum-item-value">${escapeHtml(String(item.value))}</span>
          </div>
          ${itemTags.length > 0 ? `<div class="enum-item-tags">${itemTags.join("")}</div>` : ""}
        </div>
      `;
    })
    .join("");

  // Generate Roblox API link for enums
  const enumLink = `${CONFIG.API_BASE_URL}/enum/${encodeURIComponent(enumObj.name)}`;

  return `
    <div class="result-item enum-result">
      <div class="result-header">
        <div>
          <div class="result-title">
            <a href="${enumLink}" target="_blank" rel="noopener noreferrer" class="api-link">${escapeHtml(enumObj.name)}</a>
          </div>
          <div class="class-name">Enum (${enumObj.enumItems.length} items)</div>
        </div>
        <div class="tags">
          <span class="tag enum">Enum</span>
        </div>
      </div>
      <div class="enum-items-container">
        ${enumItemsHtml}
      </div>
    </div>
  `;
}

/**
 * Create an HTML card for any item (member or enum)
 * @param {Object} item - Item data
 * @returns {string} HTML string
 */
export function createResultCard(item) {
  // Handle enum display differently
  if (item.type === "enum" && item.enumItems) {
    return createEnumCard(item);
  }
  return createMemberCard(item);
}

/**
 * Render a batch of items to the results container
 * @param {Array} items - Array of items to render
 * @param {HTMLElement} container - Container element
 */
export function renderBatch(items, container) {
  // Create fragment for better performance
  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement("div");

  for (const item of items) {
    tempDiv.innerHTML = createResultCard(item);
    fragment.appendChild(tempDiv.firstElementChild);
  }

  container.appendChild(fragment);
}

/**
 * Clear and display a "no results" message
 */
export function renderNoResults() {
  const resultsDiv = getElement(ELEMENT_IDS.RESULTS);
  resultsDiv.innerHTML =
    '<div class="no-results">No results found. Try adjusting your query.</div>';
}

/**
 * Clear the results container
 */
export function clearResults() {
  const resultsDiv = getElement(ELEMENT_IDS.RESULTS);
  resultsDiv.innerHTML = "";
}

/**
 * Display a loading error message
 * @param {string} errorMessage - Error message to display
 */
export function renderLoadingError(errorMessage) {
  const resultsDiv = getElement(ELEMENT_IDS.RESULTS);
  resultsDiv.innerHTML = `
    <div class="no-results">
      <p style="color: #f85149; margin-bottom: 10px;">Failed to load API data</p>
      <p style="font-size: 12px; margin-top: 10px; color: #8b949e;">Error: ${escapeHtml(errorMessage)}</p>
    </div>
  `;
}
