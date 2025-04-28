// import sendMail from "./sendMail.js";

// const connectButton = document.getElementById("connect");
// const statusDiv = document.getElementById("status");
// const errorDiv = document.getElementById("error");
// const mapDiv = document.getElementById("map");
// const loadingSpinner = document.getElementById("loading");

// let device;
// let map;
// let marker;
// let watchId = null;
// let storedLocation = null;
// let gpsTrackingActive = false;

// // Saved Contacts
// let savedContacts = ["sweta.rajak@codeclouds.co.in", "esunny.maiti@gmail.com"];
// // Show Loading Spinner
// const showLoading = (show) => {
//   loadingSpinner.style.display = show ? "block" : "none";
// };

// // Initialize Google Map
// const initializeMap = (latitude, longitude, accuracy) => {
//   const location = { lat: latitude, lng: longitude };

//   if (!map) {
//     map = new google.maps.Map(mapDiv, {
//       center: location,
//       zoom: 15,
//     });
//     marker = new google.maps.Marker({
//       position: location,
//       map: map,
//     });
//   } else {
//     map.setCenter(location);
//     marker.setPosition(location);
//   }

//   if (accuracy) {
//     const circle = new google.maps.Circle({
//       map: map,
//       radius: accuracy,
//       fillColor: "#90EE90",
//       fillOpacity: 0.2,
//       strokeColor: "#90EE90",
//       strokeOpacity: 0.5,
//     });
//     circle.bindTo("center", marker, "position");
//   }
// };

// const safeModeBtn = document.getElementById("safeModeBtn");
// let safeMode = false;

// safeModeBtn.addEventListener("click", () => {
//   safeMode = !safeMode;
//   safeModeBtn.textContent = `Safe Mode: ${safeMode ? "ON" : "OFF"}`;
//   safeModeBtn.classList.toggle("active", safeMode);
//   safeModeBtn.setAttribute("aria-pressed", safeMode);
//   console.log("Safe Mode is now", safeMode ? "ON" : "OFF");
// });

// // Send Notification

// const sendNotification = (message) => {
//   if (safeMode) return;

//   if (!("Notification" in window)) {
//     console.error("This browser does not support desktop notification");
//     return;
//   }

//   if (Notification.permission === "granted") {
//     new Notification(message);
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         new Notification(message);
//       } else {
//         console.warn("Notification permission denied.");
//       }
//     });
//   }
// };

// // Start GPS Tracking
// const startGPSTracking = () => {
//   //showLoading(true);

//   if (navigator.geolocation) {
//     watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude, accuracy } = position.coords;
//         storedLocation = { latitude, longitude };
//         initializeMap(latitude, longitude, accuracy);
//         //showLoading(false);
//       },
//       (error) => {
//         errorDiv.textContent = `Unable to retrieve location: ${error.message}`;
//         //showLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   } else {
//     errorDiv.textContent = "Geolocation is not supported by your browser.";
//     //showLoading(false);
//   }
// };

// // Stop GPS Tracking
// const stopGPSTracking = () => {
//   if (watchId !== null) {
//     navigator.geolocation.clearWatch(watchId);
//     watchId = null;
//   }
// };

// // Alarm Sound
// const alarmSound = new Audio("mixkit-facility-alarm-sound-999.mp3");

// const playAlarmSound = () => {
//   if (safeMode) return;
//   alarmSound.currentTime = 0;
//   alarmSound.play().catch((error) => {
//     console.error("Error playing alarm sound:", error);
//   });
// };

// // Connect to Smart Wallet
// connectButton.addEventListener("click", async () => {
//   try {
//     // showLoading(true);

//     device = await navigator.bluetooth.requestDevice({
//       acceptAllDevices: true,
//       optionalServices: ["battery_service"],
//     });

//     const server = await device.gatt.connect();
//     statusDiv.style.display = "block";
//     statusDiv.textContent = "Connected to Smart Wallet";

//     if (!gpsTrackingActive) {
//       startGPSTracking();
//       gpsTrackingActive = true;
//     }

//     // Send last Location
//     function sendLastLocation() {
//       const subject = "Wallet Lost - Last known Location";
//       const message = `Hey! The last known location of the wallet is: ${storedLocation}`;
//       savedContacts.forEach(async (contact) => {
//         try {
//           await sendMail(contact, subject, message);
//         } catch (error) {
//           console.error(`Failed to send email to ${contact}:`, error);
//         }
//       });
//     }

//     device.ongattserverdisconnected = () => {
//       playAlarmSound();
//       sendNotification("Smart Wallet Bluetooth connection lost!");
//       stopGPSTracking();

//       setTimeout(() => {
//         sendLastLocation();
//       }, 5000);
//       statusDiv.style.display = "none";
//     };
//   } catch (error) {
//     errorDiv.textContent = `Connection failed: ${error.message}`;
//   } finally {
//     showLoading(false);
//   }
// });

// script.js

const connectButton = document.getElementById("connect");
const statusDiv = document.getElementById("status");
const errorDiv = document.getElementById("error");
const mapDiv = document.getElementById("map");

let device;
let map;
let marker;
let watchId = null;
let storedLocation = null;
let gpsTrackingActive = false;

// Saved Contacts
let savedContacts = [
  "sweta.rajak@codeclouds.co.in",
  "esunny.maiti@gmail.com"
];

// Initialize Google Map
const initializeMap = (latitude, longitude, accuracy) => {
  const location = { lat: latitude, lng: longitude };

  if (!map) {
    map = new google.maps.Map(mapDiv, {
      center: location,
      zoom: 15,
    });
    marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  } else {
    map.setCenter(location);
    marker.setPosition(location);
  }

  if (accuracy) {
    const circle = new google.maps.Circle({
      map: map,
      radius: accuracy,
      fillColor: "#90EE90",
      fillOpacity: 0.2,
      strokeColor: "#90EE90",
      strokeOpacity: 0.5,
    });
    circle.bindTo("center", marker, "position");
  }
};

// Safe Mode Button
const safeModeBtn = document.getElementById("safeModeBtn");
let safeMode = false;

safeModeBtn.addEventListener("click", () => {
  safeMode = !safeMode;
  safeModeBtn.textContent = `Safe Mode: ${safeMode ? "ON" : "OFF"}`;
  safeModeBtn.classList.toggle("active", safeMode);
  safeModeBtn.setAttribute("aria-pressed", safeMode);
});

// Notifications
const sendNotification = (message) => {
  if (safeMode) return;

  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
};

// GPS Tracking
const startGPSTracking = () => {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        storedLocation = { latitude, longitude };
        initializeMap(latitude, longitude, accuracy);
      },
      (error) => {
        errorDiv.textContent = `Unable to retrieve location: ${error.message}`;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    errorDiv.textContent = "Geolocation is not supported by your browser.";
  }
};

const stopGPSTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
};

// Alarm Sound
const alarmSound = new Audio("mixkit-facility-alarm-sound-999.mp3");

const playAlarmSound = () => {
  if (safeMode) return;
  alarmSound.currentTime = 0;
  alarmSound.play().catch((error) => {
    console.error("Error playing alarm sound:", error);
  });
};

// Connect to Smart Wallet
connectButton.addEventListener("click", async () => {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["battery_service"],
    });

    const server = await device.gatt.connect();
    statusDiv.style.display = "block";
    statusDiv.textContent = "Connected to Smart Wallet";

    if (!gpsTrackingActive) {
      startGPSTracking();
      gpsTrackingActive = true;
    }

    device.addEventListener('gattserverdisconnected', () => {
      console.log("Device disconnected!");
      playAlarmSound();
      sendNotification("Smart Wallet Bluetooth connection lost!");
      stopGPSTracking();

      setTimeout(() => {
        sendLastLocation();
      }, 5000);

      statusDiv.style.display = "none";
    });

  } catch (error) {
    errorDiv.textContent = `Connection failed: ${error.message}`;
  }
});

// Sending Last Location
async function sendLastLocation() {
  if (!storedLocation) {
    console.warn("No stored location to send.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/send-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contacts: savedContacts,
        location: storedLocation
      }),
    });

    if (response.ok) {
      console.log("Location sent successfully to server!");
    } else {
      console.error("Failed to send location to server.");
    }
  } catch (error) {
    console.error("Error sending location:", error);
  }
}
