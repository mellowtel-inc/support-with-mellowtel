import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./get_configuration_key";

let mellowtel;

(async () => {
  const configKey = (await getConfigKey()).toString();
  mellowtel = new Mellowtel(configKey, {
    disableLogs: DISABLE_LOGS_MELLOWTEL,
  });
  await mellowtel.initBackground();
})();

chrome.runtime.onInstalled.addListener(async function (details) {
  console.log("Extension Installed or Updated");
  // If you want to handle first install and updates differently
  if (details.reason === "install") {
    // call a function to handle a first install
    await mellowtel.generateAndOpenOptInLink();
  } else if (details.reason === "update") {
    // call a function to handle an update
    await mellowtel.generateAndOpenUpdateLink(true);
  }
});
