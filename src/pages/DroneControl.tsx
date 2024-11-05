import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCw } from "lucide-react";

const DroneControl = () => {
  const { toast } = useToast();

  const handleDroneAction = (action: string) => {
    toast({
      title: "Drone Action",
      description: `${action} command sent successfully`,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Drone Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Drone #1</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleDroneAction("Start")} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button onClick={() => handleDroneAction("Stop")} variant="outline" className="w-full">
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
            
            <Button onClick={() => handleDroneAction("Recalibrate")} variant="outline" className="w-full">
              <RotateCw className="w-4 h-4 mr-2" />
              Recalibrate
            </Button>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Battery</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Signal</span>
                  <span className="font-medium">Strong</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium">Zone A</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Repeat similar cards for other drones */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Drone #2</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Charging</span>
          </div>
          {/* Similar control interface */}
          <div className="space-y-4">
            {/* ... Similar content as Drone #1 */}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Drone #3</h3>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">Maintenance</span>
          </div>
          {/* Similar control interface */}
          <div className="space-y-4">
            {/* ... Similar content as Drone #1 */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DroneControl;