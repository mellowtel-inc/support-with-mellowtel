import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";

document.addEventListener("DOMContentLoaded", async () => {
  const supportDeveloperToggle = document.getElementById(
    "supportDeveloperToggle",
  );
  const mellowtel = new Mellowtel("54584498", {
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

  document.getElementById("requestCounter").innerText = "";

  // let settingsLink = await m.generateSettingsLink();
  document
    .getElementById("mellowtelOptOutSettings")
    .addEventListener("click", async () => {
      // open settings page
      await mellowtel.openUserSettingsInPopupWindow();
    });
});
