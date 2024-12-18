import { MapContainer, TileLayer } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import HeatmapLegend from './map/HeatmapLegend';
import MapContent from './map/MapContent';

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

  // Create a dummy dataset if no data is available
  const dummyData: GpsData[] = [{
    latitude: -25.7487,
    longitude: 27.8739,
    altitude: 100,
    hdop: 1.0,
    temperature: 25,
    ph: 7.0,
    dissolvedsolids: 500,
    timestamp: new Date().toISOString(),
    f_port: 1
  }];

  const displayData = Array.isArray(data) && data.length > 0 ? data : dummyData;

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
        <MapContent data={displayData} timeframe={timeframe} />
      </MapContainer>
      <HeatmapLegend timeframe={timeframe} />
    </div>
  );
};

export default GpsMap;