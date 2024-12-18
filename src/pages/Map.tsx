import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import GpsMap from "@/components/GpsMap";
import { MapFilters } from "@/components/map/MapFilters";
import { LatestMeasurements } from "@/components/map/LatestMeasurements";
import { useGpsData } from "@/hooks/useGpsData";

const Map = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"current" | "12h" | "1d" | "3d" | "1w">("current");

  const { data: gpsData, error } = useGpsData(selectedTimeframe);

  // Show error toast if data fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Using fallback data for demonstration",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleTimeframeClick = (timeframe: typeof selectedTimeframe) => {
    setSelectedTimeframe(timeframe);
  };

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
            <GpsMap data={gpsData || []} timeframe={selectedTimeframe} />
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
            {["current", "12h", "1d", "3d", "1w"].map((timeframe) => (
              <Card 
                key={timeframe}
                className={`p-4 cursor-pointer transition-colors text-center ${
                  selectedTimeframe === timeframe ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                }`}
                onClick={() => handleTimeframeClick(timeframe as typeof selectedTimeframe)}
              >
                <span className="font-medium">
                  {timeframe === "current" ? "Current Water Hyacinth" :
                   `Prediction ${timeframe}`}
                </span>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <LatestMeasurements 
            measurements={gpsData?.[0] ? {
              temperature: gpsData[0].temperature,
              ph: gpsData[0].ph,
              dissolvedsolids: gpsData[0].dissolvedsolids,
              timestamp: gpsData[0].timestamp,
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Map;