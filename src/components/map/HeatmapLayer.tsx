import { useEffect, useRef, memo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][];
  gradient: Record<string, string>;
}

const HeatmapLayer = memo(({ points, gradient }: HeatmapLayerProps) => {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !points?.length) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    heatLayerRef.current = (L as any).heatLayer(points, {
      radius: 15,
      blur: 10,
      maxZoom: 20,
      gradient,
      minOpacity: 0.3
    });

    map.addLayer(heatLayerRef.current);
    
    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points, gradient]);

  return null;
});

HeatmapLayer.displayName = 'HeatmapLayer';

export default HeatmapLayer;