import { Card } from "@/components/ui/card";
import GpsDataTable from "@/components/GpsDataTable";
import { GpsData } from "@/types/gps";

interface DataInsightsProps {
  data: GpsData[];
}

export const DataInsights = ({ data }: DataInsightsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Data Insight from Drones</h2>
        <div className="overflow-hidden">
          <GpsDataTable data={data} />
        </div>
      </Card>
    </div>
  );
};