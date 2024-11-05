import { useToast } from "@/components/ui/use-toast";
import io from "socket.io-client";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { DataInsights } from "@/components/dashboard/DataInsights";
import type { GpsData } from "@/types/gps";

const Dashboard = () => {
  const [gpsData, setGpsData] = useState<GpsData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
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

  const getLatestData = () => {
    return gpsData.length > 0 ? gpsData[0] : undefined;
  };

  const latestData = getLatestData();

  // Mock data for charts
  const growthData = [
    { name: 'Jan', coverage: 15, growthRate: 0.8 },
    { name: 'Feb', coverage: 18, growthRate: 1.2 },
    { name: 'Mar', coverage: 25, growthRate: 1.5 },
    { name: 'Apr', coverage: 28, growthRate: 1.8 },
    { name: 'May', coverage: 30, growthRate: 2.0 },
  ];

  const waterQualityData = [
    { name: 'Jan', ph: 7, dissolvedOxygen: 8, turbidity: 5 },
    { name: 'Feb', ph: 6.8, dissolvedOxygen: 7.5, turbidity: 5.5 },
    { name: 'Mar', ph: 6.9, dissolvedOxygen: 7.8, turbidity: 5.2 },
    { name: 'Apr', ph: 7.1, dissolvedOxygen: 8.2, turbidity: 4.8 },
    { name: 'May', ph: 7.0, dissolvedOxygen: 8.0, turbidity: 5.0 },
  ];

  return (
    <div className="p-6">
      <DashboardHeader latestData={latestData} />
      <MetricCards latestData={latestData} />
      <DataInsights data={gpsData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Hyacinth Growth Analysis</h2>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="coverage" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                <Line type="monotone" dataKey="growthRate" stroke="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Quality Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <LineChart data={waterQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ph" stroke="#8884d8" name="pH" />
                <Line type="monotone" dataKey="dissolvedOxygen" stroke="#82ca9d" name="Dissolved Oxygen" />
                <Line type="monotone" dataKey="turbidity" stroke="#ffc658" name="Turbidity" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Action & Recommendations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Interventions Needed</h3>
              <div className="space-y-2">
                <div className="p-2 bg-red-100 rounded">
                  <p className="text-sm">Deploy harvesters to remove hyacinth in the northern zone</p>
                </div>
                <div className="p-2 bg-orange-100 rounded">
                  <p className="text-sm">Introduce biological control agents in areas with new hyacinth growth</p>
                </div>
                <div className="p-2 bg-orange-100 rounded">
                  <p className="text-sm">Implement nutrient management strategies in the western zone</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Tips for Prevention</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm">Implement nutrient management strategies</span>
                  <span className="text-sm text-green-600">65% effective</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm">Introduce biological control agents</span>
                  <span className="text-sm text-green-600">85% effective</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm">Conduct regular mechanical removal</span>
                  <span className="text-sm text-green-600">49% effective</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
