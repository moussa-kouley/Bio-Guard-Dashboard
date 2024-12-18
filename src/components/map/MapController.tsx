import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

interface MapControllerProps {
  center: LatLngExpression;
  zoom: number;
}

const MapController = ({ center, zoom }: MapControllerProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

export default MapController;