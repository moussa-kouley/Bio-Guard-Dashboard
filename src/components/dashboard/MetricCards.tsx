import { Card } from "@/components/ui/card";
import { Download, ThermometerSun, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { GpsData } from "@/types/gps";
import GpsDataTable from "@/components/GpsDataTable";
import CoveragePredictionChart from "@/components/CoveragePredictionChart";
import React from "react";

interface MetricCardsProps {
  latestData?: GpsData;
  data: GpsData[];
}

interface Finding {
  text: string;
  scientificData: string;
  timestamp: string;
}

export const MetricCards = ({ latestData, data }: MetricCardsProps) => {
  const [findings, setFindings] = React.useState<Finding[]>([
    {
      text: "Dense water hyacinth patch detected",
      scientificData: "Biomass density: 45kg/m², Chlorophyll content: 35.2 mg/g",
      timestamp: new Date().toISOString()
    },
    {
      text: "Water quality impact assessment",
      scientificData: "DO levels: 4.2mg/L, Turbidity: 28 NTU, Light penetration: 45cm",
      timestamp: new Date().toISOString()
    }
  ]);

  React.useEffect(() => {
    const handleNewAnalysis = (event: CustomEvent<{ 
      analysis: string, 
      timestamp: string,
      metrics: {
        coverage: number,
        growth_rate: number,
        water_quality: number
      }
    }>) => {
      const { coverage, growth_rate, water_quality } = event.detail.metrics;
      
      // Generate scientific analysis based on metrics
      const scientificData = `Coverage: ${coverage.toFixed(1)}%, Growth rate: ${growth_rate.toFixed(1)}%/week, DO impact: ${(water_quality * 0.1).toFixed(1)}mg/L`;
      
      setFindings(prev => [{
        text: event.detail.analysis.split('.')[0],
        scientificData,
        timestamp: event.detail.timestamp
      }, prev[0]]);
    };

    window.addEventListener('newAnalysis', handleNewAnalysis as EventListener);
    return () => {
      window.removeEventListener('newAnalysis', handleNewAnalysis as EventListener);
    };
  }, []);

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

    // Calculate average values from sensor data
    const avgTemp = last20MinData.reduce((sum, entry) => sum + (entry.temperature || 0), 0) / last20MinData.length;
    const avgPh = last20MinData.reduce((sum, entry) => sum + (entry.ph || 0), 0) / last20MinData.length;
    const avgDs = last20MinData.reduce((sum, entry) => sum + (entry.dissolvedsolids || 0), 0) / last20MinData.length;

    // Calculate coverage based on dissolved solids (higher DS indicates more plant matter)
    const currentCoverage = ((avgDs / 1000) * 15).toFixed(1); // Convert DS to coverage percentage
    
    // Previous coverage is slightly different to show change
    const previousCoverage = (Number(currentCoverage) + (Math.random() > 0.5 ? 2 : -2)).toFixed(1);
    
    // Growth rate based on pH and temperature (optimal conditions = faster growth)
    const growthRate = (
      ((avgTemp - 20) / 10) * // Temperature factor (20°C is baseline)
      ((avgPh - 6) / 2) * // pH factor (6-8 is optimal range)
      5 // Base growth rate
    ).toFixed(1);

    // Water quality impact based on coverage and dissolved solids
    const waterQuality = (
      (Number(currentCoverage) / 10) + // Coverage impact
      ((avgDs - 400) / 100) // Dissolved solids impact
    ).toFixed(1);

    // Predicted coverage based on current coverage and growth rate
    const predictedCoverage = (
      Number(currentCoverage) * 
      (1 + (Number(growthRate) / 100) * 4) // 4 weeks projection
    ).toFixed(1);

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

  // Generate sample prediction data
  const predictionData = React.useMemo(() => {
    const data = [];
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2025-01-01');
    const monthStep = 1; // One data point per month
    
    // Helper function to generate realistic fluctuating values
    const generateValue = (baseValue: number, volatility: number, min: number, max: number) => {
      let value = baseValue + (Math.random() - 0.5) * volatility;
      return Math.max(min, Math.min(max, value));
    };

    let currentValue = 0.15; // Starting value
    
    // Generate data points
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + monthStep)) {
      const isPredicted = date >= new Date('2023-01-01');
      const month = date.getMonth();
      
      // Add seasonal variation (higher in summer months)
      const seasonalFactor = Math.sin((month / 12) * Math.PI * 2) * 0.2;
      
      // Generate more volatile historical data
      if (!isPredicted) {
        currentValue = generateValue(currentValue + seasonalFactor, 0.15, 0, 1);
        data.push({
          date: date.toISOString(),
          historical: currentValue,
        });
      } else {
        // Smoother predicted data with confidence intervals
        const predictedValue = generateValue(currentValue + seasonalFactor, 0.08, 0, 1);
        const confidence = 0.15 + Math.abs(seasonalFactor) * 0.1;
        
        data.push({
          date: date.toISOString(),
          historical: date < new Date('2023-06-01') ? currentValue : undefined,
          predicted: predictedValue,
          confidenceLower: Math.max(0, predictedValue - confidence),
          confidenceUpper: Math.min(1, predictedValue + confidence),
        });
        
        currentValue = predictedValue;
      }
    }
    
    return data;
  }, []);

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
          <p className="text-xs text-gray-600">previous coverage area</p>
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
          <p className="text-xs text-gray-600">quality index</p>
        </Card>

        <Card className="p-3 bg-purple-50">
          <h3 className="text-xs font-medium mb-1">Predicted Coverage</h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{metrics.predictedCoverage}</p>
            <ArrowUpRight className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xs text-gray-600">next month estimate</p>
        </Card>

        <Card className="p-3 bg-yellow-50">
          <h3 className="text-xs font-medium mb-1">Water Temperature</h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{metrics.temperature}</p>
            <ThermometerSun className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-600">current reading</p>
        </Card>
      </div>

      <Card className="col-span-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Scientific Analysis</h2>
        </div>
        <div className="space-y-3">
          {findings.map((finding, index) => (
            <div key={index} className={`p-3 ${index === 0 ? 'bg-green-100' : 'bg-blue-100'} rounded`}>
              <p className="text-sm font-medium">{finding.text}</p>
              <p className="text-xs text-gray-600 mt-1">{finding.scientificData}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(finding.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

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

      <Card className="col-span-1 lg:col-span-3 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Coverage Prediction Analysis</h2>
        </div>
        <CoveragePredictionChart data={predictionData} />
      </Card>
    </div>
  );
};
