import React, { useEffect, useRef } from "react";
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
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (data.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(data.map(item => [item.latitude, item.longitude]));
      mapRef.current.fitBounds(bounds);
    }
  }, [data]);

  const latestLocation = data[0];

  return (
    <MapContainer
      ref={mapRef}
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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