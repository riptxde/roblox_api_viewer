/**
 * Virtual scrolling logic
 */

import { CONFIG, ELEMENT_IDS } from "./config.js";
import { getElement } from "./utils.js";
import { renderBatch } from "./renderer.js";

export class VirtualScroller {
  constructor() {
    this.filteredResults = [];
    this.currentlyRendered = 0;
    this.isLoadingMore = false;
    this.observer = null;
  }

  /**
   * Set the filtered results and reset rendering state
   * @param {Array} results - Array of filtered results
   */
  setResults(results) {
    this.filteredResults = results;
    this.currentlyRendered = 0;
  }

  /**
   * Render the next batch of items
   */
  renderNextBatch() {
    if (
      this.isLoadingMore ||
      this.currentlyRendered >= this.filteredResults.length
    ) {
      return;
    }

    this.isLoadingMore = true;
    const resultsDiv = getElement(ELEMENT_IDS.RESULTS);

    // Calculate batch range
    const start = this.currentlyRendered;
    const end = Math.min(
      start + CONFIG.ITEMS_PER_BATCH,
      this.filteredResults.length,
    );

    // Render batch
    const batch = this.filteredResults.slice(start, end);
    renderBatch(batch, resultsDiv);

    this.currentlyRendered = end;
    this.isLoadingMore = false;

    // Show loading indicator if more items available
    this.updateLoadingIndicator();
  }

  /**
   * Update the loading indicator
   */
  updateLoadingIndicator() {
    let indicator = document.getElementById(ELEMENT_IDS.LOADING_INDICATOR);
    const resultsDiv = getElement(ELEMENT_IDS.RESULTS);

    if (this.currentlyRendered < this.filteredResults.length) {
      if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = ELEMENT_IDS.LOADING_INDICATOR;
        indicator.className = "loading-indicator";
        resultsDiv.appendChild(indicator);
      }
      indicator.textContent = `Showing ${this.currentlyRendered} of ${this.filteredResults.length} results. Scroll to load more...`;
    } else if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Setup infinite scroll with Intersection Observer and scroll event
   */
  setupInfiniteScroll() {
    const resultsDiv = getElement(ELEMENT_IDS.RESULTS);

    // Intersection Observer for detecting when results container is visible
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            this.currentlyRendered < this.filteredResults.length
          ) {
            this.renderNextBatch();
          }
        });
      },
      {
        root: null,
        rootMargin: CONFIG.SCROLL_ROOT_MARGIN,
        threshold: CONFIG.SCROLL_INTERSECTION_THRESHOLD,
      },
    );

    this.observer.observe(resultsDiv);

    // Also trigger on scroll near bottom
    window.addEventListener("scroll", () => {
      const scrollPercent =
        (window.innerHeight + window.scrollY) /
        document.documentElement.scrollHeight;
      if (scrollPercent > CONFIG.SCROLL_THRESHOLD) {
        this.renderNextBatch();
      }
    });
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
