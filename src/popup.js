import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM loaded - initializing Ambient Support popup");

  // Initialize Mellowtel
  const configKey = (await getConfigKey()).toString();

  const mellowtel = new Mellowtel(configKey, {
    disableLogs: DISABLE_LOGS_MELLOWTEL,
  });

  // Get DOM elements
  const supportDeveloperToggle = document.getElementById("supportDeveloperToggle");
  const messageElement = document.getElementById("supportMessage");
  const toggleLabel = document.getElementById("toggleLabel");
  const plantGraphic = document.getElementById("plantGraphic");

  // Create background particles
  createBackgroundParticles();

  // Try to get the variable name (default to "the network" if not found)
  // For extensions, we'll use chrome.storage
  chrome.storage.local.get(['supportVariable'], function(result) {
    const variableName = result.supportVariable || 'the network';

    // Initialize toggle from Mellowtel opt-in status
    initializeToggleState(mellowtel, variableName);
  });

  // Setup Mellowtel settings link event
  document
      .getElementById("mellowtelOptOutSettings")
      .addEventListener("click", async () => {
        let settingsLink = await mellowtel.generateSettingsLink();
        settingsLink += "&ambient_support=true";
        window.open(settingsLink, "_blank");
      });

  // Add event listener for toggle changes
  supportDeveloperToggle.addEventListener("change", async (e) => {
    // Get current variable name
    chrome.storage.local.get(['supportVariable'], async function(result) {
      const variableName = result.supportVariable || 'the network';

      if (e.target.checked) {
        console.log("Opting in!");
        await mellowtel.optIn();
        await mellowtel.start();
        updateSupportMessage(true, variableName);
      } else {
        console.log("Opting out!");
        await mellowtel.optOut();
        updateSupportMessage(false, variableName);
      }

      // Save toggle state to storage
      chrome.storage.local.set({'ambientSupportEnabled': e.target.checked});
    });
  });
});

// Initialize toggle state based on Mellowtel status
async function initializeToggleState(mellowtel, variableName) {
  const toggle = document.getElementById("supportDeveloperToggle");
  const isOptedIn = await mellowtel.getOptInStatus();

  toggle.checked = isOptedIn;
  updateSupportMessage(isOptedIn, variableName);

  // Store current status
  chrome.storage.local.set({'ambientSupportEnabled': isOptedIn});
}

// Function to update message based on toggle state
function updateSupportMessage(isSupporting, variableName) {
  const messageElement = document.getElementById("supportMessage");
  const toggleLabel = document.getElementById("toggleLabel");
  const plantGraphic = document.getElementById("plantGraphic");

  if (isSupporting) {
    messageElement.textContent = `Supporting ${variableName} while you browse...`;
    messageElement.classList.remove('inactive');
    toggleLabel.textContent = 'Thanks for the support';
    toggleLabel.classList.remove('inactive');
    plantGraphic.classList.remove('inactive');
  } else {
    messageElement.textContent = `You are not supporting ${variableName}`;
    messageElement.classList.add('inactive');
    toggleLabel.textContent = 'Support inactivated';
    toggleLabel.classList.add('inactive');
    plantGraphic.classList.add('inactive');
  }
}

// Create floating particles for ambient animation
function createBackgroundParticles() {
  const container = document.getElementById('animationContainer');
  const colors = ['#a5d6a7', '#81c784', '#66bb6a', '#c8e6c9'];

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.classList.add('bg-particle');

    // Random size between 10 and 40px
    const size = Math.floor(Math.random() * 30) + 10;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random position
    particle.style.left = Math.floor(Math.random() * 100) + '%';
    particle.style.top = Math.floor(Math.random() * 100) + '%';

    // Random color
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Random opacity
    particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();

    // Add animation
    const duration = Math.floor(Math.random() * 20) + 10;
    particle.style.animation = `float ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = Math.floor(Math.random() * 10) + 's';

    container.appendChild(particle);
  }
}