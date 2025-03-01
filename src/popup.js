import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";

document.addEventListener("DOMContentLoaded", async () => {
  const supportDeveloperToggle = document.getElementById(
    "supportDeveloperToggle",
  );
  const configKey = (await getConfigKey()).toString();
  const mellowtel = new Mellowtel(configKey, {
    disableLogs: DISABLE_LOGS_MELLOWTEL,
  });

  supportDeveloperToggle.checked = await m.getOptInStatus();

  supportDeveloperToggle.addEventListener("change", async (e) => {
    if (e.target.checked) {
      console.log("Opting in!");
      await mellowtel.optIn();
      await mellowtel.start();
    } else {
      console.log("Opting out!");
      await mellowtel.optOut();
    }
  });

  document
    .getElementById("mellowtelOptOutSettings")
    .addEventListener("click", async () => {
      // open settings page
      await mellowtel.openUserSettingsInPopupWindow();
    });
});
