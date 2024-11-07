import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format, addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import GpsMap from "@/components/GpsMap";
import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { MapFilters } from "@/components/map/MapFilters";
import { LatestMeasurements } from "@/components/map/LatestMeasurements";
import type { GpsData } from "@/types/gps";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Map = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [timeFilter, setTimeFilter] = useState("current");

  const { data: gpsData = [], isError } = useQuery({
    queryKey: ['gpsData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gps_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as GpsData[];
    },
    refetchInterval: 5000
  });

  const filterDataByTime = (data: GpsData[]) => {
    const today = new Date();
    
    switch (timeFilter) {
      case "current":
        return data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return isWithinInterval(itemDate, {
            start: startOfDay(today),
            end: endOfDay(today)
          });
        });
      case "1day":
        return data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return isWithinInterval(itemDate, {
            start: startOfDay(addDays(today, 1)),
            end: endOfDay(addDays(today, 1))
          });
        });
      case "2days":
        return data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return isWithinInterval(itemDate, {
            start: startOfDay(addDays(today, 2)),
            end: endOfDay(addDays(today, 2))
          });
        });
      case "3days":
        return data.filter(item => {
          const itemDate = new Date(item.timestamp);
          return isWithinInterval(itemDate, {
            start: startOfDay(addDays(today, 3)),
            end: endOfDay(addDays(today, 3))
          });
        });
      default:
        return data;
    }
  };

  const filteredData = filterDataByTime(gpsData);

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
        <MapFilters
          selectedRegion={selectedRegion}
          selectedSeverity={selectedSeverity}
          onRegionChange={setSelectedRegion}
          onSeverityChange={setSelectedSeverity}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="h-[600px]">
            <GpsMap data={filteredData} />
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
              <span className="font-medium">Current Water Hyacinth</span>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${timeFilter === 'current' ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
              onClick={() => setTimeFilter('current')}
            >
              <span className="font-medium">Current</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${timeFilter === '1day' ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
              onClick={() => setTimeFilter('1day')}
            >
              <span className="font-medium">Prediction 1 day</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${timeFilter === '2days' ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
              onClick={() => setTimeFilter('2days')}
            >
              <span className="font-medium">Prediction 2 days</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${timeFilter === '3days' ? 'bg-primary/10' : 'hover:bg-primary/10'}`}
              onClick={() => setTimeFilter('3days')}
            >
              <span className="font-medium">Prediction 3 days</span>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <LatestMeasurements measurements={filteredData[0]} />
        </div>
      </div>
    </div>
  );
};

export default Map;