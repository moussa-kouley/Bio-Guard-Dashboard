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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      toast({
        title: "Filter applied",
        description: `Filtered by ${value}`,
      });
    }
  };

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Water Hyacinth Map</h1>
        <div className="flex gap-4">
          <select 
            className="border rounded-md p-2" 
            onChange={handleFilterChange}
            defaultValue=""
          >
            <option value="">All Regions</option>
            <option value="region1">Region 1</option>
            <option value="region2">Region 2</option>
          </select>
          <select 
            className="border rounded-md p-2" 
            onChange={handleFilterChange}
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
            <GpsMap data={gpsData} />
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
              <div className="flex justify-between">
                <span>Temperature</span>
                <span className="font-medium">{gpsData[0]?.temperature || 'N/A'}°C</span>
              </div>
              <div className="flex justify-between">
                <span>PH Level</span>
                <span className="font-medium">{gpsData[0]?.ph || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Dissolved Solids</span>
                <span className="font-medium">{gpsData[0]?.dissolvedsolids || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Update</span>
                <span className="font-medium">
                  {gpsData[0]?.timestamp 
                    ? format(new Date(gpsData[0].timestamp), 'HH:mm:ss')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;