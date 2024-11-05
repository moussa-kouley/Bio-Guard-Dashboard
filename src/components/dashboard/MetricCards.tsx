import { Card } from "@/components/ui/card";
import { ThermometerSun, FlaskConical, Droplets } from "lucide-react";
import { GpsData } from "@/types/gps";

interface MetricCardsProps {
  latestData?: GpsData;
}

export const MetricCards = ({ latestData }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="p-4 bg-orange-50">
        <h3 className="text-sm font-medium mb-2">Current Coverage</h3>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-3xl font-bold">{latestData?.temperature || "N/A"}°C</p>
            <p className="text-sm text-gray-600">Temperature</p>
          </div>
          <ThermometerSun className="w-8 h-8 text-orange-500" />
        </div>
      </Card>

      <Card className="p-4 bg-blue-50">
        <h3 className="text-sm font-medium mb-2">Water Quality</h3>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-3xl font-bold">{latestData?.ph || "N/A"}</p>
            <p className="text-sm text-gray-600">pH Level</p>
          </div>
          <FlaskConical className="w-8 h-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4 bg-green-50">
        <h3 className="text-sm font-medium mb-2">Dissolved Solids</h3>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-3xl font-bold">{latestData?.dissolvedsolids || "N/A"}</p>
            <p className="text-sm text-gray-600">TDS Level</p>
          </div>
          <Droplets className="w-8 h-8 text-green-500" />
        </div>
      </Card>
    </div>
  );
};