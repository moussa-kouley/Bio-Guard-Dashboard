import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import io from "socket.io-client";
import GpsDataTable from "@/components/GpsDataTable";
import GpsMap from "@/components/GpsMap";
import TemperatureChart from "@/components/TemperatureChart";
import { Activity, ThermometerSun, Droplets, Flask } from "lucide-react";

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

  const getLatestData = () => {
    return gpsData[0] || null;
  };

  const latestData = getLatestData();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Water Quality Monitoring Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded">
            <p className="text-sm">LAST UPDATE</p>
            <p className="font-semibold">
              {latestData?.timestamp
                ? new Date(latestData.timestamp).toLocaleString()
                : "No data"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-3">
            <ThermometerSun className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold">{latestData?.temperature || "N/A"}°C</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-3">
            <Flask className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">PH Level</p>
              <p className="text-2xl font-bold">{latestData?.ph || "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Dissolved Solids</p>
              <p className="text-2xl font-bold">{latestData?.dissolvedsolids || "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">HDOP</p>
              <p className="text-2xl font-bold">{latestData?.hdop || "N/A"}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Location Tracking</h2>
          <div className="h-[400px]">
            <GpsMap data={gpsData} />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Temperature Trends</h2>
          <div className="h-[400px]">
            <TemperatureChart data={gpsData} />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Measurements</h2>
        <GpsDataTable data={gpsData} />
      </Card>
    </div>
  );
};

export default Dashboard;