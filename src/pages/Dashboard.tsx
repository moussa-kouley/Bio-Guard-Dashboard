import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import io from "socket.io-client";
import GpsDataTable from "@/components/GpsDataTable";
import GpsMap from "@/components/GpsMap";
import TemperatureChart from "@/components/TemperatureChart";

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

const Dashboard = () => {
  const [gpsData, setGpsData] = useState<GpsData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const socket = io("http://localhost:3000");

    const fetchInitialData = async () => {
      try {
        const response = await fetch("http://localhost:3000/gps-data");
        const data = await response.json();
        setGpsData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch GPS data",
          variant: "destructive",
        });
      }
    };

    socket.on("gpsDataUpdate", (newData: GpsData) => {
      setGpsData(prev => [newData, ...prev]);
    });

    fetchInitialData();

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Real Time GPS Data Monitoring</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded">
            <p className="text-sm">LAST UPDATE</p>
            <p className="font-semibold">
              {gpsData[0]?.timestamp
                ? new Date(gpsData[0].timestamp).toLocaleString()
                : "No data"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Latest Measurements</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded">
              <h3 className="text-sm font-medium">Temperature</h3>
              <p className="text-2xl font-bold">{gpsData[0]?.temperature || "N/A"}°C</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-sm font-medium">PH Level</h3>
              <p className="text-2xl font-bold">{gpsData[0]?.ph || "N/A"}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="text-sm font-medium">Dissolved Solids</h3>
              <p className="text-2xl font-bold">{gpsData[0]?.dissolvedsolids || "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">GPS Location</h2>
          <GpsMap data={gpsData} />
        </Card>
      </div>

      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-4">Temperature Trends</h2>
        <TemperatureChart data={gpsData} />
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent GPS Data</h2>
        <GpsDataTable data={gpsData} />
      </Card>
    </div>
  );
};

export default Dashboard;