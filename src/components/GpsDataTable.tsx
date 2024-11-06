import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface GpsData {
  latitude: number;
  longitude: number;
  altitude: number;
  hdop: number;
  temperature: number;
  ph: number;
  dissolvedsolids: number;
  timestamp: string;
  f_port: number;
}

interface GpsDataTableProps {
  data: GpsData[];
}

const GpsDataTable = ({ data }: GpsDataTableProps) => {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No data available
      </div>
    );
  }

  // Function to find the latest valid value for a specific field
  const getLatestValidValue = (entries: GpsData[], field: keyof GpsData): number | null => {
    return entries.reduce((latest: number | null, entry) => {
      const value = entry[field];
      if (typeof value === 'number' && value !== 0 && !isNaN(value)) {
        return latest === null ? value : latest;
      }
      return latest;
    }, null);
  };

  const sortedData = [...data]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  if (sortedData.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        Waiting for valid data entries...
      </div>
    );
  }

  const formatValue = (currentValue: number | null, entries: GpsData[], field: keyof GpsData, suffix: string = '%', multiplier: number = 0.1) => {
    let valueToUse = currentValue;
    if (valueToUse === null || valueToUse === 0) {
      valueToUse = getLatestValidValue(entries, field);
    }
    if (valueToUse === null) return '0.0%';
    return `${(valueToUse * multiplier).toFixed(1)}${suffix}`;
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead className="py-2">Date</TableHead>
            <TableHead className="py-2">Coverage</TableHead>
            <TableHead className="py-2">Previous Cover.</TableHead>
            <TableHead className="py-2">Water Quality</TableHead>
            <TableHead className="py-2">Growth Rate</TableHead>
            <TableHead className="py-2">Predicted Cov.</TableHead>
            <TableHead className="py-2">Water Temp.</TableHead>
            <TableHead className="py-2">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => (
            <TableRow key={index} className="text-xs">
              <TableCell className="py-2">
                {format(new Date(entry.timestamp), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="py-2">
                {formatValue(entry.latitude, sortedData, 'latitude')}
              </TableCell>
              <TableCell className="py-2">
                {formatValue(entry.longitude, sortedData, 'longitude')}
              </TableCell>
              <TableCell className="py-2">
                {entry.ph ? entry.ph.toFixed(1) : formatValue(entry.ph, sortedData, 'ph', '', 1)}
              </TableCell>
              <TableCell className="py-2">
                {formatValue(entry.hdop, sortedData, 'hdop')}
              </TableCell>
              <TableCell className="py-2">
                {formatValue(entry.altitude, sortedData, 'altitude')}
              </TableCell>
              <TableCell className="py-2">
                {entry.temperature ? 
                  `${entry.temperature.toFixed(1)}°C` : 
                  `${formatValue(entry.temperature, sortedData, 'temperature', '°C', 1)}`
                }
              </TableCell>
              <TableCell className="py-2">
                {format(new Date(entry.timestamp), 'HH:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GpsDataTable;