import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import GpsDataTable from "@/components/GpsDataTable";
import { GpsData } from "@/types/gps";

interface DataInsightsProps {
  data: GpsData[];
}

export const DataInsights = ({ data }: DataInsightsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Data Insight from Drones</h2>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="overflow-hidden">
          <GpsDataTable data={data} />
        </div>
      </Card>
    </div>
  );
};