/**
 * Data loading and worker management
 */

import { CONFIG, MESSAGE_TYPES } from "./config.js";

export class DataLoader {
  constructor() {
    this.worker = null;
    this.data = null;
    this.isProcessing = false;
    this.onFilterComplete = null;
    this.onFilterError = null;
    this.onInitComplete = null;
  }

  /**
   * Load data from the API MessagePack file
   * @returns {Promise<Object>} Loaded data
   */
  async loadData() {
    try {
      const response = await fetch(CONFIG.DATA_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to load roblox_api.msgpack: ${response.status} ${response.statusText}`,
        );
      }
      const arrayBuffer = await response.arrayBuffer();

      // Decode MessagePack data
      // Using msgpack.min.js library loaded in index.html
      this.data = msgpack.deserialize(new Uint8Array(arrayBuffer));
      console.log("Data loaded successfully", this.data);
      console.log("Classes count:", this.data?.classes?.length);
      console.log("Enums count:", this.data?.enums?.length);
      return this.data;
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  /**
   * Initialize the web worker
   */
  initializeWorker() {
    this.worker = new Worker(CONFIG.WORKER_URL);

    this.worker.onmessage = (e) => {
      const { type, results, error } = e.data;

      switch (type) {
        case MESSAGE_TYPES.INIT_COMPLETE:
          console.log("Worker initialized");
          if (this.onInitComplete) {
            this.onInitComplete();
          }
          break;

        case MESSAGE_TYPES.FILTER_COMPLETE:
          this.isProcessing = false;
          if (this.onFilterComplete) {
            this.onFilterComplete(results);
          }
          break;

        case MESSAGE_TYPES.FILTER_ERROR:
          this.isProcessing = false;
          if (this.onFilterError) {
            this.onFilterError(error);
          }
          break;
      }
    };

    this.worker.onerror = (error) => {
      console.error("Worker error:", error);
      this.isProcessing = false;
      if (this.onFilterError) {
        this.onFilterError(`Worker error: ${error.message}`);
      }
    };

    // Initialize worker with data
    if (this.data) {
      this.worker.postMessage({ type: MESSAGE_TYPES.INIT, data: this.data });
    }
  }

  /**
   * Send a filter query to the worker
   * @param {string} query - Query expression
   */
  filter(query) {
    if (this.isProcessing) {
      return; // Prevent multiple simultaneous queries
    }

    this.isProcessing = true;

    try {
      this.worker.postMessage({ type: MESSAGE_TYPES.FILTER, query });
    } catch (error) {
      this.isProcessing = false;
      if (this.onFilterError) {
        this.onFilterError(`Filter error: ${error.message}`);
      }
    }
  }

  /**
   * Get metadata from loaded data
   * @returns {Object} Metadata object
   */
  getMetadata() {
    return this.data?.metadata || {};
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
