import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ImagePredictor } from "@/components/dashboard/ImagePredictor";
import { GrowthPredictor } from "@/components/predictions/GrowthPredictor";
import type { GpsData } from "@/types/gps";

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
          <GrowthPredictor data={gpsData} />
          <ImagePredictor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;