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
  
  // Generate different number of points based on timeframe
  switch(timeframe) {
    case "current": numPoints = 100; break;
    case "12h": numPoints = 120; break;
    case "1d": numPoints = 150; break;
    case "3d": numPoints = 180; break;
    case "1w": numPoints = 200; break;
  }

  // Create clusters of points
  const numClusters = Math.floor(numPoints / 20); // Create clusters of ~20 points
  const clusters: { lat: number; lng: number }[] = [];

  // Generate random cluster centers
  for (let i = 0; i < numClusters; i++) {
    let clusterCenter;
    let attempts = 0;
    do {
      const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
      const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);
      clusterCenter = { lat, lng };
      attempts++;
    } while (!isPointInPolygon([clusterCenter.lat, clusterCenter.lng], damCoordinates) && attempts < 50);

    if (attempts < 50) {
      clusters.push(clusterCenter);
    }
  }

  // Generate points around clusters
  while (points.length < numPoints) {
    const randomCluster = clusters[Math.floor(Math.random() * clusters.length)];
    if (!randomCluster) continue;

    // Generate point with random offset from cluster center
    const offset = 0.003; // Adjust this value to control cluster size
    const lat = randomCluster.lat + (Math.random() - 0.5) * offset;
    const lng = randomCluster.lng + (Math.random() - 0.5) * offset;
    
    if (isPointInPolygon([lat, lng], damCoordinates)) {
      const intensity = 0.2 + Math.random() * 0.6;
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
      levels: ["Low", "Medium", "High", "Very High"]
    },
    "1d": {
      title: "24-Hour Prediction",
      levels: ["Low", "Medium", "High", "Very High"]
    },
    "3d": {
      title: "3-Day Prediction",
      levels: ["Low", "Medium", "High", "Very High"]
    },
    "1w": {
      title: "1-Week Prediction",
      levels: ["Low", "Medium", "High", "Very High"]
    }
  };
  return labels[timeframe];
};