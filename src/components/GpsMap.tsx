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

// Sample data to use when Supabase fails
const sampleData: GpsData[] = [
  {
    latitude: 1.3521,
    longitude: 103.8198,
    altitude: 15,
    hdop: 1.2,
    temperature: 28.5,
    ph: 7.2,
    dissolvedsolids: 450,
    timestamp: new Date().toISOString(),
    f_port: 1
  },
  {
    latitude: 1.3551,
    longitude: 103.8228,
    altitude: 12,
    hdop: 1.1,
    temperature: 29.0,
    ph: 7.1,
    dissolvedsolids: 460,
    timestamp: new Date().toISOString(),
    f_port: 1
  }
];

const GpsMap = ({ data }: GpsMapProps) => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const defaultPosition: [number, number] = [1.3521, 103.8198]; // Singapore coordinates
  const displayData = data.length > 0 ? data : sampleData;

  useEffect(() => {
    // Only get current location if we don't have any data
    if (displayData.length === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          toast({
            title: "Location Error",
            description: "Could not get current location. Using default position.",
            variant: "destructive",
          });
        }
      );
    }
  }, [displayData.length, toast]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attributionUrl='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {displayData.map((point, index) => (
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
        {currentLocation && displayData.length === 0 && (
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