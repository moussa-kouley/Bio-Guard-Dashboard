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
import GpsMap from "@/components/GpsMap";
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
  const [showMap, setShowMap] = React.useState(false);

  // Generate sample data for the last 7 days
  const generateSampleData = () => {
    const data = [];
    const baseDate = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      data.push({
        coverage: 4.5 + Math.random() * 2.5, // Random between 4.5-7%
        growth_rate: 1.0 + Math.random() * 0.5, // Random between 1.0-1.5%
        water_quality: 90 - (Math.random() * 15), // Random between 75-90%
        timestamp: date.toISOString()
      });
    }
    return data;
  };

  const [analysisHistory] = React.useState<AnalysisData[]>(generateSampleData());

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
      
      setShowMap(true); // Show map after analysis
      
      toast({
        title: "Analysis Complete",
        description: "Map view has been updated with the latest analysis.",
      });
    };

    window.addEventListener('newAnalysis', handleNewAnalysis as EventListener);
    return () => {
      window.removeEventListener('newAnalysis', handleNewAnalysis as EventListener);
    };
  }, [toast]);

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

      {showMap && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-4">Hartbeespoort Dam Coverage Map</h2>
          <div className="h-[400px] w-full">
            <GpsMap data={gpsData} timeframe="current" />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Hyacinth Growth Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analysisHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()} 
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === 'coverage' ? 'Coverage' : 'Growth Rate'
                ]}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="coverage" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Coverage"
                opacity={0.6}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="growth_rate" 
                stroke="#8884d8" 
                name="Growth Rate"
                strokeWidth={2}
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
                tickFormatter={(value) => new Date(value).toLocaleDateString()} 
              />
              <YAxis 
                domain={[60, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Water Quality']}
              />
              <Line 
                type="monotone" 
                dataKey="water_quality" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="Water Quality" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;