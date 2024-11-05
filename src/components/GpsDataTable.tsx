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
  const sortedData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Coverage</TableHead>
            <TableHead>Previous Cover.</TableHead>
            <TableHead>Water Quality</TableHead>
            <TableHead>Growth Rate</TableHead>
            <TableHead>Predicted Cov.</TableHead>
            <TableHead>Water Temp.</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{format(new Date(entry.timestamp), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{(entry.latitude * 0.1).toFixed(1)}%</TableCell>
              <TableCell>{(entry.longitude * 0.1).toFixed(1)}%</TableCell>
              <TableCell>{entry.ph.toFixed(1)}</TableCell>
              <TableCell>{(entry.hdop * 0.1).toFixed(1)}%</TableCell>
              <TableCell>{(entry.altitude * 0.1).toFixed(1)}%</TableCell>
              <TableCell>{entry.temperature}°C</TableCell>
              <TableCell>{format(new Date(entry.timestamp), 'HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GpsDataTable;