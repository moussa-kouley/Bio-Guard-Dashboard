import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "./ui/use-toast";
import type { GpsData } from "@/types/gps";
import L from "leaflet";

// Fix Leaflet default icon issue
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
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  // Hartbeespoort, South Africa coordinates
  const hartbeespoortPosition: [number, number] = [-25.7487, 27.8739];

  useEffect(() => {
    if (!data.length) {
      setCurrentLocation(hartbeespoortPosition);
    }
  }, [data.length]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={hartbeespoortPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((point, index) => (
          point.latitude && point.longitude ? (
            <Marker 
              key={index} 
              position={[point.latitude, point.longitude]}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-semibold">GPS Data Point {index + 1}</h3>
                  <p><strong>Latitude:</strong> {point.latitude.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {point.longitude.toFixed(6)}</p>
                  <p><strong>Altitude:</strong> {point.altitude ? `${point.altitude}m` : 'N/A'}</p>
                  <p><strong>HDOP:</strong> {point.hdop || 'N/A'}</p>
                  <p><strong>Temperature:</strong> {point.temperature ? `${point.temperature}°C` : 'N/A'}</p>
                  <p><strong>pH:</strong> {point.ph || 'N/A'}</p>
                  <p><strong>Dissolved Solids:</strong> {point.dissolvedsolids || 'N/A'}</p>
                  <p><strong>Port:</strong> {point.f_port || 'N/A'}</p>
                  <p><strong>Timestamp:</strong> {new Date(point.timestamp).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
        {currentLocation && !data.length && (
          <Marker position={currentLocation}>
            <Popup>
              <div>
                <h3 className="font-semibold">Current Location</h3>
                <p><strong>Latitude:</strong> {currentLocation[0].toFixed(6)}</p>
                <p><strong>Longitude:</strong> {currentLocation[1].toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default GpsMap;