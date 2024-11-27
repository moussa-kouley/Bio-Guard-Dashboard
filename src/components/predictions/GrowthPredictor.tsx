import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, ThermometerSun } from "lucide-react";
import type { GpsData } from "@/types/gps";

interface GrowthPredictorProps {
  data: GpsData[];
}

export const GrowthPredictor = ({ data }: GrowthPredictorProps) => {
  const calculatePredictions = () => {
    if (!data.length) return null;

    const recentData = data.slice(-5); // Last 5 readings
    
    // Calculate averages
    const avgTemp = recentData.reduce((sum, d) => sum + (d.temperature || 0), 0) / recentData.length;
    const avgPh = recentData.reduce((sum, d) => sum + (d.ph || 0), 0) / recentData.length;
    const avgTds = recentData.reduce((sum, d) => sum + (d.dissolvedsolids || 0), 0) / recentData.length;

    // Simple prediction model based on optimal growth conditions
    const tempScore = Math.min(100, Math.max(0, 100 - Math.abs(avgTemp - 25) * 5)); // Optimal temp ~25°C
    const phScore = Math.min(100, Math.max(0, 100 - Math.abs(avgPh - 7) * 20)); // Optimal pH ~7
    const tdsScore = Math.min(100, (avgTds / 1000) * 100); // TDS score

    const growthProbability = (tempScore + phScore + tdsScore) / 3;

    return {
      growthProbability,
      temperature: avgTemp,
      ph: avgPh,
      tds: avgTds,
    };
  };

  const predictions = calculatePredictions();

  if (!predictions) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">Insufficient data for predictions</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Growth Prediction</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Growth Probability</span>
            <span className="text-sm font-medium">{predictions.growthProbability.toFixed(1)}%</span>
          </div>
          <Progress value={predictions.growthProbability} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <p className="text-lg font-semibold">{predictions.temperature.toFixed(1)}°C</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">pH Level</span>
            </div>
            <p className="text-lg font-semibold">{predictions.ph.toFixed(1)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">TDS</span>
            </div>
            <p className="text-lg font-semibold">{predictions.tds.toFixed(0)} ppm</p>
          </div>
        </div>
      </div>
    </Card>
  );
};