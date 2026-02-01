// World Crop Monitor - Main Application JavaScript

// Global variables
let climateMap;
let currentLayer = 'satellite';
let cropStressLayer;
let stateMarkerLayer;
let selectedStateMarker;

// Map tile configurations
const mapLayers = {
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    street: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; SRTM'
    }
};

// State data for USA and India with simulated stress levels
const stateData = {
    // USA States
    'CA': { name: 'California', lat: 36.7783, lng: -119.4179, stress: 72, tempAnomaly: '+2.1°C', precipDeficit: '-35%', vegHealth: 'Poor', droughtIndex: 'Severe' },
    'OR': { name: 'Oregon', lat: 43.8041, lng: -120.5542, stress: 45, tempAnomaly: '+0.8°C', precipDeficit: '-15%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'WA': { name: 'Washington', lat: 47.7511, lng: -120.7401, stress: 30, tempAnomaly: '+0.3°C', precipDeficit: '-8%', vegHealth: 'Good', droughtIndex: 'Low' },
    'NV': { name: 'Nevada', lat: 38.8026, lng: -116.4194, stress: 78, tempAnomaly: '+2.4°C', precipDeficit: '-42%', vegHealth: 'Poor', droughtIndex: 'Severe' },
    'AZ': { name: 'Arizona', lat: 34.0489, lng: -111.0937, stress: 85, tempAnomaly: '+2.8°C', precipDeficit: '-48%', vegHealth: 'Critical', droughtIndex: 'Extreme' },
    'CO': { name: 'Colorado', lat: 39.5501, lng: -105.7821, stress: 55, tempAnomaly: '+1.2°C', precipDeficit: '-22%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'UT': { name: 'Utah', lat: 39.3210, lng: -111.0937, stress: 68, tempAnomaly: '+1.8°C', precipDeficit: '-30%', vegHealth: 'Poor', droughtIndex: 'High' },
    'TX': { name: 'Texas', lat: 31.9686, lng: -99.9018, stress: 62, tempAnomaly: '+1.5°C', precipDeficit: '-25%', vegHealth: 'Fair', droughtIndex: 'High' },
    'OK': { name: 'Oklahoma', lat: 35.0078, lng: -97.0929, stress: 48, tempAnomaly: '+1.0°C', precipDeficit: '-18%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'KS': { name: 'Kansas', lat: 39.0119, lng: -98.4842, stress: 42, tempAnomaly: '+0.9°C', precipDeficit: '-14%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'NE': { name: 'Nebraska', lat: 41.4925, lng: -99.9018, stress: 38, tempAnomaly: '+0.7°C', precipDeficit: '-12%', vegHealth: 'Good', droughtIndex: 'Low' },
    'SD': { name: 'South Dakota', lat: 43.9695, lng: -99.9018, stress: 35, tempAnomaly: '+0.5°C', precipDeficit: '-10%', vegHealth: 'Good', droughtIndex: 'Low' },
    'ND': { name: 'North Dakota', lat: 47.5515, lng: -101.0024, stress: 32, tempAnomaly: '+0.4°C', precipDeficit: '-8%', vegHealth: 'Good', droughtIndex: 'Low' },
    'MN': { name: 'Minnesota', lat: 46.7296, lng: -94.6859, stress: 28, tempAnomaly: '+0.3°C', precipDeficit: '-6%', vegHealth: 'Good', droughtIndex: 'Low' },
    'IA': { name: 'Iowa', lat: 41.8780, lng: -93.0977, stress: 40, tempAnomaly: '+0.6°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'MO': { name: 'Missouri', lat: 37.9643, lng: -91.8318, stress: 52, tempAnomaly: '+1.1°C', precipDeficit: '-20%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'WI': { name: 'Wisconsin', lat: 43.7844, lng: -88.7879, stress: 25, tempAnomaly: '+0.2°C', precipDeficit: '-5%', vegHealth: 'Good', droughtIndex: 'Low' },
    'IL': { name: 'Illinois', lat: 40.6331, lng: -89.3985, stress: 45, tempAnomaly: '+0.8°C', precipDeficit: '-15%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'MI': { name: 'Michigan', lat: 44.3148, lng: -85.6024, stress: 22, tempAnomaly: '+0.1°C', precipDeficit: '-4%', vegHealth: 'Good', droughtIndex: 'Low' },
    'OH': { name: 'Ohio', lat: 40.4173, lng: -82.9071, stress: 38, tempAnomaly: '+0.5°C', precipDeficit: '-10%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'IN': { name: 'Indiana', lat: 40.2672, lng: -86.1349, stress: 48, tempAnomaly: '+0.9°C', precipDeficit: '-16%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'FL': { name: 'Florida', lat: 27.6648, lng: -81.5158, stress: 58, tempAnomaly: '+1.3°C', precipDeficit: '-28%', vegHealth: 'Fair', droughtIndex: 'High' },
    'GA': { name: 'Georgia', lat: 32.1656, lng: -82.9001, stress: 52, tempAnomaly: '+1.0°C', precipDeficit: '-22%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'AL': { name: 'Alabama', lat: 32.3182, lng: -86.9023, stress: 55, tempAnomaly: '+1.2°C', precipDeficit: '-24%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'MS': { name: 'Mississippi', lat: 32.3547, lng: -89.3985, stress: 60, tempAnomaly: '+1.4°C', precipDeficit: '-26%', vegHealth: 'Fair', droughtIndex: 'High' },
    'LA': { name: 'Louisiana', lat: 30.9843, lng: -91.9623, stress: 50, tempAnomaly: '+0.9°C', precipDeficit: '-20%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'AR': { name: 'Arkansas', lat: 35.2010, lng: -91.8318, stress: 54, tempAnomaly: '+1.1°C', precipDeficit: '-22%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'TN': { name: 'Tennessee', lat: 35.5175, lng: -86.5804, stress: 48, tempAnomaly: '+0.8°C', precipDeficit: '-18%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'KY': { name: 'Kentucky', lat: 37.8393, lng: -84.2700, stress: 45, tempAnomaly: '+0.7°C', precipDeficit: '-15%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'NC': { name: 'North Carolina', lat: 35.7596, lng: -79.0193, stress: 42, tempAnomaly: '+0.6°C', precipDeficit: '-14%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'SC': { name: 'South Carolina', lat: 33.8361, lng: -81.1637, stress: 48, tempAnomaly: '+0.8°C', precipDeficit: '-16%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'VA': { name: 'Virginia', lat: 37.4316, lng: -78.6569, stress: 40, tempAnomaly: '+0.5°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'WV': { name: 'West Virginia', lat: 38.5976, lng: -80.4549, stress: 35, tempAnomaly: '+0.4°C', precipDeficit: '-10%', vegHealth: 'Good', droughtIndex: 'Low' },
    'MD': { name: 'Maryland', lat: 39.0458, lng: -76.6413, stress: 38, tempAnomaly: '+0.5°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'PA': { name: 'Pennsylvania', lat: 41.2033, lng: -77.1945, stress: 32, tempAnomaly: '+0.3°C', precipDeficit: '-8%', vegHealth: 'Good', droughtIndex: 'Low' },
    'NY': { name: 'New York', lat: 40.7128, lng: -74.0060, stress: 28, tempAnomaly: '+0.2°C', precipDeficit: '-6%', vegHealth: 'Good', droughtIndex: 'Low' },
    'NJ': { name: 'New Jersey', lat: 40.0583, lng: -74.4057, stress: 30, tempAnomaly: '+0.2°C', precipDeficit: '-7%', vegHealth: 'Good', droughtIndex: 'Low' },
    'CT': { name: 'Connecticut', lat: 41.6032, lng: -73.0877, stress: 26, tempAnomaly: '+0.1°C', precipDeficit: '-5%', vegHealth: 'Good', droughtIndex: 'Low' },
    'MA': { name: 'Massachusetts', lat: 42.4072, lng: -71.3824, stress: 24, tempAnomaly: '+0.1°C', precipDeficit: '-4%', vegHealth: 'Good', droughtIndex: 'Low' },
    'RI': { name: 'Rhode Island', lat: 41.5801, lng: -71.4774, stress: 22, tempAnomaly: '+0.1°C', precipDeficit: '-4%', vegHealth: 'Good', droughtIndex: 'Low' },
    'VT': { name: 'Vermont', lat: 44.5588, lng: -72.5778, stress: 20, tempAnomaly: '0°C', precipDeficit: '-3%', vegHealth: 'Good', droughtIndex: 'Low' },
    'NH': { name: 'New Hampshire', lat: 43.1939, lng: -71.5724, stress: 21, tempAnomaly: '+0.1°C', precipDeficit: '-4%', vegHealth: 'Good', droughtIndex: 'Low' },
    'ME': { name: 'Maine', lat: 45.2538, lng: -69.4455, stress: 18, tempAnomaly: '0°C', precipDeficit: '-3%', vegHealth: 'Good', droughtIndex: 'Low' },
    // India States
    'Jammu & Kashmir': { name: 'Jammu & Kashmir', lat: 33.7782, lng: 76.5762, stress: 42, tempAnomaly: '+0.9°C', precipDeficit: '-15%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Himachal Pradesh': { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, stress: 35, tempAnomaly: '+0.6°C', precipDeficit: '-10%', vegHealth: 'Good', droughtIndex: 'Low' },
    'Punjab': { name: 'Punjab', lat: 31.1471, lng: 75.3412, stress: 58, tempAnomaly: '+1.4°C', precipDeficit: '-25%', vegHealth: 'Fair', droughtIndex: 'High' },
    'Haryana': { name: 'Haryana', lat: 29.2388, lng: 76.4319, stress: 62, tempAnomaly: '+1.5°C', precipDeficit: '-28%', vegHealth: 'Fair', droughtIndex: 'High' },
    'Uttarakhand': { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, stress: 38, tempAnomaly: '+0.7°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'Delhi': { name: 'Delhi', lat: 28.7041, lng: 77.1025, stress: 68, tempAnomaly: '+1.8°C', precipDeficit: '-32%', vegHealth: 'Poor', droughtIndex: 'High' },
    'Uttar Pradesh': { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, stress: 55, tempAnomaly: '+1.2°C', precipDeficit: '-22%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Rajasthan': { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, stress: 82, tempAnomaly: '+2.5°C', precipDeficit: '-45%', vegHealth: 'Critical', droughtIndex: 'Extreme' },
    'Madhya Pradesh': { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, stress: 72, tempAnomaly: '+1.9°C', precipDeficit: '-35%', vegHealth: 'Poor', droughtIndex: 'Severe' },
    'Chhattisgarh': { name: 'Chhattisgarh', lat: 21.2787, lng: 82.9266, stress: 65, tempAnomaly: '+1.6°C', precipDeficit: '-30%', vegHealth: 'Fair', droughtIndex: 'High' },
    'Bihar': { name: 'Bihar', lat: 26.1197, lng: 85.5230, stress: 58, tempAnomaly: '+1.3°C', precipDeficit: '-24%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Jharkhand': { name: 'Jharkhand', lat: 23.6102, lng: 85.2798, stress: 60, tempAnomaly: '+1.4°C', precipDeficit: '-26%', vegHealth: 'Fair', droughtIndex: 'High' },
    'West Bengal': { name: 'West Bengal', lat: 22.9868, lng: 87.8550, stress: 52, tempAnomaly: '+1.0°C', precipDeficit: '-20%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Odisha': { name: 'Odisha', lat: 20.9517, lng: 85.0985, stress: 68, tempAnomaly: '+1.7°C', precipDeficit: '-32%', vegHealth: 'Poor', droughtIndex: 'High' },
    'Sikkim': { name: 'Sikkim', lat: 27.3389, lng: 88.6063, stress: 28, tempAnomaly: '+0.3°C', precipDeficit: '-8%', vegHealth: 'Good', droughtIndex: 'Low' },
    'Arunachal Pradesh': { name: 'Arunachal Pradesh', lat: 27.1028, lng: 93.6166, stress: 32, tempAnomaly: '+0.4°C', precipDeficit: '-10%', vegHealth: 'Good', droughtIndex: 'Low' },
    'Assam': { name: 'Assam', lat: 26.2006, lng: 92.9376, stress: 45, tempAnomaly: '+0.8°C', precipDeficit: '-15%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Meghalaya': { name: 'Meghalaya', lat: 25.4670, lng: 91.3662, stress: 38, tempAnomaly: '+0.5°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'Manipur': { name: 'Manipur', lat: 24.6637, lng: 93.9063, stress: 42, tempAnomaly: '+0.6°C', precipDeficit: '-14%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Nagaland': { name: 'Nagaland', lat: 25.9759, lng: 94.1262, stress: 40, tempAnomaly: '+0.5°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' },
    'Tripura': { name: 'Tripura', lat: 23.9408, lng: 91.9882, stress: 48, tempAnomaly: '+0.8°C', precipDeficit: '-16%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Mizoram': { name: 'Mizoram', lat: 23.7104, lng: 92.7206, stress: 35, tempAnomaly: '+0.4°C', precipDeficit: '-10%', vegHealth: 'Good', droughtIndex: 'Low' },
    'Gujarat': { name: 'Gujarat', lat: 22.2587, lng: 71.1924, stress: 75, tempAnomaly: '+2.0°C', precipDeficit: '-38%', vegHealth: 'Poor', droughtIndex: 'Severe' },
    'Maharashtra': { name: 'Maharashtra', lat: 19.7515, lng: 75.7139, stress: 70, tempAnomaly: '+1.8°C', precipDeficit: '-34%', vegHealth: 'Poor', droughtIndex: 'High' },
    'Goa': { name: 'Goa', lat: 15.2993, lng: 74.1240, stress: 32, tempAnomaly: '+0.3°C', precipDeficit: '-8%', vegHealth: 'Good', droughtIndex: 'Low' },
    'Karnataka': { name: 'Karnataka', lat: 15.3173, lng: 75.7139, stress: 65, tempAnomaly: '+1.6°C', precipDeficit: '-30%', vegHealth: 'Fair', droughtIndex: 'High' },
    'Andhra Pradesh': { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, stress: 72, tempAnomaly: '+1.9°C', precipDeficit: '-35%', vegHealth: 'Poor', droughtIndex: 'Severe' },
    'Telangana': { name: 'Telangana', lat: 17.1232, lng: 77.3508, stress: 68, tempAnomaly: '+1.7°C', precipDeficit: '-32%', vegHealth: 'Poor', droughtIndex: 'High' },
    'Tamil Nadu': { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, stress: 58, tempAnomaly: '+1.3°C', precipDeficit: '-25%', vegHealth: 'Fair', droughtIndex: 'Moderate' },
    'Kerala': { name: 'Kerala', lat: 10.8505, lng: 76.2711, stress: 40, tempAnomaly: '+0.6°C', precipDeficit: '-12%', vegHealth: 'Fair', droughtIndex: 'Low' }
};

// Initialize the map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeControls();
    initializeStateSelector();
    loadSampleRegions();
    updateStateButtons();
});

// Initialize the climate map with satellite view
function initializeMap() {
    // Create the map centered on a default view (global view)
    climateMap = L.map('climateMap', {
        center: [20, 0],
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true
    });

    // Add the default satellite layer
    addMapLayer('satellite');

    // Add zoom control to top-right (better layout positioning)
    climateMap.zoomControl.setPosition('topright');

    // Add scale control
    L.control.scale({
        position: 'bottomright',
        imperial: false
    }).addTo(climateMap);

    // Add map click event for region selection
    climateMap.on('click', function(e) {
        selectLocation(e.latlng);
    });

    console.log('Climate map initialized successfully');
}

// Add a map layer by type
function addMapLayer(layerType) {
    // Remove existing tile layer if any
    if (climateMap.tileLayer) {
        climateMap.removeLayer(climateMap.tileLayer);
    }

    const layerConfig = mapLayers[layerType];
    if (!layerConfig) {
        console.error('Unknown layer type:', layerType);
        return;
    }

    climateMap.tileLayer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        subdomains: layerType === 'satellite' ? [] : ['a', 'b', 'c'],
        maxZoom: 19
    }).addTo(climateMap);

    currentLayer = layerType;
}

// Switch between map layers
function switchMapLayer(layerType) {
    if (layerType === currentLayer) return;
    
    addMapLayer(layerType);
    
    // Update active button state
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === layerType) {
            btn.classList.add('active');
        }
    });

    // Re-add crop stress overlay if enabled
    const cropOverlayEnabled = document.getElementById('cropOverlay').checked;
    if (cropOverlayEnabled) {
        addCropStressOverlay();
    }
}

// Add crop stress overlay (simulated with colored circles)
function addCropStressOverlay() {
    // Remove existing overlay
    if (cropStressLayer) {
        climateMap.removeLayer(cropStressLayer);
        cropStressLayer.clearLayers();
    }

    cropStressLayer = L.layerGroup().addTo(climateMap);

    // Add sample stress markers for demonstration
    const sampleRegions = [
        { lat: -12.04, lng: -77.04, stress: 85, name: 'Lima, Peru' },
        { lat: 31.52, lng: 34.45, stress: 72, name: 'Gaza Strip' },
        { lat: 15.5, lng: 32.5, stress: 91, name: 'Khartoum, Sudan' },
        { lat: 6.52, lng: 3.37, stress: 68, name: 'Lagos, Nigeria' },
        { lat: 23.88, lng: 90.39, stress: 45, name: 'Dhaka, Bangladesh' },
        { lat: -33.87, lng: 151.2, stress: 25, name: 'Sydney, Australia' },
        { lat: 40.71, lng: -74.00, stress: 30, name: 'New York, USA' },
        { lat: 51.50, lng: -0.12, stress: 35, name: 'London, UK' },
        { lat: 35.67, lng: 139.65, stress: 28, name: 'Tokyo, Japan' },
        { lat: -23.55, lng: -46.63, stress: 55, name: 'São Paulo, Brazil' }
    ];

    sampleRegions.forEach(region => {
        const marker = L.circleMarker([region.lat, region.lng], {
            radius: 12,
            fillColor: getStressColor(region.stress),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        }).bindPopup(`
            <strong>${region.name}</strong><br>
            Stress Level: <span style="color: ${getStressColor(region.stress)}; font-weight: bold;">${region.stress}%</span>
        `);
        
        marker.on('click', function() {
            selectRegion(region);
        });
        
        cropStressLayer.addLayer(marker);
    });
}

// Get color based on stress level
function getStressColor(stress) {
    if (stress < 25) return '#388e3c';      // Low - Green
    if (stress < 50) return '#8BC34A';      // Moderate - Light Green
    if (stress < 75) return '#ff9800';      // High - Orange
    return '#d32f2f';                       // Critical - Red
}

// Initialize all control event listeners
function initializeControls() {
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchMapLayer(this.dataset.view);
        });
    });

    // Crop overlay checkbox
    const cropOverlayCheckbox = document.getElementById('cropOverlay');
    if (cropOverlayCheckbox) {
        cropOverlayCheckbox.addEventListener('change', function() {
            if (this.checked) {
                addCropStressOverlay();
            } else if (cropStressLayer) {
                climateMap.removeLayer(cropStressLayer);
                cropStressLayer = null;
            }
        });
    }

    // Location button
    const locationBtn = document.getElementById('locationBtn');
    if (locationBtn) {
        locationBtn.addEventListener('click', function() {
            getCurrentLocation();
        });
    }

    // Heat map button (placeholder)
    const heatmapBtn = document.getElementById('heatmapBtn');
    if (heatmapBtn) {
        heatmapBtn.addEventListener('click', function() {
            toggleHeatMap();
        });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showExportModal();
        });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshData();
        });
    }

    // Close modal
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            const modal = document.getElementById('exportModal');
            if (modal) modal.style.display = 'none';
        });
    }

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('exportModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Get current user location
function getCurrentLocation() {
    const locationDiv = document.getElementById('currentLocation');
    if (!locationDiv) return;

    locationDiv.innerHTML = '<p class="loading-location">Locating...</p>';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Center map on user location
                climateMap.setView([lat, lng], 8);

                // Add marker at user location
                L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<div style="width: 20px; height: 20px; background: #2196F3; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(climateMap).bindPopup('<strong>Your Location</strong><br>Lat: ' + lat.toFixed(4) + '<br>Lng: ' + lng.toFixed(4)).openPopup();

                locationDiv.innerHTML = '<p class="location-found"><strong>Location Found!</strong></p><p class="location-coords">' + lat.toFixed(4) + ', ' + lng.toFixed(4) + '</p>';

                selectLocation({ lat: lat, lng: lng });
            },
            function(error) {
                let errorMessage = 'Unable to get location.';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                locationDiv.innerHTML = '<p class="location-error">' + errorMessage + '</p>';
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        locationDiv.innerHTML = '<p class="location-error">Geolocation is not supported by your browser.</p>';
    }
}

// Handle map click for location selection
function selectLocation(latlng) {
    const selectedRegionDiv = document.getElementById('selectedRegion');
    if (!selectedRegionDiv) return;
    
    selectedRegionDiv.innerHTML = '<div class="region-details"><div class="region-name">Selected Location</div><div class="region-meta">Lat: ' + latlng.lat.toFixed(4) + ', Lng: ' + latlng.lng.toFixed(4) + '</div><div class="region-risk medium"><span>&#9679;</span> Medium Risk</div><div class="region-indicators"><div class="region-indicator"><div class="region-indicator-value">42</div><div class="region-indicator-label">Drought</div></div><div class="region-indicator"><div class="region-indicator-value">38</div><div class="region-indicator-label">Heat</div></div><div class="region-indicator"><div class="region-indicator-value">55</div><div class="region-indicator-label">Vegetation</div></div><div class="region-indicator"><div class="region-indicator-value">47</div><div class="region-indicator-label">Rainfall</div></div></div></div>';
}

// Select a region from the stress markers
function selectRegion(region) {
    const selectedRegionDiv = document.getElementById('selectedRegion');
    if (!selectedRegionDiv) return;

    const riskLevel = region.stress > 75 ? 'critical' : region.stress > 50 ? 'high' : region.stress > 25 ? 'medium' : 'low';
    const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);

    selectedRegionDiv.innerHTML = '<div class="region-details"><div class="region-name">' + region.name + '</div><div class="region-risk ' + riskLevel + '"><span>&#9679;</span> ' + riskLabel + ' Risk</div><div class="region-indicators"><div class="region-indicator"><div class="region-indicator-value">' + Math.floor(region.stress * 0.5) + '</div><div class="region-indicator-label">Drought</div></div><div class="region-indicator"><div class="region-indicator-value">' + Math.floor(region.stress * 0.45) + '</div><div class="region-indicator-label">Heat</div></div><div class="region-indicator"><div class="region-indicator-value">' + Math.floor(region.stress * 0.6) + '</div><div class="region-indicator-label">Vegetation</div></div><div class="region-indicator"><div class="region-indicator-value">' + Math.floor(region.stress * 0.55) + '</div><div class="region-indicator-label">Rainfall</div></div></div><div class="region-recommendations"><h4>Recommendations</h4><ul><li>Monitor weather conditions closely</li><li>Check local agricultural advisories</li><li>Prepare irrigation contingency plans</li></ul></div></div>';
}

// Toggle heat map view
function toggleHeatMap() {
    const btn = document.getElementById('heatmapBtn');
    if (!btn) return;

    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="9" fill="currentColor" opacity="0.7"/><rect x="14" y="4" width="3" height="13" fill="currentColor" opacity="0.7"/></svg>Heat Map On';
    } else {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="9" fill="currentColor" opacity="0.7"/><rect x="14" y="4" width="3" height="13" fill="currentColor" opacity="0.7"/></svg>Heat Map';
    }
}

// Show export modal
function showExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Refresh data
function refreshData() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    if (loadingText) {
        loadingText.textContent = 'Refreshing climate data...';
    }

    // Simulate data refresh
    setTimeout(function() {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        // Reload stress overlay
        const cropOverlayCheckbox = document.getElementById('cropOverlay');
        if (cropOverlayCheckbox && cropOverlayCheckbox.checked) {
            addCropStressOverlay();
        }
        
        // Update timestamp
        const now = new Date();
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        }
        
        // Flash effect on map
        const mapContainer = document.getElementById('climateMap');
        if (mapContainer) {
            mapContainer.style.opacity = '0.5';
            setTimeout(function() {
                mapContainer.style.opacity = '1';
            }, 300);
        }
    }, 1500);
}

// Load sample regions for demonstration
function loadSampleRegions() {
    // Add sample stress overlay by default
    addCropStressOverlay();

    // Set initial risk counts (simulated data)
    const criticalCount = document.getElementById('criticalCount');
    const highCount = document.getElementById('highCount');
    const mediumCount = document.getElementById('mediumCount');
    const lowCount = document.getElementById('lowCount');

    if (criticalCount) criticalCount.textContent = '3';
    if (highCount) highCount.textContent = '7';
    if (mediumCount) mediumCount.textContent = '12';
    if (lowCount) lowCount.textContent = '24';

    // Set last updated time
    const now = new Date();
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    }

    // Initialize indicator values (simulated)
    updateIndicators({
        drought: 45,
        heat: 38,
        vegetation: 52,
        rainfall: 41
    });

    // Calculate and display trend analysis
    calculateTrendAnalysis();

    // Render initial trend chart for a high-stress region
    setTimeout(() => {
        renderTrendChart('Rajasthan');
    }, 500);
}

// Update indicator values
function updateIndicators(data) {
    // Update drought indicator
    const droughtBar = document.getElementById('droughtBar');
    const droughtValue = document.getElementById('droughtValue');
    if (droughtBar) droughtBar.style.width = data.drought + '%';
    if (droughtValue) droughtValue.textContent = data.drought + '%';

    // Update heat indicator
    const heatBar = document.getElementById('heatBar');
    const heatValue = document.getElementById('heatValue');
    if (heatBar) heatBar.style.width = data.heat + '%';
    if (heatValue) heatValue.textContent = data.heat + '%';

    // Update vegetation indicator
    const vegetationBar = document.getElementById('vegetationBar');
    const vegetationValue = document.getElementById('vegetationValue');
    if (vegetationBar) vegetationBar.style.width = data.vegetation + '%';
    if (vegetationValue) vegetationValue.textContent = data.vegetation + '%';

    // Update rainfall indicator
    const rainfallBar = document.getElementById('rainfallBar');
    const rainfallValue = document.getElementById('rainfallValue');
    if (rainfallBar) rainfallBar.style.width = data.rainfall + '%';
    if (rainfallValue) rainfallValue.textContent = data.rainfall + '%';
}

// Initialize state selector functionality
function initializeStateSelector() {
    // Country selector
    const countrySelect = document.getElementById('countrySelect');
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            const country = this.value;
            const stateGroups = document.querySelectorAll('.state-group');
            stateGroups.forEach(group => {
                if (group.dataset.country === country) {
                    group.classList.add('active');
                    group.style.display = 'block';
                } else {
                    group.classList.remove('active');
                    group.style.display = 'none';
                }
            });
        });
    }

    // State buttons
    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const stateCode = this.dataset.state;
            selectState(stateCode);
        });
    });
}

// Get stress level class based on value
function getStressLevel(stress) {
    if (stress < 25) return 'low';
    if (stress < 50) return 'medium';
    if (stress < 75) return 'high';
    return 'severe';
}

// Update state button colors based on stress levels
function updateStateButtons() {
    document.querySelectorAll('.state-btn').forEach(btn => {
        const stateCode = btn.dataset.state;
        const state = stateData[stateCode];
        if (state) {
            const level = getStressLevel(state.stress);
            btn.classList.remove('low', 'medium', 'high', 'severe');
            btn.classList.add(level);
        }
    });
}

// Select a state and show on map
function selectState(stateCode) {
    const state = stateData[stateCode];
    if (!state) {
        console.error('State data not found:', stateCode);
        return;
    }

    // Update button states
    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.state === stateCode) {
            btn.classList.add('active');
        }
    });

    // Zoom map to state
    const zoom = parseInt(document.querySelector(`.state-btn[data-state="${stateCode}"]`)?.dataset.zoom) || 6;
    climateMap.setView([state.lat, state.lng], zoom);

    // Add marker for state
    if (selectedStateMarker) {
        climateMap.removeLayer(selectedStateMarker);
    }

    const stressLevel = getStressLevel(state.stress);
    const stressColor = stressLevel === 'severe' ? '#d32f2f' : stressLevel === 'high' ? '#f57c00' : stressLevel === 'medium' ? '#fbc02d' : '#388e3c';

    selectedStateMarker = L.circleMarker([state.lat, state.lng], {
        radius: 15,
        fillColor: stressColor,
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(climateMap);

    // Create popup content
    const popupContent = `
        <div style="min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">${state.name}</h4>
            <div style="margin-bottom: 10px;">
                <strong>Stress Level:</strong> 
                <span style="color: ${stressColor}; font-weight: bold;">${state.stress}% (${stressLevel.charAt(0).toUpperCase() + stressLevel.slice(1)})</span>
            </div>
            <table style="width: 100%; font-size: 12px;">
                <tr>
                    <td style="padding: 4px 0;"><strong>Temperature:</strong></td>
                    <td style="padding: 4px 0; text-align: right;">${state.tempAnomaly}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0;"><strong>Precipitation:</strong></td>
                    <td style="padding: 4px 0; text-align: right;">${state.precipDeficit}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0;"><strong>Vegetation:</strong></td>
                    <td style="padding: 4px 0; text-align: right;">${state.vegHealth}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0;"><strong>Drought:</strong></td>
                    <td style="padding: 4px 0; text-align: right;">${state.droughtIndex}</td>
                </tr>
            </table>
        </div>
    `;

    selectedStateMarker.bindPopup(popupContent).openPopup();

    // Update sidebar info
    updateStateInfo(state);

    // Render trend chart for this state
    renderTrendChart(stateCode);
}

// Render trend chart for selected state
function renderTrendChart(stateCode) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = stateData[stateCode];
    if (!state) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size based on container
    const container = canvas.parentElement;
    if (container) {
        canvas.width = container.clientWidth - 32 || 400;
    }
    canvas.height = 200;
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Generate simulated monthly trend data based on current stress
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseStress = state.stress;
    const dataPoints = months.map((_, i) => {
        // Simulate seasonal variation
        const seasonal = Math.sin((i - 3) * Math.PI / 6) * 15;
        let value = baseStress - seasonal + (Math.random() * 10 - 5);
        return Math.max(0, Math.min(100, Math.round(value)));
    });
    
    // Draw background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText((100 - i * 20) + '%', padding - 5, y + 3);
    }
    
    // Draw area under the line
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    
    dataPoints.forEach((value, index) => {
        const x = padding + (chartWidth / (dataPoints.length - 1)) * index;
        const y = canvas.height - padding - (value / 100) * chartHeight;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(padding + chartWidth, canvas.height - padding);
    ctx.closePath();
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(45, 90, 39, 0.3)');
    gradient.addColorStop(1, 'rgba(45, 90, 39, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    dataPoints.forEach((value, index) => {
        const x = padding + (chartWidth / (dataPoints.length - 1)) * index;
        const y = canvas.height - padding - (value / 100) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.strokeStyle = '#2d5a27';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw data points
    dataPoints.forEach((value, index) => {
        const x = padding + (chartWidth / (dataPoints.length - 1)) * index;
        const y = canvas.height - padding - (value / 100) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        
        // Color based on stress level
        if (value >= 75) {
            ctx.fillStyle = '#d32f2f';
        } else if (value >= 50) {
            ctx.fillStyle = '#f57c00';
        } else if (value >= 25) {
            ctx.fillStyle = '#fbc02d';
        } else {
            ctx.fillStyle = '#388e3c';
        }
        
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // X-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    months.forEach((label, index) => {
        const x = padding + (chartWidth / (months.length - 1)) * index;
        ctx.fillText(label, x, canvas.height - 10);
    });
    
    // Add title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Monthly Crop Stress Trend - ' + state.name, padding, 15);
    
    // Add current value annotation
    const lastValue = dataPoints[dataPoints.length - 1];
    ctx.fillStyle = lastValue >= 75 ? '#d32f2f' : lastValue >= 50 ? '#f57c00' : lastValue >= 25 ? '#fbc02d' : '#388e3c';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Current: ' + lastValue + '%', canvas.width - padding, 15);
}

// Update state info in sidebar
function updateStateInfo(state) {
    const infoDiv = document.getElementById('selectedStateInfo');
    if (!infoDiv) return;

    infoDiv.style.display = 'block';

    const stateNameEl = document.getElementById('stateName');
    const stressValueEl = document.getElementById('stateStressValue');
    const tempAnomalyEl = document.getElementById('tempAnomaly');
    const precipDeficitEl = document.getElementById('precipDeficit');
    const vegHealthEl = document.getElementById('vegHealth');
    const droughtIndexEl = document.getElementById('droughtIndex');
    const dataNoteEl = document.getElementById('dataNote');

    if (stateNameEl) stateNameEl.textContent = state.name;

    const stressLevel = getStressLevel(state.stress);
    if (stressValueEl) {
        stressValueEl.textContent = state.stress + '%';
        stressValueEl.classList.remove('low', 'medium', 'high', 'severe');
        stressValueEl.classList.add(stressLevel);
    }

    if (tempAnomalyEl) {
        tempAnomalyEl.textContent = state.tempAnomaly;
        tempAnomalyEl.classList.remove('positive', 'negative', 'neutral');
        tempAnomalyEl.classList.add(state.tempAnomaly.includes('+') ? 'negative' : 'neutral');
    }

    if (precipDeficitEl) {
        precipDeficitEl.textContent = state.precipDeficit;
        precipDeficitEl.classList.remove('positive', 'negative', 'neutral');
        precipDeficitEl.classList.add('negative');
    }

    if (vegHealthEl) {
        vegHealthEl.textContent = state.vegHealth;
        vegHealthEl.classList.remove('positive', 'negative', 'neutral');
        if (state.vegHealth === 'Good') {
            vegHealthEl.classList.add('positive');
        } else if (state.vegHealth === 'Poor' || state.vegHealth === 'Critical') {
            vegHealthEl.classList.add('negative');
        } else {
            vegHealthEl.classList.add('neutral');
        }
    }

    if (droughtIndexEl) {
        droughtIndexEl.textContent = state.droughtIndex;
        droughtIndexEl.classList.remove('positive', 'negative', 'neutral');
        if (state.droughtIndex === 'Low') {
            droughtIndexEl.classList.add('positive');
        } else if (state.droughtIndex === 'Extreme' || state.droughtIndex === 'Severe') {
            droughtIndexEl.classList.add('negative');
        } else {
            droughtIndexEl.classList.add('neutral');
        }
    }

    if (droughtIndexEl) {
        droughtIndexEl.textContent = state.droughtIndex;
        droughtIndexEl.classList.remove('positive', 'negative', 'neutral');
        if (state.droughtIndex === 'Low') {
            droughtIndexEl.classList.add('positive');
        } else if (state.droughtIndex === 'Extreme' || state.droughtIndex === 'Severe') {
            droughtIndexEl.classList.add('negative');
        } else {
            droughtIndexEl.classList.add('neutral');
        }
    }

    if (dataNoteEl) {
        dataNoteEl.textContent = 'Data updated: ' + new Date().toLocaleDateString();
    }
}

// Calculate trend analysis from state data
function calculateTrendAnalysis() {
    const stresses = Object.values(stateData).map(s => s.stress);
    
    const maxStress = Math.max(...stresses);
    const minStress = Math.min(...stresses);
    const avgStress = Math.round(stresses.reduce((a, b) => a + b, 0) / stresses.length);
    
    // Calculate volatility (standard deviation approximation)
    const mean = avgStress;
    const squaredDiffs = stresses.map(s => Math.pow(s - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const volatility = Math.round(Math.sqrt(avgSquaredDiff));
    
    // Update statistics display
    const maxStressEl = document.getElementById('statMaxStress');
    const minStressEl = document.getElementById('statMinStress');
    const avgStressEl = document.getElementById('statAvgStress');
    const volatilityEl = document.getElementById('statVolatility');
    
    if (maxStressEl) maxStressEl.textContent = maxStress + '%';
    if (minStressEl) minStressEl.textContent = minStress + '%';
    if (avgStressEl) avgStressEl.textContent = avgStress + '%';
    if (volatilityEl) volatilityEl.textContent = volatility + '%';
    
    // Generate key findings
    generateKeyFindings(maxStress, minStress, avgStress, volatility, stresses);
}

// Generate key findings based on analysis
function generateKeyFindings(maxStress, minStress, avgStress, volatility, stresses) {
    const findings = [];
    
    // Find regions with highest stress
    const highStressStates = Object.entries(stateData)
        .filter(([_, data]) => data.stress >= 70)
        .sort((a, b) => b[1].stress - a[1].stress);
    
    if (highStressStates.length > 0) {
        findings.push({
            title: 'Critical Stress Regions',
            description: `${highStressStates.length} regions experiencing severe crop stress (≥70%), led by ${highStressStates[0][1].name} at ${highStressStates[0][1].stress}%`,
            severity: 'high'
        });
    }
    
    // Average stress analysis
    if (avgStress > 50) {
        findings.push({
            title: 'Elevated Average Stress',
            description: `Global average crop stress at ${avgStress}%, indicating widespread agricultural pressure across monitored regions`,
            severity: avgStress > 65 ? 'high' : 'medium'
        });
    } else if (avgStress < 35) {
        findings.push({
            title: 'Favorable Conditions',
            description: `Global average crop stress at ${avgStress}%, indicating generally favorable growing conditions`,
            severity: 'low'
        });
    }
    
    // Volatility analysis
    if (volatility > 20) {
        findings.push({
            title: 'High Variability',
            description: `Stress volatility of ${volatility}% indicates significant regional disparities in crop conditions`,
            severity: 'medium'
        });
    }
    
    // Trend observation
    const increasingRegions = highStressStates.filter(([_, data]) => data.stress > 75);
    if (increasingRegions.length > 0) {
        findings.push({
            title: 'Escalating Crisis',
            description: `${increasingRegions.length} regions showing extreme stress levels requiring immediate attention: ${increasingRegions.slice(0, 3).map(([code, d]) => d.name).join(', ')}`,
            severity: 'high'
        });
    }
    
    // Regional patterns
    const indiaAvg = Object.entries(stateData)
        .filter(([code, _]) => code.includes(' ') || code === 'Delhi' || code === 'Punjab' || code === 'UP' || code === 'UK' || code === 'HP' || code === 'RJ' || code === 'MP')
        .reduce((sum, [_, d]) => sum + d.stress, 0) / 15;
    
    const usaAvg = Object.entries(stateData)
        .filter(([code, _]) => !code.includes(' ') && code !== 'Delhi' && code !== 'Punjab' && code !== 'UP' && code !== 'UK' && code !== 'HP' && code !== 'RJ' && code !== 'MP')
        .reduce((sum, [_, d]) => sum + d.stress, 0) / 35;
    
    if (Math.abs(indiaAvg - usaAvg) > 10) {
        const moreAffected = indiaAvg > usaAvg ? 'India' : 'USA';
        findings.push({
            title: 'Regional Disparity',
            description: `${moreAffected} showing higher average crop stress (${moreAffected === 'India' ? Math.round(indiaAvg) : Math.round(usaAvg)}% vs ${moreAffected === 'India' ? Math.round(usaAvg) : Math.round(indiaAvg)}%)`,
            severity: 'medium'
        });
    }
    
    // Update findings display
    const findingsContainer = document.getElementById('trendFindings');
    if (findingsContainer) {
        if (findings.length > 0) {
            findingsContainer.innerHTML = findings.map(f => `
                <div class="finding-item ${f.severity}">
                    <h4>${f.title}</h4>
                    <p>${f.description}</p>
                </div>
            `).join('');
        } else {
            findingsContainer.innerHTML = '<p>No significant findings based on current data.</p>';
        }
    }
}
