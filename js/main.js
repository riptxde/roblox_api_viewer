/**
 * Application initialization and coordination
 */

import { ELEMENT_IDS } from "./config.js";
import { formatUpdateTime, getElement } from "./utils.js";
import { DataLoader } from "./dataLoader.js";
import { QueryHandler } from "./queryHandler.js";
import { VirtualScroller } from "./virtualScroll.js";
import { updateStatsDisplay } from "./stats.js";
import {
  clearResults,
  renderNoResults,
  renderLoadingError,
} from "./renderer.js";

class RobloxAPIViewer {
  constructor() {
    this.dataLoader = new DataLoader();
    this.virtualScroller = new VirtualScroller();
    this.queryHandler = null;
  }

  /**
   * Handle filter results from the worker
   * @param {Array} results - Filtered results
   */
  handleFilterResults(results) {
    this.virtualScroller.setResults(results);
    clearResults();

    if (results.length === 0) {
      renderNoResults();
    } else {
      // Render first batch
      this.virtualScroller.renderNextBatch();
    }

    updateStatsDisplay(results);
  }

  /**
   * Handle filter errors
   * @param {string} error - Error message
   */
  handleFilterError(error) {
    this.queryHandler.showError(error);
    this.handleFilterResults([]);
  }

  /**
   * Update metadata display in the UI
   * @param {Object} metadata - Metadata object
   */
  updateMetadataDisplay(metadata) {
    getElement(ELEMENT_IDS.API_VERSION).textContent =
      metadata.version || "Unknown";
    getElement(ELEMENT_IDS.API_UPDATED).textContent = formatUpdateTime(
      metadata.updated || new Date().toISOString(),
    );
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      // Load data
      await this.dataLoader.loadData();

      // Update metadata display
      this.updateMetadataDisplay(this.dataLoader.getMetadata());

      // Setup data loader callbacks
      this.dataLoader.onFilterComplete = (results) =>
        this.handleFilterResults(results);
      this.dataLoader.onFilterError = (error) => this.handleFilterError(error);
      this.dataLoader.onInitComplete = () => {
        // Initial filter with empty query
        this.queryHandler.filter();
      };

      // Initialize worker
      this.dataLoader.initializeWorker();

      // Setup query handler
      this.queryHandler = new QueryHandler(this.dataLoader);
      this.queryHandler.initialize();

      // Setup virtual scrolling
      this.virtualScroller.setupInfiniteScroll();

      // Expose global functions for button onclick handlers
      window.setQuery = (query) => this.queryHandler.setQuery(query);
      window.resetQuery = () => this.queryHandler.resetQuery();
    } catch (error) {
      console.error("Error initializing application:", error);
      renderLoadingError(error.message);
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.dataLoader.destroy();
    this.virtualScroller.destroy();
  }
}

// Start the application when DOM is ready
const app = new RobloxAPIViewer();
app.initialize();
