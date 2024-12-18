import React, { useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
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

const HeatmapLayer = ({ points, gradient }: { points: [number, number, number][]; gradient: Record<string, string> }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!map || !points?.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 15,
      blur: 10,
      maxZoom: 20,
      gradient,
      minOpacity: 0.3
    });

    map.addLayer(heatLayer);
    
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, gradient]);

  return null;
};

const MapMarkers = React.memo(({ data }: { data: GpsData[] }) => (
  <>
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
  </>
));

MapMarkers.displayName = 'MapMarkers';

const MapContent = React.memo(({ data, points, gradient }: { 
  data: GpsData[]; 
  points: [number, number, number][]; 
  gradient: Record<string, string>; 
}) => (
  <>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <HeatmapLayer points={points} gradient={gradient} />
    <MapMarkers data={data} />
  </>
));

MapContent.displayName = 'MapContent';

const GpsMap = ({ data, timeframe }: GpsMapProps) => {
  const defaultPosition: [number, number] = [-25.7487, 27.8739];
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
        <MapContent 
          data={data}
          points={heatmapPoints}
          gradient={heatmapGradient}
        />
      </MapContainer>
      <HeatmapLegend timeframe={timeframe} />
    </div>
  );
};

export default GpsMap;