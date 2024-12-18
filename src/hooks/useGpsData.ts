import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import type { GpsData } from "@/types/gps";

export const useGpsData = (timeframe: "current" | "12h" | "1d" | "3d" | "1w") => {
  return useQuery({
    queryKey: ['gpsData', timeframe],
    queryFn: async () => {
      try {
        const now = new Date();
        let query = supabase
          .from('gps_data')
          .select('*')
          .order('timestamp', { ascending: false });

        // Apply timeframe filters
        switch (timeframe) {
          case "12h":
            query = query.gte('timestamp', new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString());
            break;
          case "1d":
            query = query.gte('timestamp', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString());
            break;
          case "3d":
            query = query.gte('timestamp', new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString());
            break;
          case "1w":
            query = query.gte('timestamp', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());
            break;
        }

        const { data, error } = await query;
        
        if (error) {
          throw error;
        }

        return (data || []) as GpsData[];
      } catch (error) {
        console.error('Error fetching GPS data:', error);
        // Return empty array instead of throwing to handle error gracefully
        return [];
      }
    },
    refetchInterval: 5000,
  });
};