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
  // Add null check for data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No data available
      </div>
    );
  }

  const sortedData = [...data]
    .filter(entry => entry && entry.timestamp) // Filter out invalid entries
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  if (sortedData.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No valid data entries available
      </div>
    );
  }

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
              <TableCell className="py-2">{format(new Date(entry.timestamp), 'dd/MM/yyyy')}</TableCell>
              <TableCell className="py-2">{((entry.latitude || 0) * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{((entry.longitude || 0) * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{(entry.ph || 0).toFixed(1)}</TableCell>
              <TableCell className="py-2">{((entry.hdop || 0) * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{((entry.altitude || 0) * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{entry.temperature || 0}°C</TableCell>
              <TableCell className="py-2">{format(new Date(entry.timestamp), 'HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GpsDataTable;