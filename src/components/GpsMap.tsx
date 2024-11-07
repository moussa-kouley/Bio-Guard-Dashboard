import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "./ui/use-toast";

interface GpsData {
  latitude: number;
  longitude: number;
  temperature: number;
  ph: number;
  dissolvedsolids: number;
  timestamp: string;
}

interface GpsMapProps {
  data: GpsData[];
}

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

const GpsMap = ({ data }: GpsMapProps) => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const defaultPosition: [number, number] = [1.3521, 103.8198]; // Singapore coordinates as fallback
  const latestLocation = data.length > 0 ? data[0] : null;

  useEffect(() => {
    if (!latestLocation) {
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
  }, [latestLocation, toast]);

  const mapCenter = latestLocation && latestLocation.latitude && latestLocation.longitude
    ? [latestLocation.latitude, latestLocation.longitude] as [number, number]
    : currentLocation || defaultPosition;

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {latestLocation && latestLocation.latitude && latestLocation.longitude ? (
        <Marker position={[latestLocation.latitude, latestLocation.longitude]}>
          <Popup>
            <div>
              <p>Temperature: {latestLocation.temperature}°C</p>
              <p>PH: {latestLocation.ph}</p>
              <p>Dissolved Solids: {latestLocation.dissolvedsolids}</p>
              <p>Timestamp: {new Date(latestLocation.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ) : currentLocation && (
        <Marker position={currentLocation}>
          <Popup>
            <div>
              <p>Current Location</p>
            </div>
          </Popup>
        </Marker>
      )}
      <MapBoundsComponent data={data} currentLocation={currentLocation} />
    </MapContainer>
  );
};

export default GpsMap;