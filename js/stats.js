/**
 * Statistics calculation and display
 */

import { ELEMENT_IDS } from "./config.js";
import { getElement } from "./utils.js";

/**
 * Calculate statistics from filtered items
 * @param {Array} items - Array of filtered items
 * @returns {Object} Statistics object
 */
export function calculateStats(items) {
  const stats = {
    total: items.length,
    unreplicated: 0,
    deprecated: 0,
    hidden: 0,
    unscriptable: 0,
  };

  items.forEach((item) => {
    if (item.type === "enum" && item.enumItems) {
      // For enums, count items with these properties
      item.enumItems.forEach((enumItem) => {
        if (enumItem.unreplicated) stats.unreplicated++;
        if (enumItem.deprecated) stats.deprecated++;
        if (enumItem.hidden) stats.hidden++;
        if (enumItem.unscriptable) stats.unscriptable++;
      });
    } else {
      // For regular members
      if (item.unreplicated) stats.unreplicated++;
      if (item.deprecated) stats.deprecated++;
      if (item.hidden) stats.hidden++;
      if (item.unscriptable) stats.unscriptable++;
    }
  });

  return stats;
}

/**
 * Update the stats display in the DOM
 * @param {Array} items - Array of filtered items
 */
export function updateStatsDisplay(items) {
  const stats = calculateStats(items);
  const statsDiv = getElement(ELEMENT_IDS.STATS);

  statsDiv.innerHTML = `
    <div class="stat-item">Total Results: <span class="stat-value">${stats.total}</span></div>
    <div class="stat-item">Unreplicated: <span class="stat-value">${stats.unreplicated}</span></div>
    <div class="stat-item">Deprecated: <span class="stat-value">${stats.deprecated}</span></div>
    <div class="stat-item">Hidden: <span class="stat-value">${stats.hidden}</span></div>
    <div class="stat-item">Unscriptable: <span class="stat-value">${stats.unscriptable}</span></div>
  `;
}
