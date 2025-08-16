import Mellowtel from "mellowtel-lite";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";
import { Logger } from "./logger/logger";

(async () => {
  Logger.log("[content_script] : starting");
  const configKey = (await getConfigKey()).toString();

  Logger.log("[content_script] : configKey retrieved", configKey);
  const mellowtel = new Mellowtel(configKey, {
    disableLogs: false // DISABLE_LOGS_MELLOWTEL,
  });
  Logger.log("[content_script] : mellowtel initialized");
  await mellowtel.initContentScript();
  Logger.log("[content_script] : ContentScript initialized");

  if (window.location.href.includes("mellowtel.com/") || window.location.href.includes("localhost:8080")) {
    Logger.log("[content_script] : on mellowtel.com/");
    Logger.log("[content_script] : let's start the waiting for the agree and close button");

    // Wait for DOM to be fully loaded
    const waitForElement = (selector) => {
      return new Promise((resolve) => {
        if (document.getElementById(selector)) {
          return resolve(document.getElementById(selector));
        }

        // Wait for document.body to be available
        if (!document.body) {
          document.addEventListener("DOMContentLoaded", () => {
            if (document.getElementById(selector)) {
              return resolve(document.getElementById(selector));
            }
            setupObserver();
          });
        } else {
          setupObserver();
        }

        function setupObserver() {
          const observer = new MutationObserver(() => {
            if (document.getElementById(selector)) {
              observer.disconnect();
              resolve(document.getElementById(selector));
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      });
    };

    const agreeAndCloseDemoPage = await waitForElement(
      "agree-and-close-demo-page",
    );

    Logger.log(
      "[content_script] : agreeAndCloseDemoPage",
      agreeAndCloseDemoPage,
    );

    if (agreeAndCloseDemoPage) {
      Logger.log("[content_script] : agreeAndCloseDemoPage found");
      agreeAndCloseDemoPage.addEventListener("click", async () => {
        Logger.log("[content_script] : Agree and close button clicked");
        // Send message to background script to close the current tab
        chrome.runtime.sendMessage({ action: "closeCurrentTab" }, (response) => {
          if (chrome.runtime.lastError) {
            Logger.error("[content_script] : Error sending message:", chrome.runtime.lastError);
          } else {
            Logger.log("[content_script] : Message sent successfully");
          }
        });
      });
    }
  }
})();
