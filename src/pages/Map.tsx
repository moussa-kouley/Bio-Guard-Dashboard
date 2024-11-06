import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import GpsMap from "@/components/GpsMap";
import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

interface GpsData {
  latitude: number;
  longitude: number;
  temperature: number;
  ph: number;
  dissolvedsolids: number;
  timestamp: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Map = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const lastValidMeasurements = useRef({
    temperature: null as number | null,
    ph: null as number | null,
    dissolvedsolids: null as number | null,
    timestamp: null as string | null,
  });

  const { data: gpsData = [], isError, error } = useQuery({
    queryKey: ['gpsData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gps_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as GpsData[];
    },
    refetchInterval: 5000,
  });

  // Update last valid measurements when new data arrives
  React.useEffect(() => {
    if (gpsData && gpsData[0]) {
      const latestData = gpsData[0];
      if (typeof latestData.temperature === 'number' && !isNaN(latestData.temperature)) {
        lastValidMeasurements.current.temperature = latestData.temperature;
      }
      if (typeof latestData.ph === 'number' && !isNaN(latestData.ph)) {
        lastValidMeasurements.current.ph = latestData.ph;
      }
      if (typeof latestData.dissolvedsolids === 'number' && !isNaN(latestData.dissolvedsolids)) {
        lastValidMeasurements.current.dissolvedsolids = latestData.dissolvedsolids;
      }
      lastValidMeasurements.current.timestamp = latestData.timestamp;
    }
  }, [gpsData]);

  React.useEffect(() => {
    const subscription = supabase
      .channel('gps_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gps_data'
        },
        (payload) => {
          // React Query will handle the cache update automatically on the next refetch
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
      description: "Failed to fetch GPS data",
      variant: "destructive",
    });
  }

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Water Hyacinth Map</h1>
        <div className="flex gap-4">
          <select 
            className="border rounded-md p-2" 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            <option value="region1">Region 1</option>
            <option value="region2">Region 2</option>
          </select>
          <select 
            className="border rounded-md p-2" 
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
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
              <div className="flex justify-between">
                <span>Temperature</span>
                <span className="font-medium">
                  {lastValidMeasurements.current.temperature !== null 
                    ? `${lastValidMeasurements.current.temperature.toFixed(1)}°C`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PH Level</span>
                <span className="font-medium">
                  {lastValidMeasurements.current.ph !== null 
                    ? lastValidMeasurements.current.ph.toFixed(1)
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dissolved Solids</span>
                <span className="font-medium">
                  {lastValidMeasurements.current.dissolvedsolids !== null 
                    ? lastValidMeasurements.current.dissolvedsolids.toFixed(1)
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Update</span>
                <span className="font-medium">
                  {lastValidMeasurements.current.timestamp 
                    ? format(new Date(lastValidMeasurements.current.timestamp), 'HH:mm:ss')
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
