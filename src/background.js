import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";

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
