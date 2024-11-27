import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GpsData } from '@/types/gps';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GpsMapProps {
  data: GpsData[];
  selectedTimeRange?: string;
}

const GpsMap = ({ data, selectedTimeRange = 'all' }: GpsMapProps) => {
  const defaultPosition: [number, number] = [1.3521, 103.8198];  // Default to Singapore coordinates

  const displayData = data.filter(point => {
    const pointDate = new Date(point.timestamp);
    const now = new Date();
    
    switch (selectedTimeRange) {
      case '1h':
        return now.getTime() - pointDate.getTime() <= 60 * 60 * 1000;
      case '24h':
        return now.getTime() - pointDate.getTime() <= 24 * 60 * 60 * 1000;
      case '7d':
        return now.getTime() - pointDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return now.getTime() - pointDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        zoom={13}
        scrollWheelZoom={false}
        center={defaultPosition}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayData.map((point, index) => (
          point.latitude && point.longitude ? (
            <Marker
              key={index}
              position={[point.latitude, point.longitude]}
            >
              <Popup>
                <div>
                  <p>Timestamp: {new Date(point.timestamp).toLocaleString()}</p>
                  <p>Temperature: {point.temperature}°C</p>
                  <p>pH: {point.ph}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
};

export default GpsMap;