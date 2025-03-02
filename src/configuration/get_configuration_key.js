import {
  DEFAULT_CONFIG_KEY,
  KEY_SUPPORTED_USER_CONFIG,
  LAMBDA_URL,
} from "./constants";
import { getLocalStorage, setLocalStorage } from "../storage/storage-helpers";
import { isInSW } from "../helpers/helpers";
import { sendMessageToBackground } from "../messaging/msg-helpers";

/**
 * Gets the configuration key from Chrome storage, cookies, or Lambda, falling back to default
 * @returns {Promise<string>} The configuration key
 */
export function getConfigKey() {
  return new Promise(async (resolve) => {
    try {
      // Try Chrome storage first
      const storedConfig = await getLocalStorage(
        KEY_SUPPORTED_USER_CONFIG,
        true,
      );
      if (storedConfig && storedConfig.configuration_key) {
        resolve(storedConfig.configuration_key);
        return;
      }

      // Check if we're in a service worker (background) context
      if (await isInSW()) {
        // Direct execution - we have access to the cookies API
        const redirectKey = await getRedirectKeyFromCookies();
        if (redirectKey) {
          const configData = await fetchConfigFromLambda(redirectKey);
          if (configData && configData.configuration_key) {
            const dataToStore = {
              configuration_key: configData.configuration_key,
              icon: configData.icon || null,
              integration_id: configData.integration_id || null,
              name: configData.name || null,
            };
            await setLocalStorage(KEY_SUPPORTED_USER_CONFIG, dataToStore);
            return configData.configuration_key;
          }
        }
      } else {
        // Not in service worker - need to send message to background
        try {
          const response = await sendMessageToBackground({
            action: "getConfigKey",
          });
          if (response && response.configKey) {
            return response.configKey;
          }
        } catch (err) {
          console.error("Error communicating with background script:", err);
          // Fall through to default
        }
      }

      // Fall back to default
      resolve(DEFAULT_CONFIG_KEY);
    } catch (error) {
      console.error("Error getting config key:", error);
      resolve(DEFAULT_CONFIG_KEY);
    }
  });
}

/**
 * Gets the redirect key from mellowtel.com cookies
 * @returns {Promise<string|null>} The redirect key or null if not found
 */
function getRedirectKeyFromCookies() {
  return new Promise((resolve) => {
    chrome.cookies.get(
      {
        url: "https://mellowtel.com",
        name: "rk",
      },
      (cookie) => {
        if (chrome.runtime.lastError) {
          console.error("Error reading cookie:", chrome.runtime.lastError);
          resolve(null);
          return;
        }

        resolve(cookie ? cookie.value : null);
      },
    );
  });
}

/**
 * Fetches configuration data from Lambda using the redirect key
 * @param {string} redirectKey - The redirect key from cookies
 * @returns {Promise<Object|null>} The configuration data or null if error
 */
async function fetchConfigFromLambda(redirectKey) {
  try {
    const response = await fetch(
      `${LAMBDA_URL}?redirect_key=${redirectKey}`,
      {},
    );
    if (!response.ok) {
      throw new Error(`Lambda returned status ${response.status}`);
    }

    const data = await response.json();
    return data && data.configuration_key ? data : null;
  } catch (error) {
    console.error("Error fetching from Lambda:", error);
    return null;
  }
}
