import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Search, Battery, Camera, RotateCw } from "lucide-react";

const DroneControl = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDroneAction = (action: string) => {
    toast({
      title: "Drone Action",
      description: `${action} command sent successfully`,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Drone Controls</h1>
      
      {/* Map Section */}
      <div className="w-full h-[400px] bg-gray-100 rounded-lg mb-6 relative">
        <div className="absolute inset-0 bg-[#e6f0f9]">
          {[1, 2, 3].map((point) => (
            <div 
              key={point} 
              className="absolute p-2 bg-primary rounded-full"
              style={{
                left: `${30 * point}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search drones..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Drone Controls */}
      {[1, 2].map((droneId) => (
        <Card key={droneId} className="mb-6 overflow-hidden">
          <div className="bg-secondary p-4 flex justify-between items-center">
            <h3 className="font-semibold">Drone {droneId}</h3>
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              In Flight
            </span>
          </div>
          
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <Button 
                onClick={() => handleDroneAction("Start Flight")}
                className="bg-primary text-white"
              >
                Start Flight
              </Button>
              <Button 
                onClick={() => handleDroneAction("Stop/Return")}
                variant="outline"
              >
                Stop / Return
              </Button>
              <Button 
                onClick={() => handleDroneAction("Locate")}
                variant="outline"
              >
                Locate on map
              </Button>
            </div>

            {/* Battery Status */}
            <div className="w-full h-2 bg-gray-200 rounded mb-6">
              <div className="h-full bg-black rounded" style={{ width: '60%' }}></div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="mx-auto w-16 h-16 mb-2">
                  <img src="/drone-icon.svg" alt="Drone" className="w-full h-full" />
                </div>
                <h4 className="font-medium mb-1">Drone {droneId}</h4>
                <p className="text-sm text-gray-600">Drone one is currently under normal operation</p>
              </Card>

              <Card className="p-4 text-center">
                <RotateCw className="mx-auto w-16 h-16 mb-2" />
                <h4 className="font-medium mb-1">Propeller</h4>
                <p className="text-sm text-gray-600">All the Propellers are properly working</p>
              </Card>

              <Card className="p-4 text-center">
                <Battery className="mx-auto w-16 h-16 mb-2" />
                <h4 className="font-medium mb-1">Drone Battery</h4>
                <p className="text-sm text-gray-600">Drone Battery slightly damaged. Charging time is lower than expected</p>
              </Card>

              <Card className="p-4 text-center">
                <Camera className="mx-auto w-16 h-16 mb-2" />
                <h4 className="font-medium mb-1">Drone Camera</h4>
                <p className="text-sm text-gray-600">Drone Camera has no issues and is operating as it should</p>
              </Card>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DroneControl;