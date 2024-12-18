import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';
import HeatmapLayer from './HeatmapLayer';
import { generateHeatmapPoints, getHeatmapGradient } from '@/utils/heatmapUtils';

interface MapContentProps {
  data: GpsData[];
  timeframe: TimeframeType;
}

const MapContent: React.FC<MapContentProps> = ({ data, timeframe }) => {
  const map = useMap();
  const points = generateHeatmapPoints(timeframe);
  const gradient = getHeatmapGradient(timeframe);

  if (!map || !data) return null;

  return (
    <>
      <HeatmapLayer points={points} gradient={gradient} />
      {data.map((entry, index) => {
        if (!entry?.latitude || !entry?.longitude) return null;
        
        const position: [number, number] = [entry.latitude, entry.longitude];
        
        return (
          <Marker 
            key={`marker-${index}`}
            position={position}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold">Data Point {index + 1}</h3>
                <p>Latitude: {entry.latitude.toFixed(4)}</p>
                <p>Longitude: {entry.longitude.toFixed(4)}</p>
                <p>Altitude: {entry.altitude} m</p>
                <p>HDOP: {entry.hdop}</p>
                <p>Temperature: {entry.temperature}°C</p>
                <p>pH: {entry.ph}</p>
                <p>Dissolved Solids: {entry.dissolvedsolids} mg/L</p>
                <p>Time: {new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MapContent;