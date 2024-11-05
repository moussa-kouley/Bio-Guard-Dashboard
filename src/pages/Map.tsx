import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import io from "socket.io-client";
import GpsMap from "@/components/GpsMap";

interface GpsData {
  latitude: number;
  longitude: number;
  temperature: number;
  ph: number;
  dissolvedsolids: number;
  timestamp: string;
}

const Map = () => {
  const [gpsData, setGpsData] = useState<GpsData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Use environment variable or fallback for the server URL
    const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;
    const socket = io(serverUrl, {
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${serverUrl}/gps-data`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGpsData(data || []);
      } catch (error) {
        console.error('Failed to fetch GPS data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch GPS data. Please try again later.",
          variant: "destructive",
        });
      }
    };

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time updates",
        variant: "destructive",
      });
    });

    socket.on("gpsDataUpdate", (newData: GpsData) => {
      if (newData) {
        setGpsData(prev => [newData, ...prev]);
      }
    });

    fetchInitialData();

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Water Hyacinth Map</h1>
        <div className="flex gap-4">
          <select 
            className="border rounded-md p-2" 
            defaultValue=""
          >
            <option value="">All Regions</option>
            <option value="region1">Region 1</option>
            <option value="region2">Region 2</option>
          </select>
          <select 
            className="border rounded-md p-2" 
            defaultValue=""
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="h-[600px]">
            {gpsData.length > 0 ? (
              <GpsMap data={gpsData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No GPS data available</p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-6 gap-4">
            <Card className="col-span-2 p-4 bg-primary text-primary-foreground">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>{format(new Date(), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{format(new Date(), "HH:mm:ss")}</span>
                </div>
              </div>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Current</span>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Prediction 12 hours</span>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Prediction 1 day</span>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Prediction 3 days</span>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Latest Measurements</h3>
            <div className="space-y-2">
              {gpsData[0] ? (
                <>
                  <div className="flex justify-between">
                    <span>Temperature</span>
                    <span className="font-medium">{gpsData[0].temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PH Level</span>
                    <span className="font-medium">{gpsData[0].ph}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dissolved Solids</span>
                    <span className="font-medium">{gpsData[0].dissolvedsolids}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update</span>
                    <span className="font-medium">
                      {format(new Date(gpsData[0].timestamp), 'HH:mm:ss')}
                    </span>
                  </div>
                </>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;