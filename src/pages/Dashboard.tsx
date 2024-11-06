import { useToast } from "@/components/ui/use-toast";
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
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import type { GpsData } from "@/types/gps";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Sample data to insert if table doesn't exist
const sampleData = [
  {
    latitude: 1.3521,
    longitude: 103.8198,
    altitude: 14,
    hdop: 1.2,
    temperature: 28,
    ph: 7.2,
    dissolvedsolids: 450,
    timestamp: new Date().toISOString(),
    f_port: 1
  },
  // Add more sample entries as needed
];

const Dashboard = () => {
  const { toast } = useToast();

  const { data: gpsData = [], isError } = useQuery({
    queryKey: ['gpsData'],
    queryFn: async () => {
      // Check if table exists
      const { data: tableExists } = await supabase
        .from('gps_data')
        .select('count')
        .limit(1);

      // If table doesn't exist or is empty, insert sample data
      if (!tableExists || tableExists.length === 0) {
        const { error: createError } = await supabase
          .from('gps_data')
          .insert(sampleData);

        if (createError) {
          console.error('Error inserting sample data:', createError);
        }
      }

      // Fetch data
      const { data, error } = await supabase
        .from('gps_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as GpsData[];
    },
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  // Subscribe to real-time changes
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

  // Prepare data for charts
  const growthData = gpsData.map(entry => ({
    name: format(new Date(entry.timestamp), 'MMM dd'),
    coverage: (entry.latitude * 0.1).toFixed(1),
    growthRate: (entry.hdop * 0.1).toFixed(1)
  }));

  const waterQualityData = gpsData.map(entry => ({
    name: format(new Date(entry.timestamp), 'MMM dd'),
    ph: entry.ph,
    dissolvedOxygen: entry.dissolvedsolids / 100,
    turbidity: entry.temperature / 10
  }));

  return (
    <div className="p-6">
      <DashboardHeader latestData={latestData} />
      <MetricCards latestData={latestData} data={gpsData} />

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