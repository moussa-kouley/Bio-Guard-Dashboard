import { format } from "date-fns";
import { GpsData } from "@/types/gps";

interface DashboardHeaderProps {
  latestData?: GpsData;
}

export const DashboardHeader = ({ latestData }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Real Time Monitoring Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-2 rounded">
          <p className="text-sm">LAST UPDATE</p>
          <p className="font-semibold">
            {latestData?.timestamp
              ? format(new Date(latestData.timestamp), "dd/MM/yyyy, HH:mm")
              : "No data"}
          </p>
        </div>
      </div>
    </div>
  );
};