import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][];
  gradient: Record<string, string>;
}

const HeatmapLayer = ({ points, gradient }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 15, // Reduced radius for smaller points
      blur: 10,   // Reduced blur for sharper points
      maxZoom: 20,
      gradient,
      minOpacity: 0.3
    });

    map.addLayer(heatLayer);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, gradient]);

  return null;
};

export default HeatmapLayer;