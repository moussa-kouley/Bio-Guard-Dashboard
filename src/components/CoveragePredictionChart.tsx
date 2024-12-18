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
    <div className="h-[400px] w-full bg-white p-4 rounded-lg">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Coverage Percentage', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#666', fontSize: 12 }
            }}
            tick={{ fill: '#666', fontSize: 12 }}
            stroke="#666"
          />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), 'dd MMM yyyy')}
            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
          />
          
          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="confidenceUpper"
            stroke="none"
            fill="#4CAF50"
            fillOpacity={0.1}
            name="Confidence Interval"
          />
          <Area
            type="monotone"
            dataKey="confidenceLower"
            stroke="none"
            fill="#4CAF50"
            fillOpacity={0.1}
            name=" "
          />
          
          {/* Historical and predicted lines */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#1a1a1a"
            name="Historical Data"
            strokeWidth={2}
            dot={{ fill: '#1a1a1a', r: 4 }}
            activeDot={{ r: 6, fill: '#1a1a1a' }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#4CAF50"
            name="Predicted Growth"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#4CAF50', r: 4 }}
            activeDot={{ r: 6, fill: '#4CAF50' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoveragePredictionChart;