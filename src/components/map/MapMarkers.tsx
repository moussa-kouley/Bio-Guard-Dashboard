import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { GpsData } from '@/types/map';

interface MapMarkersProps {
  data: GpsData[];
}

const MapMarkers = ({ data }: MapMarkersProps) => {
  return (
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
  );
};

export default MapMarkers;