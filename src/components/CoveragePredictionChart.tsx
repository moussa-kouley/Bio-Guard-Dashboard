import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { format } from "date-fns";

interface CoveragePredictionChartProps {
  data: Array<{
    date: string;
    historical: number;
    predicted?: number;
    confidenceLower?: number;
    confidenceUpper?: number;
  }>;
}

const CoveragePredictionChart = ({ data }: CoveragePredictionChartProps) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
          />
          <YAxis 
            label={{ value: 'Growth Percentage', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), 'dd MMM yyyy')}
            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
          />
          <Legend />
          
          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="confidenceUpper"
            stroke="none"
            fill="#8884d8"
            fillOpacity={0.1}
            name="Confidence Interval"
          />
          <Area
            type="monotone"
            dataKey="confidenceLower"
            stroke="none"
            fill="#8884d8"
            fillOpacity={0.1}
            name=" "
          />
          
          {/* Historical and predicted lines */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#000000"
            name="Historical Data"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#4CAF50"
            name="Predicted Data"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoveragePredictionChart;