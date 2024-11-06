import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const GpsMap = ({ data }: GpsMapProps) => {
  const defaultPosition: [number, number] = [1.3521, 103.8198];

  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(item => [item.latitude, item.longitude]));
      const mapElement = document.querySelector('.map-container');
      if (mapElement) {
        const map = (mapElement as any)._leaflet;
        if (map) {
          map.fitBounds(bounds);
        }
      }
    }
  }, [data]);

  const latestLocation = data[0];

  return (
    <MapContainer
      className="map-container"
      center={defaultPosition}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    </MapContainer>
  );
};

export default GpsMap;