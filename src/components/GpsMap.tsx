import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useToast } from "@/components/ui/use-toast";
import type { GpsData } from '@/types/gps';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GpsMapProps {
  data: GpsData[];
}

const GpsMap = ({ data }: GpsMapProps) => {
  const { toast } = useToast();
  // Hartbeespoort, South Africa coordinates
  const defaultPosition: L.LatLngExpression = [-25.7487, 27.8739];

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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((entry, index) => (
          <Marker key={index} position={[entry.latitude, entry.longitude]}>
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
        ))}
      </MapContainer>
    </div>
  );
};

export default GpsMap;