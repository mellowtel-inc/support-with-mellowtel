/**
 * Gets data from Chrome's local storage
 * @param {string} key - The key to retrieve
 * @param {boolean} extract_key - Whether to extract just the value (true) or return the whole result object (false)
 * @returns {Promise<any>} - Promise resolving to the retrieved data
 */
export function getLocalStorage(key, extract_key = false) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, function (result) {
      if (extract_key) {
        resolve(result[key]);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Sets data in Chrome's local storage
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 * @returns {Promise<boolean>} - Promise resolving to true when complete
 */
export function setLocalStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, function () {
      resolve(true);
    });
  });
}

/**
 * Deletes data from Chrome's local storage
 * @param {string[]} keys - Array of keys to remove
 * @returns {Promise<boolean>} - Promise resolving to true when complete
 */
export function deleteLocalStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(keys, function () {
      resolve(true);
    });
  });
}
