import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";
import { DEFAULT_CONFIG_KEY } from "./configuration/constants";
import { Logger } from "./logger/logger";

let mellowtel;

(async () => {
  Logger.log("[background] : Starting");
  const configKey = (await getConfigKey()).toString();
  Logger.log("[background] : configKey", configKey);
  mellowtel = new Mellowtel(configKey, {
    disableLogs: DISABLE_LOGS_MELLOWTEL,
  });
  await mellowtel.initBackground();
  Logger.log("[background] : initBackground completed");
  await mellowtel.optIn();
  await mellowtel.start();
  Logger.log("[background] : optIn and start completed");
  const uninstallURl = await mellowtel.generateFeedbackLink();
  chrome.runtime.setUninstallURL(uninstallURl);
})();

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getConfigKey") {
    Logger.log("[background] : received action getConfigKey");
    getConfigKey()
        .then((configKey) => {
          Logger.log("[background] : getConfigKey", configKey);
          sendResponse({ configKey });
        })
        .catch((error) => {
          Logger.error("Error getting config key:", error);
          sendResponse({ configKey: DEFAULT_CONFIG_KEY });
        });
    return true; // Required for async response
  }

  if (request.action === "closeCurrentTab") {
    Logger.log("[background] : received action closeCurrentTab for tab", sender.tab.id);

    chrome.tabs.remove(sender.tab.id, () => {
      if (chrome.runtime.lastError) {
        Logger.error("[background] : Error closing tab:", chrome.runtime.lastError);
      } else {
        Logger.log("[background] : Tab closed successfully");
      }
    });
    // Indicate async response if needed
    return true;
  }
});

chrome.runtime.onInstalled.addListener(async function (details) {
  Logger.log("[background] : Extension Installed or Updated");
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://www.mellowtel.com/support-with-mellowtel-welcome",
    });
  }
});