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
      defaultCenter={initialCenter}
      defaultZoom={13}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((point, index) => (
        point.latitude && point.longitude ? (
          <div key={index} className="absolute bg-white p-2 rounded shadow-lg z-50" style={{
            left: `${(point.longitude + 180) / 360 * 100}%`,
            top: `${(90 - point.latitude) / 180 * 100}%`
          }}>
            <h3 className="font-semibold">GPS Data Point {index + 1}</h3>
            <p><strong>Lat:</strong> {point.latitude.toFixed(4)}</p>
            <p><strong>Long:</strong> {point.longitude.toFixed(4)}</p>
            <p><strong>Alt:</strong> {point.altitude ? `${point.altitude}m` : 'N/A'}</p>
            <p><strong>Temp:</strong> {point.temperature ? `${point.temperature}°C` : 'N/A'}</p>
            <p><strong>pH:</strong> {point.ph || 'N/A'}</p>
            <p><strong>TDS:</strong> {point.dissolvedsolids || 'N/A'}</p>
          </div>
        ) : null
      ))}
      {currentLocation && data.length === 0 && (
        <div className="absolute bg-white p-2 rounded shadow-lg z-50" style={{
          left: `${(currentLocation[1] + 180) / 360 * 100}%`,
          top: `${(90 - currentLocation[0]) / 180 * 100}%`
        }}>
          <h3 className="font-semibold">Current Location</h3>
          <p><strong>Lat:</strong> {currentLocation[0].toFixed(4)}</p>
          <p><strong>Long:</strong> {currentLocation[1].toFixed(4)}</p>
        </div>
      )}
      <MapBoundsComponent data={data} currentLocation={currentLocation} />
    </MapContainer>
  );
};

export default GpsMap;