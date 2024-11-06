import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
const MapBoundsComponent = ({ data }: { data: GpsData[] }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(item => [item.latitude, item.longitude]));
      map.fitBounds(bounds);
    }
  }, [data, map]);

  return null;
};

const GpsMap = ({ data }: GpsMapProps) => {
  const defaultPosition: [number, number] = [1.3521, 103.8198];
  const latestLocation = data[0];

  return (
    <MapContainer
      className="leaflet-container"
      center={defaultPosition}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latestLocation && (
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
      )}
      <MapBoundsComponent data={data} />
    </MapContainer>
  );
};

export default GpsMap;