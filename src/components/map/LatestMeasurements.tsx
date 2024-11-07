import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface Measurements {
  temperature: number | null;
  ph: number | null;
  dissolvedsolids: number | null;
  timestamp: string | null;
}

export const LatestMeasurements = ({ measurements }: { measurements?: Measurements }) => {
  // Add default values if measurements is undefined
  const defaultMeasurements = {
    temperature: null,
    ph: null,
    dissolvedsolids: null,
    timestamp: null,
  };

  const data = measurements || defaultMeasurements;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Latest Measurements</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Temperature</span>
          <span className="font-medium">
            {data.temperature !== null 
              ? `${data.temperature.toFixed(1)}°C`
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>PH Level</span>
          <span className="font-medium">
            {data.ph !== null 
              ? data.ph.toFixed(1)
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Dissolved Solids</span>
          <span className="font-medium">
            {data.dissolvedsolids !== null 
              ? data.dissolvedsolids.toFixed(1)
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Last Update</span>
          <span className="font-medium">
            {data.timestamp 
              ? format(new Date(data.timestamp), 'HH:mm:ss')
              : 'N/A'}
          </span>
        </div>
      </div>
    </Card>
  );
};