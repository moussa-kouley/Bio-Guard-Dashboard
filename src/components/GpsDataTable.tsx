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
    for (const entry of entries) {
      const value = entry[field];
      if (typeof value === 'number' && value !== 0 && !isNaN(value)) {
        return value;
      }
    }
    return null;
  };

  // Get data from last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentData = data.filter(entry => new Date(entry.timestamp) >= fiveMinutesAgo);

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

  const formatValue = (value: number, defaultValue: number = 25): string => {
    if (!value || isNaN(value)) return `${defaultValue.toFixed(1)}%`;
    return `${(value * 0.1).toFixed(1)}%`;
  };

  // Calculate coverage growth rate
  const calculateGrowthRate = (entries: GpsData[]): string => {
    if (entries.length < 2) return '0.0%';
    const latest = entries[0].hdop || 25;
    const oldest = entries[entries.length - 1].hdop || 25;
    const rate = ((latest - oldest) / oldest) * 100;
    return `${rate.toFixed(1)}%`;
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead className="py-2">Date</TableHead>
            <TableHead className="py-2">Coverage</TableHead>
            <TableHead className="py-2">Previous Cover.</TableHead>
            <TableHead className="py-2">Growth Rate</TableHead>
            <TableHead className="py-2">Predicted Cov.</TableHead>
            <TableHead className="py-2">Water Quality</TableHead>
            <TableHead className="py-2">Water Temp.</TableHead>
            <TableHead className="py-2">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => {
            const previousEntry = sortedData[index + 1];
            
            return (
              <TableRow key={index} className="text-xs">
                <TableCell className="py-2">
                  {format(new Date(entry.timestamp), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="py-2">
                  {formatValue(entry.latitude)}
                </TableCell>
                <TableCell className="py-2">
                  {previousEntry ? formatValue(previousEntry.latitude) : formatValue(entry.longitude)}
                </TableCell>
                <TableCell className="py-2">
                  {calculateGrowthRate(sortedData.slice(0, index + 2))}
                </TableCell>
                <TableCell className="py-2">
                  {formatValue(entry.altitude)}
                </TableCell>
                <TableCell className="py-2">
                  {entry.ph ? entry.ph.toFixed(1) : '7.0'}
                </TableCell>
                <TableCell className="py-2">
                  {entry.temperature ? 
                    `${entry.temperature.toFixed(1)}°C` : 
                    '25.0°C'
                  }
                </TableCell>
                <TableCell className="py-2">
                  {format(new Date(entry.timestamp), 'HH:mm:ss')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GpsDataTable;