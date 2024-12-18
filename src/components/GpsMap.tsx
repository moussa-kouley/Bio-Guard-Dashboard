import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MapController from './map/MapController';
import HeatmapLayer from './map/HeatmapLayer';
import HeatmapLegend from './map/HeatmapLegend';
import { generateHeatmapPoints, getHeatmapGradient } from '@/utils/heatmapUtils';

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

  const markers = useMemo(() => {
    if (!Array.isArray(data)) return null;
    
    return data.map((entry, index) => {
      if (!entry?.latitude || !entry?.longitude) return null;
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
    });
  }, [data]);

  const heatmapPoints = useMemo(() => generateHeatmapPoints(timeframe), [timeframe]);
  const heatmapGradient = useMemo(() => getHeatmapGradient(timeframe), [timeframe]);

  return (
    <div style={{ height: "100%", width: "100%" }} className="relative">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <MapController center={defaultPosition} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {timeframe && (
          <HeatmapLayer
            points={heatmapPoints}
            gradient={heatmapGradient}
          />
        )}
        {markers}
        <HeatmapLegend timeframe={timeframe} />
      </MapContainer>
    </div>
  );
};

export default GpsMap;