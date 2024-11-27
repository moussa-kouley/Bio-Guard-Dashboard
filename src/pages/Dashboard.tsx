import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ImagePredictor } from "@/components/dashboard/ImagePredictor";
import { GrowthPredictor } from "@/components/predictions/GrowthPredictor";
import TemperatureChart from "@/components/TemperatureChart";
import type { GpsData } from "@/types/gps";
import { Card } from "@/components/ui/card";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const { data: gpsData = [] } = useQuery<GpsData[]>({
    queryKey: ["gps-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gps_data")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6">
      <div className="space-y-6">
        <MetricCards latestData={gpsData[0]} data={gpsData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Temperature Trends</h3>
            <TemperatureChart data={gpsData} />
          </Card>
          <GrowthPredictor data={gpsData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Water Quality Analysis</h3>
            <div className="space-y-4">
              {gpsData[0] && (
                <>
                  <div className="flex justify-between items-center">
                    <span>pH Level</span>
                    <span className="font-semibold">{gpsData[0].ph || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dissolved Solids</span>
                    <span className="font-semibold">{gpsData[0].dissolvedsolids || 'N/A'} ppm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Water Temperature</span>
                    <span className="font-semibold">{gpsData[0].temperature ? `${gpsData[0].temperature}°C` : 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </Card>
          <ImagePredictor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;