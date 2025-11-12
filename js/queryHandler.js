/**
 * Query processing and filtering
 */

import { CONFIG, ELEMENT_IDS } from "./config.js";
import { getElement, debounce } from "./utils.js";

export class QueryHandler {
  constructor(dataLoader, onFilterComplete) {
    this.dataLoader = dataLoader;
    this.onFilterComplete = onFilterComplete;
    this.queryBox = null;
    this.errorDiv = null;
  }

  /**
   * Initialize query handler and setup event listeners
   */
  initialize() {
    this.queryBox = getElement(ELEMENT_IDS.QUERY_BOX);
    this.errorDiv = getElement(ELEMENT_IDS.QUERY_ERROR);

    // Setup debounced filter on input
    const debouncedFilter = debounce(() => {
      this.filter();
    }, CONFIG.QUERY_DEBOUNCE_MS);

    this.queryBox.addEventListener("input", debouncedFilter);
  }

  /**
   * Execute a filter query
   */
  filter() {
    const query = this.queryBox.value.trim();
    this.clearError();
    this.dataLoader.filter(query);
  }

  /**
   * Set the query text and trigger a filter
   * @param {string} query - Query expression
   */
  setQuery(query) {
    this.queryBox.value = query;
    this.filter();
  }

  /**
   * Reset the query and clear errors
   */
  resetQuery() {
    this.queryBox.value = "";
    this.clearError();
    this.filter();
  }

  /**
   * Display an error message
   * @param {string} error - Error message
   */
  showError(error) {
    this.errorDiv.textContent = `Query error: ${error}`;
    this.errorDiv.style.display = "block";
  }

  /**
   * Clear any displayed error
   */
  clearError() {
    this.errorDiv.textContent = "";
    this.errorDiv.style.display = "none";
  }

  /**
   * Get the current query text
   * @returns {string} Current query
   */
  getQuery() {
    return this.queryBox.value.trim();
  }
}
