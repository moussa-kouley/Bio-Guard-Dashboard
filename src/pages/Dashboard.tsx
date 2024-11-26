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
import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import type { GpsData } from "@/types/gps";
import * as React from 'react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const { toast } = useToast();

  const { data: gpsData = [], isError } = useQuery({
    queryKey: ['gpsData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gps_data')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) throw error;
        return data as GpsData[];
      } catch (error) {
        console.error('Error fetching GPS data:', error);
        return [];
      }
    },
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
  });

  React.useEffect(() => {
    const subscription = supabase
      .channel('gps_data_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'gps_data' },
        (payload) => {
          console.log('Real-time update received:', payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isError) {
    toast({
      title: "Error",
      description: "Failed to fetch data from the database",
      variant: "destructive",
    });
  }

  const latestData = gpsData[0];

  return (
    <div className="p-6">
      <DashboardHeader latestData={latestData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MetricCards latestData={latestData} data={gpsData} />
        </div>
        <div className="lg:col-span-1">
          <ImagePrediction />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Hyacinth Growth Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={gpsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="coverage" stroke="#82ca9d" fill="#82ca9d" />
              <Line type="monotone" dataKey="growthRate" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Water Quality Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gpsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ph" stroke="#8884d8" name="pH" />
              <Line type="monotone" dataKey="dissolvedOxygen" stroke="#82ca9d" name="Dissolved Oxygen" />
              <Line type="monotone" dataKey="turbidity" stroke="#ffc658" name="Turbidity" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;