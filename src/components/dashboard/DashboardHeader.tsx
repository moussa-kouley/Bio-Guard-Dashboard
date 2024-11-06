import { format } from "date-fns";
import { GpsData } from "@/types/gps";

interface DashboardHeaderProps {
  latestData?: GpsData;
}

export const DashboardHeader = ({ latestData }: DashboardHeaderProps) => {
  // Get current date for "TODAY IS"
  const currentDate = new Date();
  
  // Set last drone flight to be 2 days ago from current date
  const lastDroneFlight = new Date();
  lastDroneFlight.setDate(currentDate.getDate() - 2);

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real Time Monitoring Dashboard</h1>
      </div>
      <div className="flex justify-end gap-4 bg-green-100/50 p-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">LAST DATE OF DRONE FLIGHT:</span>
          <span className="text-sm">
            {latestData?.timestamp
              ? format(new Date(latestData.timestamp), "dd/MM/yyyy, HH:mm")
              : format(lastDroneFlight, "dd/MM/yyyy, HH:mm")}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-1">
          <span className="text-sm font-medium">TODAY IS:</span>
          <span className="text-sm">{format(currentDate, "dd/MM/yyyy, HH:mm")}</span>
        </div>
      </div>
    </div>
  );
};