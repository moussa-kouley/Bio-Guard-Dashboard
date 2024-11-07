import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface Measurements {
  temperature: number | null;
  ph: number | null;
  dissolvedsolids: number | null;
  timestamp: string | null;
}

export const LatestMeasurements = ({ measurements }: { measurements: Measurements }) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Latest Measurements</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Temperature</span>
          <span className="font-medium">
            {measurements.temperature !== null 
              ? `${measurements.temperature.toFixed(1)}°C`
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>PH Level</span>
          <span className="font-medium">
            {measurements.ph !== null 
              ? measurements.ph.toFixed(1)
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Dissolved Solids</span>
          <span className="font-medium">
            {measurements.dissolvedsolids !== null 
              ? measurements.dissolvedsolids.toFixed(1)
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Last Update</span>
          <span className="font-medium">
            {measurements.timestamp 
              ? format(new Date(measurements.timestamp), 'HH:mm:ss')
              : 'N/A'}
          </span>
        </div>
      </div>
    </Card>
  );
};