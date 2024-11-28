import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import GpsMap from "@/components/GpsMap";
import { useQuery } from '@tanstack/react-query';
import { MapFilters } from "@/components/map/MapFilters";
import { LatestMeasurements } from "@/components/map/LatestMeasurements";
import { supabase } from "@/lib/supabase";

const Map = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"current" | "12h" | "1d" | "3d" | "1w">("current");
  const lastValidMeasurements = React.useRef({
    temperature: null as number | null,
    ph: null as number | null,
    dissolvedsolids: null as number | null,
    timestamp: null as string | null,
  });

  const { data: gpsData = [], isError } = useQuery({
    queryKey: ['gpsData', selectedTimeframe],
    queryFn: async () => {
      try {
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
        } else if (selectedTimeframe === "1w") {
          const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
          query = query.gte('timestamp', oneWeekAgo.toISOString());
        }

        const { data, error } = await query;
        
        if (error) {
          toast({
            title: "Error fetching data",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching GPS data:', error);
        return [];
      }
    },
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    if (gpsData && gpsData[0]) {
      const latestData = gpsData[0];
      lastValidMeasurements.current = {
        temperature: typeof latestData.temperature === 'number' ? latestData.temperature : null,
        ph: typeof latestData.ph === 'number' ? latestData.ph : null,
        dissolvedsolids: typeof latestData.dissolvedsolids === 'number' ? latestData.dissolvedsolids : null,
        timestamp: latestData.timestamp,
      };
    }
  }, [gpsData]);

  const handleTimeframeClick = useCallback((timeframe: "current" | "12h" | "1d" | "3d" | "1w") => {
    setSelectedTimeframe(timeframe);
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
            <GpsMap data={gpsData} timeframe={selectedTimeframe} />
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
              onClick={() => handleTimeframeClick("current")}
            >
              <span className="font-medium">Current Water Hyacinth</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "12h" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => handleTimeframeClick("12h")}
            >
              <span className="font-medium">Prediction 12 hours</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "1d" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => handleTimeframeClick("1d")}
            >
              <span className="font-medium">Prediction 1 day</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "3d" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => handleTimeframeClick("3d")}
            >
              <span className="font-medium">Prediction 3 days</span>
            </Card>
            <Card 
              className={`p-4 cursor-pointer transition-colors text-center ${
                selectedTimeframe === "1w" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
              }`}
              onClick={() => handleTimeframeClick("1w")}
            >
              <span className="font-medium">Prediction 1 week</span>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <LatestMeasurements measurements={lastValidMeasurements.current} />
        </div>
      </div>
    </div>
  );
};

export default Map;