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

  supportDeveloperToggle.checked = await mellowtel.getOptInStatus();

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
      // generate settings link
      let settingsLink = await mellowtel.generateSettingsLink();
      // add + &ambient_support=true to the settings link
      settingsLink += "&ambient_support=true";
      // open settings link in new tab
      window.open(settingsLink, "_blank");
    });

  createParticles();

  // Connect stop button to toggle
  document
    .getElementById("stopSupportBtn")
    .addEventListener("click", function () {
      const toggle = document.getElementById("supportDeveloperToggle");
      toggle.checked = false;
      toggle.dispatchEvent(new Event("change"));
    });
});

// Create floating particles for ambient animation
function createParticles() {
  const container = document.querySelector(".animation-container");
  const colors = ["#a5d6a7", "#81c784", "#66bb6a", "#c5e1a5", "#e6ee9c"];

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random properties
    const size = Math.floor(Math.random() * 20) + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.floor(Math.random() * 100);
    const top = Math.floor(Math.random() * 100);
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;

    // Apply styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    container.appendChild(particle);
  }
}
