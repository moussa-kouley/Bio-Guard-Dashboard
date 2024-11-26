import { useToast } from "@/components/ui/use-toast";
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
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCards } from "@/components/dashboard/MetricCards";
import ImagePrediction from "@/components/ImagePrediction";
import { useQuery } from '@tanstack/react-query';
import type { GpsData } from "@/types/gps";
import * as React from 'react';

interface AnalysisData {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  timestamp: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [analysisHistory, setAnalysisHistory] = React.useState<AnalysisData[]>([]);

  // Sample data for local development
  const sampleGpsData: GpsData[] = [
  {
    latitude: -25.7487,
    longitude: 27.8739,
    altitude: 100,
    hdop: 25,
    temperature: 25,
    ph: 7.0,
    dissolvedsolids: 450,
    timestamp: new Date().toISOString(),
    f_port: 1
  },
  {
    latitude: -25.7490,
    longitude: 27.8742,
    altitude: 102,
    hdop: 26,
    temperature: 26,
    ph: 7.2,
    dissolvedsolids: 455,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    f_port: 1
  }
  ];

  // Simulated data fetching with React Query
  const { data: gpsData = sampleGpsData } = useQuery({
    queryKey: ['gpsData'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleGpsData;
    },
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    const handleNewAnalysis = (event: CustomEvent<{ 
      analysis: string, 
      timestamp: string,
      metrics: {
        coverage: number,
        growth_rate: number,
        water_quality: number
      }
    }>) => {
      const { coverage, growth_rate, water_quality } = event.detail.metrics;
      
      setAnalysisHistory(prev => [...prev, {
        coverage,
        growth_rate,
        water_quality,
        timestamp: event.detail.timestamp
      }]);
    };

    window.addEventListener('newAnalysis', handleNewAnalysis as EventListener);
    return () => {
      window.removeEventListener('newAnalysis', handleNewAnalysis as EventListener);
    };
  }, []);

  return (
    <div className="p-6">
      <DashboardHeader latestData={gpsData[0]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MetricCards latestData={gpsData[0]} data={gpsData} />
        </div>
        <div className="lg:col-span-1">
          <ImagePrediction />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Hyacinth Growth Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analysisHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Coverage']}
              />
              <Area 
                type="monotone" 
                dataKey="coverage" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Coverage"
              />
              <Line 
                type="monotone" 
                dataKey="growth_rate" 
                stroke="#8884d8" 
                name="Growth Rate"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Quality Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysisHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Quality Impact']}
              />
              <Line 
                type="monotone" 
                dataKey="water_quality" 
                stroke="#8884d8" 
                name="Water Quality Impact" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
