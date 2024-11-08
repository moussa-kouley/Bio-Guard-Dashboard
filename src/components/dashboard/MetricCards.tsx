import { Card } from "@/components/ui/card";
import { Download, ThermometerSun, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { GpsData } from "@/types/gps";
import GpsDataTable from "@/components/GpsDataTable";

interface MetricCardsProps {
  latestData?: GpsData;
  data: GpsData[];
}

export const MetricCards = ({ latestData, data }: MetricCardsProps) => {
  // Filter data from last 20 minutes
  const last20MinData = data.filter(entry => {
    const entryTime = new Date(entry.timestamp).getTime();
    const twentyMinutesAgo = new Date().getTime() - 20 * 60 * 1000;
    return entryTime >= twentyMinutesAgo;
  });

  // Calculate metrics from the filtered data
  const calculateMetrics = () => {
    if (!last20MinData.length) return {
      currentCoverage: "0%",
      previousCoverage: "0%",
      growthRate: "0%",
      waterQuality: "0%",
      predictedCoverage: "0%",
      temperature: "0°C"
    };

    const avgLatitude = last20MinData.reduce((sum, entry) => sum + (entry.latitude || 0), 0) / last20MinData.length;
    const avgLongitude = last20MinData.reduce((sum, entry) => sum + (entry.longitude || 0), 0) / last20MinData.length;
    const avgTemp = last20MinData.reduce((sum, entry) => sum + (entry.temperature || 0), 0) / last20MinData.length;
    const avgPh = last20MinData.reduce((sum, entry) => sum + (entry.ph || 0), 0) / last20MinData.length;

    // Calculate current coverage (using latitude as a proxy)
    const currentCoverage = (avgLatitude * 0.1).toFixed(1);
    
    // Calculate previous coverage (using longitude as a proxy)
    const previousCoverage = (avgLongitude * 0.1).toFixed(1);
    
    // Calculate growth rate based on hdop
    const growthRate = last20MinData.length > 0 
      ? ((last20MinData[0].hdop || 0) * 0.1).toFixed(1)
      : "0";

    // Water quality based on pH
    const waterQuality = ((avgPh - 7) * 10).toFixed(1);

    // Predicted coverage based on altitude
    const predictedCoverage = last20MinData.length > 0 
      ? ((last20MinData[0].altitude || 0) * 0.1).toFixed(1)
      : "0";

    return {
      currentCoverage: `${currentCoverage}%`,
      previousCoverage: `${previousCoverage}%`,
      growthRate: `${growthRate}%`,
      waterQuality: `${waterQuality}%`,
      predictedCoverage: `${predictedCoverage}%`,
      temperature: `${avgTemp.toFixed(1)}°C`
    };
  };

  const metrics = calculateMetrics();

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