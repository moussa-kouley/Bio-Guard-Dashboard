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
  const sortedData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

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
              <TableCell className="py-2">{(entry.latitude * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{(entry.longitude * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{entry.ph.toFixed(1)}</TableCell>
              <TableCell className="py-2">{(entry.hdop * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{(entry.altitude * 0.1).toFixed(1)}%</TableCell>
              <TableCell className="py-2">{entry.temperature}°C</TableCell>
              <TableCell className="py-2">{format(new Date(entry.timestamp), 'HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GpsDataTable;