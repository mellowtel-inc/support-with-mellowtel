import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";
import { DEFAULT_CONFIG_KEY } from "./configuration/constants";

let mellowtel;


(async () => {
  const configKey = (await getConfigKey()).toString();
  mellowtel = new Mellowtel(configKey, {
    disableLogs: DISABLE_LOGS_MELLOWTEL,
  });
  await mellowtel.initBackground();
  await mellowtel.optIn();
  await mellowtel.start();
})();

chrome.runtime.onInstalled.addListener(async function (details) {
  console.log("Extension Installed or Updated");
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://mellowtel.com/demo-ambient-support/",
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getConfigKey") {
    getConfigKey()
      .then((configKey) => {
        sendResponse({ configKey });
      })
      .catch((error) => {
        console.error("Error getting config key:", error);
        sendResponse({ configKey: DEFAULT_CONFIG_KEY });
      });
    return true; // Required for async response
  }
});
