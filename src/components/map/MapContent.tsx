import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { GpsData, TimeframeType } from '@/types/map';

interface MapContentProps {
  data: GpsData[];
  timeframe: TimeframeType;
}

const MapContent: React.FC<MapContentProps> = ({ data }) => {
  return (
    <>
      {data.map((entry, index) => {
        if (!entry?.latitude || !entry?.longitude) return null;
        
        return (
          <Marker 
            key={`marker-${index}`}
            position={[entry.latitude, entry.longitude] as [number, number]}
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