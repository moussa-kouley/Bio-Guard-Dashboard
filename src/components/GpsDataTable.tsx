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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Latitude</TableHead>
          <TableHead>Longitude</TableHead>
          <TableHead>Altitude</TableHead>
          <TableHead>HDOP</TableHead>
          <TableHead>Temperature</TableHead>
          <TableHead>PH</TableHead>
          <TableHead>Dissolved Solids</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>F-PORT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{entry.latitude}</TableCell>
            <TableCell>{entry.longitude}</TableCell>
            <TableCell>{entry.altitude}</TableCell>
            <TableCell>{entry.hdop}</TableCell>
            <TableCell>{entry.temperature}</TableCell>
            <TableCell>{entry.ph}</TableCell>
            <TableCell>{entry.dissolvedsolids}</TableCell>
            <TableCell>{format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
            <TableCell>{entry.f_port}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GpsDataTable;