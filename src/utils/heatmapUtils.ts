import type { TimeframeType } from '@/types/map';

// Extended coordinates to include Magalies region
const damCoordinates: [number, number][] = [
  [-25.7487, 27.8539], // Southwest corner
  [-25.7287, 27.8639], // Northwest corner
  [-25.7387, 27.8939], // Northeast corner
  [-25.7587, 27.8839], // Southeast corner
  [-25.7487, 27.8739], // Magalies point 1
  [-25.7387, 27.8639]  // Magalies point 2
];

// Function to check if a point is inside the dam polygon
const isPointInPolygon = (point: [number, number], polygon: [number, number][]) => {
  const x = point[0], y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

export const getHeatmapGradient = (timeframe: TimeframeType) => {
  // Use same gradient for all timeframes
  return { 0.2: '#00ff00', 0.4: '#ffff00', 0.6: '#ff9900', 0.8: '#ff0000' };
};

export const generateHeatmapPoints = (timeframe: TimeframeType) => {
  const bounds = {
    minLat: -25.7687,
    maxLat: -25.7287,
    minLng: 27.8539,
    maxLng: 27.8939
  };

  const points: [number, number, number][] = [];
  let numPoints: number;
  
  switch(timeframe) {
    case "current": numPoints = 200; break;
    case "12h": numPoints = 250; break;
    case "1d": numPoints = 300; break;
    case "3d": numPoints = 350; break;
    case "1w": numPoints = 400; break;
  }

  while (points.length < numPoints) {
    const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
    const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);
    
    if (isPointInPolygon([lat, lng], damCoordinates)) {
      const intensity = 0.2 + Math.random() * 0.6; // Reduced intensity range
      points.push([lat, lng, intensity]);
    }
  }
  
  return points;
};

export const getLegendLabels = (timeframe: TimeframeType) => {
  const labels = {
    current: {
      title: "Current Density",
      levels: ["Low Coverage (0-25%)", "Medium Coverage (25-50%)", "High Coverage (50-75%)", "Very High Coverage (75-100%)"]
    },
    "12h": {
      title: "12-Hour Prediction",
      levels: ["Low (0-25%)", "Medium (25-50%)", "High (50-75%)", "Very High (75-100%)"]
    },
    "1d": {
      title: "24-Hour Prediction",
      levels: ["Low (0-25%)", "Medium (25-50%)", "High (50-75%)", "Very High (75-100%)"]
    },
    "3d": {
      title: "3-Day Prediction",
      levels: ["Low (0-25%)", "Medium (25-50%)", "High (50-75%)", "Very High (75-100%)"]
    },
    "1w": {
      title: "1-Week Prediction",
      levels: ["Low (0-25%)", "Medium (25-50%)", "High (50-75%)", "Very High (75-100%)"]
    }
  };
  return labels[timeframe];
};