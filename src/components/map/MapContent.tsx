import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';
import HeatmapLayer from './HeatmapLayer';
import { generateHeatmapPoints, getHeatmapGradient } from '@/utils/heatmapUtils';

interface MapContentProps {
  data: GpsData[];
  timeframe: TimeframeType;
}

const MapContent = ({ data, timeframe }: MapContentProps) => {
  const map = useMap();
  const points = generateHeatmapPoints(timeframe);
  const gradient = getHeatmapGradient(timeframe);

  return (
    <>
      <HeatmapLayer points={points} gradient={gradient} />
      {data.map((entry, index) => {
        if (!entry?.latitude || !entry?.longitude) return null;
        
        return (
          <Marker 
            key={`marker-${index}`}
            position={[entry.latitude, entry.longitude]}
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
  );
};

export default MapContent;