import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "./ui/use-toast";
import type { GpsData } from "@/types/gps";

// Component to handle map bounds
const MapBoundsComponent = ({ data, currentLocation }: { data: GpsData[], currentLocation: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(
        data
          .filter(item => item.latitude && item.longitude)
          .map(item => [item.latitude, item.longitude])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    } else if (currentLocation) {
      map.setView(currentLocation, 13);
    }
  }, [data, currentLocation, map]);

  return null;
};

interface GpsMapProps {
  data: GpsData[];
}

const GpsMap = ({ data }: GpsMapProps) => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const defaultPosition: [number, number] = [1.3521, 103.8198]; // Singapore coordinates as fallback

  useEffect(() => {
    if (data.length === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get current location. Using default position.",
            variant: "destructive",
          });
        }
      );
    }
  }, [data.length, toast]);

  const initialCenter = data.length > 0 && data[0].latitude && data[0].longitude
    ? [data[0].latitude, data[0].longitude] as [number, number]
    : currentLocation || defaultPosition;

  return (
    <MapContainer
      key={`${initialCenter[0]}-${initialCenter[1]}`}
      center={initialCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((point, index) => (
        point.latitude && point.longitude ? (
          <Marker key={index} position={[point.latitude, point.longitude]}>
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
      {currentLocation && data.length === 0 && (
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
      <MapBoundsComponent data={data} currentLocation={currentLocation} />
    </MapContainer>
  );
};

export default GpsMap;