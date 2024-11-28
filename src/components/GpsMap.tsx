import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useToast } from "@/components/ui/use-toast";
import type { GpsData } from '@/types/gps';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

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
}

const GpsMap = ({ data }: GpsMapProps) => {
  const { toast } = useToast();
  const [map, setMap] = useState<L.Map | null>(null);
  
  // Hartbeespoort, South Africa coordinates
  const defaultPosition: [number, number] = [-25.7487, 27.8739];

  useEffect(() => {
    if (map) {
      map.setView(defaultPosition, 13);
    }
  }, [map]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        ref={setMap}
        style={{ height: "100%", width: "100%" }}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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