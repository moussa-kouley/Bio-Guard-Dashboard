import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import { GpsMap } from "@/components/GpsMap";
import { createClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { MapFilters } from "@/components/map/MapFilters";
import { LatestMeasurements } from "@/components/map/LatestMeasurements";
import TemperatureChart from "@/components/TemperatureChart";
import { GrowthPredictor } from "@/components/predictions/GrowthPredictor";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Map = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("current");

  const { data: gpsData = [], isError } = useQuery({
    queryKey: ['gpsData', selectedTimeframe],
    queryFn: async () => {
      let query = supabase
        .from('gps_data')
        .select('*')
        .order('timestamp', { ascending: false });

      const now = new Date();
      if (selectedTimeframe === "12h") {
        const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000));
        query = query.gte('timestamp', twelveHoursAgo.toISOString());
      } else if (selectedTimeframe === "1d") {
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        query = query.gte('timestamp', oneDayAgo.toISOString());
      } else if (selectedTimeframe === "3d") {
        const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
        query = query.gte('timestamp', threeDaysAgo.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

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
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "current" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedTimeframe("current")}
            >
              <span className="font-medium">Current Water Hyacinth</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "12h" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedTimeframe("12h")}
            >
              <span className="font-medium">Prediction 12 hours</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "1d" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedTimeframe("1d")}
            >
              <span className="font-medium">Prediction 1 day</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "3d" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedTimeframe("3d")}
            >
              <span className="font-medium">Prediction 3 days</span>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <LatestMeasurements measurements={gpsData[0]} />
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Temperature Trend</h3>
            <TemperatureChart data={gpsData} />
          </Card>
          <GrowthPredictor data={gpsData} />
        </div>
      </div>
    </div>
  );
};

export default Map;