import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface GpsData {
  temperature: number;
  timestamp: string;
}

interface TemperatureChartProps {
  data: GpsData[];
}

const TemperatureChart = ({ data }: TemperatureChartProps) => {
  const chartData = data.map(entry => ({
    temperature: entry.temperature,
    timestamp: format(new Date(entry.timestamp), 'HH:mm:ss'),
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#4CAF50"
            fill="#E8F5E9"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;