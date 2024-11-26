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
const initializeMap = (latitude, longitude, accuracy) => {
  const location = { lat: latitude, lng: longitude };
  
  if (!map) {
    map = new google.maps.Map(mapDiv, {
      center: location,
      zoom: 15,  // Adjust zoom for better visibility
    });
    marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  } else {
    map.setCenter(location);
    marker.setPosition(location);
  }

  // Optionally, display an accuracy circle around the location
  if (accuracy) {
    const circle = new google.maps.Circle({
      map: map,
      radius: accuracy,  // Radius in meters
      fillColor: "#90EE90",
      fillOpacity: 0.2,
      strokeColor: "#90EE90",
      strokeOpacity: 0.5,
    });
    circle.bindTo('center', marker, 'position');
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
        const { latitude, longitude, accuracy } = position.coords;  // Accuracy added
        storedLocation = { latitude, longitude };
        initializeMap(latitude, longitude, accuracy);  // Pass accuracy for map display
      },
      (error) => {
        errorDiv.textContent = `Unable to retrieve location: ${error.message}`;
      },
      {
        enableHighAccuracy: true,  // Request high accuracy
        timeout: 10000,            // Timeout after 10 seconds
        maximumAge: 0              // No cache
      }
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
      alert('Disconnected from Smart Wallet');

      // Stop GPS tracking and freeze the last known location when Bluetooth is disconnected
      stopGPSTracking();

      if (storedLocation) {
        initializeMap(storedLocation.latitude, storedLocation.longitude, 100); // Add a default accuracy if disconnected
      } else {
        errorDiv.textContent = 'Unable to retrieve location where the wallet disconnected.';
      }
    };
  } catch (error) {
    errorDiv.textContent = `Connection failed: ${error.message}`;
    console.error('Error connecting to device:', error);
  }
});
