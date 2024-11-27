const connectButton = document.getElementById('connect');
const statusDiv = document.getElementById('status');
const errorDiv = document.getElementById('error');
const mapDiv = document.getElementById('map');

let device;
let map;
let marker;
let watchId = null; // Variable to hold the watchPosition ID
let storedLocation = null;
let gpsTrackingActive = false;

// Initialize Google Map
const initializeMap = (latitude, longitude) => {
  
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
};

// Function to send a notification
const sendNotification = (message) => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  } else {
    alert(message); // Fallback for browsers without Notification API
  }
};

// Start continuous GPS tracking
const startGPSTracking = () => {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        storedLocation = { latitude, longitude };
        initializeMap(latitude, longitude);
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

// Stop GPS tracking
const stopGPSTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
};
// Define the audio object for the alarm sound
const alarmSound = new Audio('1stmixkit-alarm-clock-beep-988.mp3');

// Function to play the alarm sound
const playAlarmSound = () => {
  alarmSound.currentTime = 0; // Reset the audio to start
  alarmSound.play().catch((error) => {
    console.error('Error playing alarm sound:', error);
  });
};

// Connect to Smart Wallet using Web Bluetooth API
connectButton.addEventListener('click', async () => {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'], // Add specific services of your device
    });

    const server = await device.gatt.connect();
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Connected to Smart Wallet';
    console.log('Connected to device:', device);

    // Start continuous GPS tracking after successful connection
    if (!gpsTrackingActive) {
      startGPSTracking();
      gpsTrackingActive = true;
    }

    device.ongattserverdisconnected = () => {
      statusDiv.style.display = 'none';
      sendNotification('Smart Wallet Bluetooth connection lost!');
      playAlarmSound1();
      alert('Disconnected from Smart Wallet');

      // Stop GPS tracking and freeze the last known location when Bluetooth is disconnected
      stopGPSTracking();

      if (storedLocation) {
        initializeMap(storedLocation.latitude, storedLocation.longitude);
      } else {
        errorDiv.textContent = 'Unable to retrieve location where the wallet disconnected.';
      }
    };
  } catch (error) {
    errorDiv.textContent = `Connection failed: ${error.message}`;
    console.error('Error connecting to device:', error);
  }
});
