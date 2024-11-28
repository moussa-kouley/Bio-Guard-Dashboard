import type { TimeframeType } from '@/types/map';

export const getHeatmapGradient = (timeframe: TimeframeType) => {
  const gradients = {
    current: { 0.2: '#00ff00', 0.4: '#ffff00', 0.6: '#ff9900', 0.8: '#ff0000' },
    '12h': { 0.2: '#00ffff', 0.4: '#0099ff', 0.6: '#0066ff', 0.8: '#0033ff' },
    '1d': { 0.2: '#ff99cc', 0.4: '#ff66cc', 0.6: '#ff33cc', 0.8: '#ff00cc' },
    '3d': { 0.2: '#ffcc00', 0.4: '#ff9900', 0.6: '#ff6600', 0.8: '#ff3300' },
    '1w': { 0.2: '#99ff99', 0.4: '#66ff66', 0.6: '#33ff33', 0.8: '#00ff00' }
  };
  return gradients[timeframe];
};

export const generateHeatmapPoints = (timeframe: TimeframeType) => {
  // Hartbeespoort dam boundaries (approximately)
  const bounds = {
    minLat: -25.7687,
    maxLat: -25.7287,
    minLng: 27.8539,
    maxLng: 27.8939
  };

  const points: [number, number, number][] = [];
  let numPoints: number;
  
  switch(timeframe) {
    case "current": numPoints = 50; break;
    case "12h": numPoints = 75; break;
    case "1d": numPoints = 100; break;
    case "3d": numPoints = 125; break;
    case "1w": numPoints = 150; break;
  }

  for (let i = 0; i < numPoints; i++) {
    const lat = bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat);
    const lng = bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng);
    const intensity = 0.3 + Math.random() * 0.7; // More varied intensity
    points.push([lat, lng, intensity]);
  }
  
  return points;
};