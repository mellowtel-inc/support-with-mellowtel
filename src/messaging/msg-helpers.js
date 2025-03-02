/**
 * Send a message to the background script and await response
 * @param {Object} message - The message to send
 * @returns {Promise<any>} The response from the background script
 */
export function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(response);
    });
  });
}
