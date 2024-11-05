import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";

interface Location {
  id: number;
  name: string;
  severity: string;
}

interface MapData {
  locations: Location[];
}

const Map = () => {
  const { toast } = useToast();
  
  const { data: mapData, isLoading } = useQuery<MapData>({
    queryKey: ['map-data'],
    queryFn: async () => {
      // Simulated API call
      return {
        locations: [
          { id: 1, name: "Location 1", severity: "high" },
          { id: 2, name: "Location 2", severity: "medium" },
          { id: 3, name: "Location 3", severity: "low" },
        ]
      };
    }
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Safe event handling
    const value = e.target.value;
    if (value) {
      toast({
        title: "Filter applied",
        description: `Filtered by ${value}`,
      });
    }
  };

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Water Hyacinth Map</h1>
        <div className="flex gap-4">
          <select className="border rounded-md p-2" onChange={handleFilterChange}>
            <option value="">All Regions</option>
            <option value="region1">Region 1</option>
            <option value="region2">Region 2</option>
          </select>
          <select className="border rounded-md p-2" onChange={handleFilterChange}>
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="h-[600px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Map Integration Coming Soon</p>
          </Card>

          {/* Prediction Timeline */}
          <div className="grid grid-cols-6 gap-4">
            <Card className="col-span-2 p-4 bg-primary text-primary-foreground">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <span>{format(new Date(), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{format(new Date(), "HH:mm:ss")}</span>
                </div>
              </div>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Current</span>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Prediction 12 hours</span>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Prediction 1 day</span>
            </Card>
            <Card className="p-4 hover:bg-primary/10 cursor-pointer transition-colors text-center">
              <span className="font-medium">Prediction 3 days</span>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Areas</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span>High Severity</span>
                <span className="text-red-500 font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Medium Severity</span>
                <span className="text-yellow-500 font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span>Low Severity</span>
                <span className="text-green-500 font-medium">3</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Recent Updates</h3>
            <div className="space-y-2">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                mapData?.locations.map((location) => (
                  <div key={location.id} className="p-2 bg-gray-50 rounded">
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-500">Severity: {location.severity}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;