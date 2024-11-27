const connectButton = document.getElementById('connect');
const statusDiv = document.getElementById('status');
const errorDiv = document.getElementById('error');
const mapDiv = document.getElementById('map');
const loadingSpinner = document.getElementById('loading');

let device;
let map;
let marker;
let watchId = null;
let storedLocation = null;
let gpsTrackingActive = false;

// Show Loading Spinner
// const showLoading = (show) => {
//   loadingSpinner.style.display = show ? 'block' : 'none';
// };

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
    circle.bindTo('center', marker, 'position');
  }
};

// Send Notification
const sendNotification = (message) => {
  new Notification(message);
};

// Start GPS Tracking
const startGPSTracking = () => {
  //showLoading(true);

  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        storedLocation = { latitude, longitude };
        initializeMap(latitude, longitude, accuracy);
        //showLoading(false);
      },
      (error) => {
        errorDiv.textContent = `Unable to retrieve location: ${error.message}`;
        //showLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    errorDiv.textContent = "Geolocation is not supported by your browser.";
    //showLoading(false);
  }
};

// Stop GPS Tracking
const stopGPSTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
};

// Alarm Sound
const alarmSound = new Audio('mixkit-facility-alarm-sound-999.mp3');

const playAlarmSound = () => {
  alarmSound.currentTime = 0;
  alarmSound.play().catch((error) => {
    console.error("Error playing alarm sound:", error);
  });
};

// Connect to Smart Wallet
connectButton.addEventListener('click', async () => {
  try {
    // showLoading(true);

    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'],
    });

    const server = await device.gatt.connect();
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Connected to Smart Wallet';

    if (!gpsTrackingActive) {
      startGPSTracking();
      gpsTrackingActive = true;
    }

    device.ongattserverdisconnected = () => {
      playAlarmSound();
      sendNotification('Smart Wallet Bluetooth connection lost!');
      stopGPSTracking();
      statusDiv.style.display = 'none';
    };
  } catch (error) {
    errorDiv.textContent = `Connection failed: ${error.message}`;
  } finally {
    showLoading(false);
  }
});
