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

  // Generate simulated heatmap points based on timeframe
  const getHeatmapPoints = () => {
    // Generate points around Hartbeespoort dam
    const centerLat = -25.7487;
    const centerLng = 27.8739;
    const points: [number, number, number][] = [];
    
    // Number of points to generate based on timeframe
    let numPoints = 50;
    let spread = 0.02; // Base spread in degrees
    
    switch(timeframe) {
      case "current":
        numPoints = 30;
        spread = 0.01;
        break;
      case "12h":
        numPoints = 40;
        spread = 0.015;
        break;
      case "1d":
        numPoints = 50;
        spread = 0.02;
        break;
      case "3d":
        numPoints = 60;
        spread = 0.025;
        break;
      case "1w":
        numPoints = 70;
        spread = 0.03;
        break;
    }
    
    // Generate random points around the center
    for (let i = 0; i < numPoints; i++) {
      const lat = centerLat + (Math.random() - 0.5) * spread;
      const lng = centerLng + (Math.random() - 0.5) * spread;
      
      // Adjust intensity based on timeframe and distance from center
      let intensity = 0.5;
      const distance = Math.sqrt(
        Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
      );
      
      switch(timeframe) {
        case "current":
          intensity = 1.0 - distance * 20;
          break;
        case "12h":
          intensity = 0.8 - distance * 15;
          break;
        case "1d":
          intensity = 0.6 - distance * 10;
          break;
        case "3d":
          intensity = 0.4 - distance * 8;
          break;
        case "1w":
          intensity = 0.2 - distance * 5;
          break;
      }
      
      // Ensure intensity is within bounds
      intensity = Math.max(0.1, Math.min(1, intensity));
      points.push([lat, lng, intensity]);
    }
    
    return points;
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
        whenReady={setMap}
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