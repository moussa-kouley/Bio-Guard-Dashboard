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
      <h2 className="text-center text-xl font-semibold mb-4">Prediction from January 2023 Onwards</h2>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'yyyy')}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis 
            label={{ 
              value: 'Growth Percentage', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#666', fontSize: 12 }
            }}
            tick={{ fill: '#666', fontSize: 12 }}
            stroke="#666"
            domain={[0, 1]}
            tickCount={6}
          />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), 'MMM yyyy')}
            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <Legend 
            align="right"
            verticalAlign="top"
            height={36}
            iconType="line"
          />
          
          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="confidenceUpper"
            stroke="none"
            fill="#0000FF"
            fillOpacity={0.1}
            name="Confidence Interval"
          />
          <Area
            type="monotone"
            dataKey="confidenceLower"
            stroke="none"
            fill="#0000FF"
            fillOpacity={0.1}
            name=" "
          />
          
          {/* Historical and predicted lines */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#000000"
            name="Historical Data"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#000000' }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#0000FF"
            name="Predicted Data (from 2023)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#0000FF' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoveragePredictionChart;