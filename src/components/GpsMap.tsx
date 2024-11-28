import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useToast } from "@/components/ui/use-toast";
import type { GpsData } from '@/types/gps';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import 'leaflet.heat';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GpsMapProps {
  data: GpsData[];
  timeframe: "current" | "12h" | "1d" | "3d" | "1w";
}

// Custom component to handle heatmap layer
const HeatmapLayer = ({ points, gradient }: { points: any[], gradient: any }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 20,
      blur: 15,
      maxZoom: 20,
      gradient
    });

    map.addLayer(heatLayer);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, gradient]);

  return null;
};

const GpsMap = ({ data, timeframe }: GpsMapProps) => {
  const { toast } = useToast();
  const [map, setMap] = useState<L.Map | null>(null);
  
  // Hartbeespoort, South Africa coordinates
  const defaultPosition: [number, number] = [-25.7487, 27.8739];

  // Generate heatmap points based on timeframe
  const getHeatmapPoints = () => {
    if (!data || data.length === 0) return [];
    
    return data.map(entry => {
      if (!entry.latitude || !entry.longitude) return null;
      
      // Adjust intensity based on timeframe prediction
      let intensity = 0.5; // default intensity
      
      switch(timeframe) {
        case "current":
          intensity = 1.0;
          break;
        case "12h":
          intensity = 0.8;
          break;
        case "1d":
          intensity = 0.6;
          break;
        case "3d":
          intensity = 0.4;
          break;
        case "1w":
          intensity = 0.2;
          break;
      }
      
      return [entry.latitude, entry.longitude, intensity];
    }).filter(point => point !== null) as [number, number, number][];
  };

  useEffect(() => {
    if (map) {
      map.setView(defaultPosition, 13);
    }
  }, [map]);

  // Get color based on timeframe
  const getHeatmapGradient = () => {
    switch(timeframe) {
      case "current":
        return { 0.4: 'blue', 0.65: 'lime', 1: 'red' };
      case "12h":
        return { 0.4: 'green', 0.65: 'yellow', 1: 'red' };
      case "1d":
        return { 0.4: 'yellow', 0.65: 'orange', 1: 'red' };
      case "3d":
        return { 0.4: 'orange', 0.65: 'red', 1: 'darkred' };
      default:
        return { 0.4: 'green', 0.65: 'yellow', 1: 'red' };
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        whenCreated={setMap}
        style={{ height: "100%", width: "100%" }}
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer
          points={getHeatmapPoints()}
          gradient={getHeatmapGradient()}
        />
        {data && data.length > 0 && data.map((entry, index) => {
          if (!entry.latitude || !entry.longitude) return null;
          const position: [number, number] = [entry.latitude, entry.longitude];
          return (
            <Marker 
              key={`marker-${index}`}
              position={position}
            >
              <Popup>
                <div>
                  <h2>Data Point</h2>
                  <p>Latitude: {entry.latitude}</p>
                  <p>Longitude: {entry.longitude}</p>
                  <p>Altitude: {entry.altitude} m</p>
                  <p>HDOP: {entry.hdop}</p>
                  <p>Temperature: {entry.temperature} °C</p>
                  <p>pH: {entry.ph}</p>
                  <p>Dissolved Solids: {entry.dissolvedsolids} mg/L</p>
                  <p>Timestamp: {entry.timestamp}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GpsMap;