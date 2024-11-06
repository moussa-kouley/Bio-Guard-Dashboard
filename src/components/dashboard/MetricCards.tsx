import { Card } from "@/components/ui/card";
import { Download, ThermometerSun, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { GpsData } from "@/types/gps";
import GpsDataTable from "@/components/GpsDataTable";

interface MetricCardsProps {
  latestData?: GpsData;
  data: GpsData[];
}

export const MetricCards = ({ latestData, data }: MetricCardsProps) => {
  const metrics = {
    currentCoverage: "30%",
    previousCoverage: "3.5%",
    growthRate: "1.6%",
    waterQuality: "-13%",
    predictedCoverage: "34%",
    temperature: "23°C"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 col-span-1 lg:col-span-2 gap-3">
        <Card className="p-3 bg-orange-50">
          <h3 className="text-xs font-medium mb-1">Current WH Coverage</h3>
          <p className="text-xl font-bold">{metrics.currentCoverage}</p>
          <p className="text-xs text-gray-600">present coverage area</p>
        </Card>

        <Card className="p-3 bg-blue-50">
          <h3 className="text-xs font-medium mb-1">Previous WH Coverage</h3>
          <p className="text-xl font-bold">{metrics.previousCoverage}</p>
          <p className="text-xs text-gray-600">present coverage area</p>
        </Card>

        <Card className="p-3 bg-green-50">
          <h3 className="text-xs font-medium mb-1">Growth Rate - WH</h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{metrics.growthRate}</p>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xs text-gray-600">per week</p>
        </Card>

        <Card className="p-3 bg-red-50">
          <h3 className="text-xs font-medium mb-1">Water Quality Impact</h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{metrics.waterQuality}</p>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xs text-gray-600">Decrease in water quality</p>
        </Card>

        <Card className="p-3 bg-purple-50">
          <h3 className="text-xs font-medium mb-1">Predicted Coverage</h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{metrics.predictedCoverage}</p>
            <ArrowUpRight className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xs text-gray-600">estimated next month</p>
        </Card>

        <Card className="p-3 bg-yellow-50">
          <h3 className="text-xs font-medium mb-1">Water Temperature</h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{metrics.temperature}</p>
            <ThermometerSun className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-600">Current water temperature</p>
        </Card>
      </div>

      <Card className="col-span-1 lg:col-span-3 p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">Data Insight from Drones</h2>
          <button className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
        <div className="overflow-hidden max-h-[250px]">
          <GpsDataTable data={data} />
        </div>
      </Card>

      <Card className="p-4 col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Findings</h2>
        </div>
        <div className="space-y-3">
          <div className="p-2 bg-blue-100 rounded">
            <p className="text-sm">15% increase in water hyacinth in the northern zone</p>
          </div>
          <div className="p-2 bg-cyan-100 rounded">
            <p className="text-sm">Decrease in dissolved oxygen levels near dense hyacinth patches</p>
          </div>
          <div className="p-2 bg-orange-100 rounded">
            <p className="text-sm">Increased nutrient levels detected in southern zone</p>
          </div>
        </div>
      </Card>
    </div>
  );
};