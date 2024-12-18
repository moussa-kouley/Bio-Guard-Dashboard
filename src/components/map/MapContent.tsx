import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';
import HeatmapLayer from './HeatmapLayer';

interface MapContentProps {
  data: GpsData[];
  timeframe: TimeframeType;
  heatmapPoints: [number, number, number][];
  heatmapGradient: Record<string, string>;
}

const MapContent = ({ data, timeframe, heatmapPoints, heatmapGradient }: MapContentProps) => {
  const markers = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    return data
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
      });
  }, [data]);

  return (
    <>
      {timeframe && (
        <HeatmapLayer
          points={heatmapPoints}
          gradient={heatmapGradient}
        />
      )}
      {markers}
    </>
  );
};

export default MapContent;