import React from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Affected Areas</h3>
          <p className="text-3xl font-bold mt-2">15</p>
          <p className="text-sm text-green-500 mt-2">+2.5% from last month</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Drones</h3>
          <p className="text-3xl font-bold mt-2">8</p>
          <p className="text-sm text-green-500 mt-2">All systems operational</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Treatment Success Rate</h3>
          <p className="text-3xl font-bold mt-2">92%</p>
          <p className="text-sm text-green-500 mt-2">+5% from last month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#4CAF50" fill="#E8F5E9" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="font-medium">Drone {item} completed scan</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;