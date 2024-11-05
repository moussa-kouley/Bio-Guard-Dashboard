import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Map = () => {
  const { toast } = useToast();
  
  const { data: mapData, isLoading } = useQuery({
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

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Water Hyacinth Map</h1>
        <div className="flex gap-4">
          <select className="border rounded-md p-2">
            <option>All Regions</option>
            <option>Region 1</option>
            <option>Region 2</option>
          </select>
          <select className="border rounded-md p-2">
            <option>All Severities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card className="h-[600px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Map Integration Coming Soon</p>
          </Card>
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