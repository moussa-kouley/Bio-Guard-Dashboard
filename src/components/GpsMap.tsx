import { MapContainer, TileLayer } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import HeatmapLegend from './map/HeatmapLegend';
import { generateHeatmapPoints, getHeatmapGradient } from '@/utils/heatmapUtils';
import { Marker, Popup } from 'react-leaflet';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GpsMapProps {
  data: GpsData[];
  timeframe: TimeframeType;
}

const GpsMap = ({ data, timeframe }: GpsMapProps) => {
  const defaultPosition: [number, number] = [-25.7487, 27.8739];
  const heatmapPoints = generateHeatmapPoints(timeframe);
  const heatmapGradient = getHeatmapGradient(timeframe);

  return (
    <div style={{ height: "100%", width: "100%" }} className="relative">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data
          .filter(entry => entry?.latitude && entry?.longitude)
          .map((entry, index) => {
            const position: [number, number] = [entry.latitude, entry.longitude];
            return (
              <Marker 
                key={`marker-${index}`}
                position={position}
              >
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
            );
          })}
      </MapContainer>
      <HeatmapLegend timeframe={timeframe} />
    </div>
  );
};

export default GpsMap;