/**
 * Checks if code is running in a service worker context
 * @returns {Promise<boolean>} Promise that resolves to true if in service worker, false otherwise
 */
export function isInSW() {
  return new Promise((resolve) => {
    try {
      chrome.declarativeNetRequest.getDynamicRules((rules) => {
        if (chrome.runtime.lastError) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      resolve(false);
    }
  });
}
