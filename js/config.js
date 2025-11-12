/**
 * Application configuration and constants
 */

export const CONFIG = {
  // Virtual scrolling
  ITEMS_PER_BATCH: 50,
  SCROLL_THRESHOLD: 0.8,
  SCROLL_ROOT_MARGIN: "200px",
  SCROLL_INTERSECTION_THRESHOLD: 0.1,

  // Query debounce
  QUERY_DEBOUNCE_MS: 300,

  // API endpoints
  DATA_URL: "resources/roblox_api.msgpack",
  WORKER_URL: "js/worker.js",

  // External links
  API_BASE_URL: "https://robloxapi.github.io/ref",
};

export const ELEMENT_IDS = {
  QUERY_BOX: "queryBox",
  QUERY_ERROR: "queryError",
  RESULTS: "results",
  STATS: "stats",
  API_VERSION: "apiVersion",
  API_UPDATED: "apiUpdated",
  LOADING_INDICATOR: "loadingIndicator",
};

export const MESSAGE_TYPES = {
  INIT: "init",
  INIT_COMPLETE: "init_complete",
  FILTER: "filter",
  FILTER_COMPLETE: "filter_complete",
  FILTER_ERROR: "filter_error",
};
