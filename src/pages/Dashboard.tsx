import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import io from "socket.io-client";
import { Activity, ThermometerSun, Droplets, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

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
    return gpsData.length > 0 ? gpsData[0] : null;
  };

  const latestData = getLatestData();

  const alerts = [
    { severity: "critical", message: "Water quality levels critical in northern zone" },
    { severity: "warning", message: "Dissolved solids approaching threshold in western zone" },
  ];

  const recommendations = [
    { title: "Deploy water quality sensors", effectiveness: "85%" },
    { title: "Implement filtration system", effectiveness: "65%" },
    { title: "Regular monitoring schedule", effectiveness: "49%" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Real Time Monitoring Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded">
            <p className="text-sm">LAST UPDATE</p>
            <p className="font-semibold">
              {latestData?.timestamp
                ? format(new Date(latestData.timestamp), "dd/MM/yyyy, HH:mm")
                : "No data"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 bg-orange-50">
          <h3 className="text-sm font-medium mb-2">Current Coverage</h3>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold">{latestData?.temperature || "N/A"}°C</p>
              <p className="text-sm text-gray-600">Temperature</p>
            </div>
            <ThermometerSun className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-blue-50">
          <h3 className="text-sm font-medium mb-2">Water Quality</h3>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold">{latestData?.ph || "N/A"}</p>
              <p className="text-sm text-gray-600">pH Level</p>
            </div>
            <FlaskConical className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-green-50">
          <h3 className="text-sm font-medium mb-2">Dissolved Solids</h3>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold">{latestData?.dissolvedsolids || "N/A"}</p>
              <p className="text-sm text-gray-600">TDS Level</p>
            </div>
            <Droplets className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Quality Trends</h2>
          <div className="h-[300px]">
            {gpsData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={gpsData.slice(0, 20).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => format(new Date(value), "HH:mm")}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy HH:mm")}
                  />
                  <Line type="monotone" dataKey="ph" stroke="#2196F3" name="pH" />
                  <Line type="monotone" dataKey="dissolvedsolids" stroke="#4CAF50" name="TDS" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No data available</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Alerts & Recommendations</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Recent Alerts</h3>
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-2 rounded mb-2 ${
                    alert.severity === "critical" ? "bg-red-100" : "bg-yellow-100"
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-medium mb-2">Recommendations</h3>
              {recommendations.map((rec, index) => (
                <div key={index} className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
                  <span>{rec.title}</span>
                  <span className="text-sm text-green-600">{rec.effectiveness}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;