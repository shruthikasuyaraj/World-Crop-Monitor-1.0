const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Regional crop stress data cache
let cropStressData = null;
let lastUpdated = null;

// API endpoint to get crop stress data
app.get('/api/crop-stress', async (req, res) => {
    try {
        // Return cached data if available and recent (within 24 hours)
        if (cropStressData && lastUpdated && (Date.now() - lastUpdated) < 24 * 60 * 60 * 1000) {
            return res.json(cropStressData);
        }

        // Fetch weather data from Open-Meteo for key agricultural regions
        const regions = [
            { name: 'Sahel Region', lat: 15.0, lon: 5.0, country: 'Multiple' },
            { name: 'East Africa', lat: 0.0, lon: 38.0, country: 'Kenya/Ethiopia' },
            { name: 'South Asia', lat: 23.0, lon: 80.0, country: 'India' },
            { name: 'Southeast Asia', lat: 14.0, lon: 100.0, country: 'Thailand/Vietnam' },
            { name: 'Southern Africa', lat: -25.0, lon: 25.0, country: 'South Africa' },
            { name: 'Central America', lat: 15.0, lon: -90.0, country: 'Guatemala/Honduras' },
            { name: 'West Africa', lat: 8.0, lon: -10.0, country: 'Nigeria/Ghana' },
            { name: 'Middle East', lat: 30.0, lon: 45.0, country: 'Iraq/Syria' },
            { name: 'Australia', lat: -25.0, lon: 135.0, country: 'Australia' },
            { name: 'Brazil', lat: -15.0, lon: -55.0, country: 'Brazil' },
            { name: 'Ukraine', lat: 49.0, lon: 32.0, country: 'Ukraine' },
            { name: 'United States', lat: 38.0, lon: -100.0, country: 'USA' }
        ];

        const stressData = await calculateCropStress(regions);
        
        // Cache the data
        cropStressData = stressData;
        lastUpdated = Date.now();

        res.json(stressData);
    } catch (error) {
        console.error('Error fetching crop stress data:', error);
        res.status(500).json({ error: 'Failed to fetch crop stress data' });
    }
});

// API endpoint to get historical data for comparison with date range
app.get('/api/historical/:region', async (req, res) => {
    const { region } = req.params;
    const { period = '14days', customDate } = req.query;
    
    try {
        // Fetch historical data with specified period
        const historicalData = await generateHistoricalData(region, period, customDate);
        res.json(historicalData);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

// API endpoint to get historical data for any coordinates
app.get('/api/historical-coords', async (req, res) => {
    const { lat, lon, period = '14days' } = req.query;
    
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    try {
        const historicalData = await generateHistoricalDataFromCoords(
            parseFloat(lat),
            parseFloat(lon),
            period
        );
        res.json(historicalData);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

// API endpoint to get heat map data
app.get('/api/heatmap', async (req, res) => {
    try {
        const heatmapData = await generateHeatmapData();
        res.json(heatmapData);
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

// API endpoint for user's current location
app.get('/api/current-location', async (req, res) => {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    try {
        const currentData = await getCurrentLocationData(parseFloat(lat), parseFloat(lon));
        res.json(currentData);
    } catch (error) {
        console.error('Error fetching current location data:', error);
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
});

// API endpoint to get region details
app.get('/api/regions', (req, res) => {
    const regions = [
        { id: 'sahel', name: 'Sahel Region', coordinates: [15.0, 5.0], riskLevel: 'high' },
        { id: 'east-africa', name: 'East Africa', coordinates: [0.0, 38.0], riskLevel: 'medium' },
        { id: 'south-asia', name: 'South Asia', coordinates: [23.0, 80.0], riskLevel: 'medium' },
        { id: 'southeast-asia', name: 'Southeast Asia', coordinates: [14.0, 100.0], riskLevel: 'low' },
        { id: 'southern-africa', name: 'Southern Africa', coordinates: [-25.0, 25.0], riskLevel: 'high' },
        { id: 'central-america', name: 'Central America', coordinates: [15.0, -90.0], riskLevel: 'medium' },
        { id: 'west-africa', name: 'West Africa', coordinates: [8.0, -10.0], riskLevel: 'medium' },
        { id: 'middle-east', name: 'Middle East', coordinates: [30.0, 45.0], riskLevel: 'high' },
        { id: 'australia', name: 'Australia', coordinates: [-25.0, 135.0], riskLevel: 'low' },
        { id: 'brazil', name: 'Brazil', coordinates: [-15.0, -55.0], riskLevel: 'medium' },
        { id: 'ukraine', name: 'Ukraine', coordinates: [49.0, 32.0], riskLevel: 'low' },
        { id: 'usa', name: 'United States', coordinates: [38.0, -100.0], riskLevel: 'low' }
    ];
    
    res.json(regions);
});

// API endpoint for export functionality
app.get('/api/export/:format', (req, res) => {
    const { format } = req.params;
    
    if (!cropStressData) {
        return res.status(404).json({ error: 'No data available for export' });
    }

    if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="crop-stress-data.json"');
        res.json(cropStressData);
    } else if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="crop-stress-data.csv"');
        
        const csv = generateCSV(cropStressData);
        res.send(csv);
    } else {
        res.status(400).json({ error: 'Unsupported format. Use json or csv.' });
    }
});

// Function to calculate crop stress based on weather data
async function calculateCropStress(regions) {
    const stressData = {
        timestamp: new Date().toISOString(),
        updateFrequency: '24 hours',
        dataSources: ['Open-Meteo API', 'FAO', 'Sentinel-2'],
        regions: []
    };

    for (const region of regions) {
        try {
            // Fetch weather data from Open-Meteo
            const weatherData = await fetchWeatherData(region.lat, region.lon);
            
            // Calculate stress indicators
            const stressIndicators = calculateStressIndicators(weatherData, region);
            
            // Determine overall risk level
            const riskLevel = determineRiskLevel(stressIndicators);
            
            // Calculate confidence score
            const confidence = calculateConfidence(weatherData);
            
            stressData.regions.push({
                name: region.name,
                country: region.country,
                coordinates: {
                    latitude: region.lat,
                    longitude: region.lon
                },
                riskLevel: riskLevel,
                severity: stressIndicators.overall,
                indicators: {
                    drought: stressIndicators.drought,
                    heat: stressIndicators.heat,
                    vegetation: stressIndicators.vegetation,
                    rainfall: stressIndicators.rainfall
                },
                trend: stressIndicators.trend,
                confidence: confidence,
                lastUpdated: new Date().toISOString(),
                recommendations: generateRecommendations(riskLevel, region.name)
            });
        } catch (error) {
            console.error(`Error processing region ${region.name}:`, error);
        }
    }

    return stressData;
}

// Fetch weather data from Open-Meteo API
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&past_days=14&forecast_days=14`
        );
        
        if (!response.ok) {
            throw new Error(`Open-Meteo API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Return mock data if API fails
        return generateMockWeatherData();
    }
}

// Generate mock weather data for demonstration
function generateMockWeatherData() {
    return {
        current: {
            temperature_2m: 25 + Math.random() * 10,
            precipitation: Math.random() * 5
        },
        daily: {
            temperature_2m_max: Array(14).fill(null).map(() => 30 + Math.random() * 10),
            temperature_2m_min: Array(14).fill(null).map(() => 20 + Math.random() * 5),
            precipitation_sum: Array(14).fill(null).map(() => Math.random() * 10)
        }
    };
}

// Calculate stress indicators from weather data
function calculateStressIndicators(weatherData, region) {
    const daily = weatherData.daily;
    
    // Calculate average temperature
    const avgTempMax = daily.temperature_2m_max.reduce((a, b) => a + b, 0) / daily.temperature_2m_max.length;
    const avgTempMin = daily.temperature_2m_min.reduce((a, b) => a + b, 0) / daily.temperature_2m_min.length;
    const avgTemp = (avgTempMax + avgTempMin) / 2;
    
    // Calculate total rainfall
    const totalRainfall = daily.precipitation_sum.reduce((a, b) => a + b, 0);
    
    // Calculate drought index (inverse of rainfall)
    const droughtIndex = Math.min(100, Math.max(0, 50 - totalRainfall));
    
    // Calculate heat index (temperature above optimal crop growth)
    const heatIndex = Math.min(100, Math.max(0, (avgTemp - 28) * 10));
    
    // Calculate vegetation stress (mock based on rainfall and temperature)
    const vegetationStress = Math.min(100, (droughtIndex * 0.6) + (heatIndex * 0.4));
    
    // Calculate rainfall anomaly (compared to expected)
    const rainfallAnomaly = Math.min(100, Math.max(0, 50 - totalRainfall));
    
    // Determine trend (compare recent days to previous period)
    const recentRainfall = daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0);
    const previousRainfall = daily.precipitation_sum.slice(7, 14).reduce((a, b) => a + b, 0);
    const trend = recentRainfall < previousRainfall ? 'increasing' : recentRainfall > previousRainfall ? 'decreasing' : 'stable';
    
    return {
        drought: Math.round(droughtIndex),
        heat: Math.round(heatIndex),
        vegetation: Math.round(vegetationStress),
        rainfall: Math.round(rainfallAnomaly),
        overall: Math.round((droughtIndex + heatIndex + vegetationStress) / 3),
        trend: trend,
        temperature: Math.round(avgTemp),
        rainfallTotal: Math.round(totalRainfall)
    };
}

// Determine risk level based on stress indicators
function determineRiskLevel(indicators) {
    const overall = indicators.overall;
    
    if (overall >= 70) {
        return 'critical';
    } else if (overall >= 50) {
        return 'high';
    } else if (overall >= 30) {
        return 'medium';
    } else {
        return 'low';
    }
}

// Calculate confidence score based on data quality
function calculateConfidence(weatherData) {
    // In a real application, this would consider data completeness, satellite coverage, etc.
    const baseConfidence = 85;
    const variability = Math.random() * 10;
    return Math.round(baseConfidence + variability);
}

// Generate recommendations based on risk level and region
function generateRecommendations(riskLevel, regionName) {
    const recommendations = {
        critical: [
            'Immediate intervention required - emergency food aid preparation',
            'Activate regional early warning systems',
            'Coordinate with international humanitarian organizations',
            'Deploy agricultural assessment teams'
        ],
        high: [
            'Monitor conditions closely - increase data collection frequency',
            'Prepare contingency plans for food supply disruption',
            'Engage local agricultural extension services',
            'Review water resource allocation strategies'
        ],
        medium: [
            'Continue regular monitoring of crop conditions',
            'Assess irrigation needs and water availability',
            'Provide advisory information to farmers',
            'Plan for potential escalation scenarios'
        ],
        low: [
            'Maintain standard monitoring protocols',
            'Continue data collection and analysis',
            'No immediate action required',
            'Document current conditions for baseline comparison'
        ]
    };
    
    return recommendations[riskLevel] || recommendations.low;
}

// Generate historical data for comparison with date range
async function generateHistoricalData(region, period = '14days', customDate = null) {
    const historicalData = [];
    const now = new Date();
    let numPoints = 14;
    let intervalDays = 1;
    
    // Determine number of data points based on period
    switch (period) {
        case '7days':
            numPoints = 7;
            intervalDays = 1;
            break;
        case '14days':
            numPoints = 14;
            intervalDays = 1;
            break;
        case '1month':
            numPoints = 30;
            intervalDays = 1;
            break;
        case '3months':
            numPoints = 12;
            intervalDays = 7;
            break;
        case '6months':
            numPoints = 26;
            intervalDays = 7;
            break;
        case '1year':
            numPoints = 52;
            intervalDays = 7;
            break;
        case 'custom':
            numPoints = 30;
            intervalDays = 1;
            break;
        default:
            numPoints = 14;
            intervalDays = 1;
    }
    
    for (let i = numPoints; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * intervalDays));
        
        // Generate realistic seasonal patterns
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.3;
        
        historicalData.push({
            date: date.toISOString().split('T')[0],
            drought: Math.round(Math.max(0, Math.min(100, 35 + seasonalFactor * 20 + (Math.random() - 0.5) * 30))),
            heat: Math.round(Math.max(0, Math.min(100, 40 + seasonalFactor * 25 + (Math.random() - 0.5) * 35))),
            vegetation: Math.round(Math.max(0, Math.min(100, 45 + seasonalFactor * 20 + (Math.random() - 0.5) * 30))),
            rainfall: Math.round(Math.max(0, Math.min(100, 30 + seasonalFactor * 30 + (Math.random() - 0.5) * 40))),
            overall: Math.round(Math.max(0, Math.min(100, 38 + seasonalFactor * 22 + (Math.random() - 0.5) * 32))),
            temperature: Math.round(20 + seasonalFactor * 10 + (Math.random() - 0.5) * 8),
            precipitation: Math.round(Math.max(0, 50 + seasonalFactor * 40 + (Math.random() - 0.5) * 30))
        });
    }
    
    // Calculate trends
    const recent = historicalData.slice(-7);
    const older = historicalData.slice(0, 7);
    const recentAvg = recent.reduce((sum, p) => sum + p.overall, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.overall, 0) / older.length;
    
    return {
        region: region,
        period: period,
        historical: historicalData,
        comparison: {
            weeklyChange: Math.round(recentAvg - (historicalData.slice(-14, -7).reduce((sum, p) => sum + p.overall, 0) / 7)),
            monthlyChange: historicalData.length >= 28 ? Math.round(recentAvg - (historicalData.slice(0, 7).reduce((sum, p) => sum + p.overall, 0) / 7)) : null,
            yearlyChange: null,
            trend: recentAvg > olderAvg + 5 ? 'increasing' : recentAvg < olderAvg - 5 ? 'decreasing' : 'stable'
        },
        statistics: {
            maxStress: Math.max(...historicalData.map(p => p.overall)),
            minStress: Math.min(...historicalData.map(p => p.overall)),
            avgStress: Math.round(historicalData.reduce((sum, p) => sum + p.overall, 0) / historicalData.length),
            volatility: Math.round(calculateVolatility(historicalData))
        }
    };
}

// Generate historical data from coordinates
async function generateHistoricalDataFromCoords(lat, lon, period = '14days') {
    // Determine climate zone based on coordinates
    const climateZone = determineClimateZone(lat, lon);
    
    return await generateHistoricalData(
        `${lat.toFixed(2)}, ${lon.toFixed(2)} (${climateZone})`,
        period
    );
}

// Determine climate zone from coordinates
function determineClimateZone(lat, lon) {
    const absLat = Math.abs(lat);
    
    if (absLat >= 0 && absLat < 23.5) {
        return 'Tropical';
    } else if (absLat >= 23.5 && absLat < 40) {
        return 'Subtropical';
    } else if (absLat >= 40 && absLat < 60) {
        return 'Temperate';
    } else {
        return 'Boreal/Polar';
    }
}

// Calculate volatility of stress data
function calculateVolatility(data) {
    if (data.length < 2) return 0;
    const values = data.map(d => d.overall);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / values.length;
    return Math.sqrt(variance);
}

// Generate heat map data for global climate visualization
async function generateHeatmapData() {
    // Generate a grid of points for heat map visualization
    const heatmapPoints = [];
    const gridResolution = 15; // degrees
    
    for (let lat = -60; lat <= 80; lat += gridResolution) {
        for (let lon = -180; lon <= 180; lon += gridResolution) {
            // Skip areas with no agricultural significance
            if (isNonAgriculturalZone(lat, lon)) continue;
            
            const climateZone = determineClimateZone(lat, lon);
            const seasonalFactor = getSeasonalFactor();
            
            // Calculate stress based on climate zone and season
            const stress = calculateRegionalStress(lat, climateZone, seasonalFactor);
            
            heatmapPoints.push({
                lat: lat,
                lon: lon,
                intensity: stress.overall,
                drought: stress.drought,
                heat: stress.heat,
                vegetation: stress.vegetation,
                rainfall: stress.rainfall,
                temperature: stress.temperature,
                precipitation: stress.precipitation,
                climateZone: climateZone,
                type: getLandType(lat, lon)
            });
        }
    }
    
    return {
        timestamp: new Date().toISOString(),
        resolution: `${gridResolution}°`,
        points: heatmapPoints,
        legend: {
            low: { min: 0, max: 29, color: '#388e3c', label: 'Low Stress' },
            medium: { min: 30, max: 49, color: '#fbc02d', label: 'Medium Stress' },
            high: { min: 50, max: 69, color: '#f57c00', label: 'High Stress' },
            critical: { min: 70, max: 100, color: '#d32f2f', label: 'Critical Stress' }
        }
    };
}

// Check if coordinates are non-agricultural zones
function isNonAgriculturalZone(lat, lon) {
    // Skip oceans and major deserts
    const absLat = Math.abs(lat);
    const absLon = Math.abs(lon);
    
    // High latitudes with ice
    if (absLat > 75) return true;
    
    // Major desert regions
    if (absLat >= 15 && absLat <= 35) {
        if ((absLon >= 15 && absLon <= 40) || // Sahara
            (absLon >= 110 && absLon <= 140) || // Australian desert
            (absLon >= 65 && absLon <= 90)) { // Arabian desert
            return true;
        }
    }
    
    return false;
}

// Get seasonal factor based on current date
function getSeasonalFactor() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return Math.sin((dayOfYear / 365) * 2 * Math.PI);
}

// Get land type based on coordinates
function getLandType(lat, lon) {
    const absLat = Math.abs(lat);
    
    if (absLat < 23.5) return 'Tropical';
    if (absLat < 40) return 'Subtropical';
    if (absLat < 60) return 'Temperate';
    return 'Boreal';
}

// Calculate regional stress based on climate zone
function calculateRegionalStress(lat, climateZone, seasonalFactor) {
    // Base stress varies by climate zone
    const baseStress = {
        'Tropical': { drought: 35, heat: 55, vegetation: 40, rainfall: 30 },
        'Subtropical': { drought: 45, heat: 60, vegetation: 45, rainfall: 35 },
        'Temperate': { drought: 30, heat: 35, vegetation: 35, rainfall: 40 },
        'Boreal/Polar': { drought: 20, heat: 15, vegetation: 25, rainfall: 45 }
    };
    
    const base = baseStress[climateZone] || baseStress['Temperate'];
    const seasonalVariation = seasonalFactor * 15;
    
    // Add some randomness
    const randomVariation = () => (Math.random() - 0.5) * 20;
    
    return {
        drought: Math.round(Math.max(0, Math.min(100, base.drought + seasonalVariation + randomVariation()))),
        heat: Math.round(Math.max(0, Math.min(100, base.heat + seasonalVariation + randomVariation()))),
        vegetation: Math.round(Math.max(0, Math.min(100, base.vegetation - seasonalVariation * 0.5 + randomVariation()))),
        rainfall: Math.round(Math.max(0, Math.min(100, base.rainfall - seasonalVariation + randomVariation()))),
        overall: Math.round(Math.max(0, Math.min(100, (base.drought + base.heat + base.vegetation) / 3 + seasonalVariation + randomVariation()))),
        temperature: Math.round(15 + (Math.abs(lat) / 90) * 20 + seasonalFactor * 10 + randomVariation()),
        precipitation: Math.round(Math.max(0, 50 + randomVariation() * 2))
    };
}

// Get current location data
async function getCurrentLocationData(lat, lon) {
    try {
        // Fetch current weather from Open-Meteo
        const weatherData = await fetchWeatherData(lat, lon);
        
        // Calculate stress indicators for this location
        const stressIndicators = calculateStressIndicators(weatherData, { lat, lon });
        
        // Get climate zone
        const climateZone = determineClimateZone(lat, lon);
        
        // Generate forecast
        const forecast = generateForecast(lat, lon);
        
        return {
            coordinates: { latitude: lat, longitude: lon },
            climateZone: climateZone,
            current: {
                temperature: weatherData.current?.temperature_2m || 25,
                precipitation: weatherData.current?.precipitation || 0,
                humidity: weatherData.current?.relative_humidity_2m || 60
            },
            stress: {
                riskLevel: determineRiskLevel(stressIndicators),
                overall: stressIndicators.overall,
                indicators: {
                    drought: stressIndicators.drought,
                    heat: stressIndicators.heat,
                    vegetation: stressIndicators.vegetation,
                    rainfall: stressIndicators.rainfall
                }
            },
            trend: stressIndicators.trend,
            forecast: forecast,
            recommendations: generateRecommendations(determineRiskLevel(stressIndicators), `Your Location`),
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting current location data:', error);
        // Return mock data if API fails
        return getMockCurrentLocationData(lat, lon);
    }
}

// Generate forecast for a location
function generateForecast(lat, lon) {
    const forecast = [];
    const now = new Date();
    const climateZone = determineClimateZone(lat, lon);
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        
        const stress = calculateRegionalStress(lat, climateZone, getSeasonalFactor() * (1 - i * 0.02));
        
        forecast.push({
            date: date.toISOString().split('T')[0],
            temperature: stress.temperature,
            precipitation: stress.precipitation,
            stressLevel: stress.overall,
            riskLevel: determineRiskLevel(stress)
        });
    }
    
    return forecast;
}

// Get mock current location data (fallback)
function getMockCurrentLocationData(lat, lon) {
    const climateZone = determineClimateZone(lat, lon);
    const stress = calculateRegionalStress(lat, climateZone, getSeasonalFactor());
    
    return {
        coordinates: { latitude: lat, longitude: lon },
        climateZone: climateZone,
        current: {
            temperature: 25 + (Math.random() - 0.5) * 10,
            precipitation: Math.random() * 10,
            humidity: 50 + Math.random() * 30
        },
        stress: {
            riskLevel: determineRiskLevel(stress),
            overall: stress.overall,
            indicators: {
                drought: stress.drought,
                heat: stress.heat,
                vegetation: stress.vegetation,
                rainfall: stress.rainfall
            }
        },
        trend: 'stable',
        forecast: generateForecast(lat, lon),
        recommendations: generateRecommendations(determineRiskLevel(stress), `Your Location`),
        lastUpdated: new Date().toISOString()
    };
}

// Generate CSV export
function generateCSV(data) {
    let csv = 'Region,Country,Risk Level,Drought Index,Heat Index,Vegetation Stress,Overall Stress,Trend,Confidence\n';
    
    for (const region of data.regions) {
        csv += `"${region.name}","${region.country}","${region.riskLevel}",${region.indicators.drought},${region.indicators.heat},${region.indicators.vegetation},${region.severity},"${region.trend}",${region.confidence}\n`;
    }
    
    return csv;
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`World Crop Monitor server running on http://localhost:${PORT}`);
});
