import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Calendar } from "lucide-react";

const growthData = [
  { name: 'Jan', coverage: 15, growthRate: 1.2 },
  { name: 'Feb', coverage: 18, growthRate: 1.4 },
  { name: 'Mar', coverage: 22, growthRate: 1.6 },
  { name: 'Apr', coverage: 25, growthRate: 1.5 },
  { name: 'May', coverage: 30, growthRate: 1.8 },
];

const waterQualityData = [
  { name: 'Jan', ph: 7, oxygen: 6, turbidity: 5 },
  { name: 'Feb', ph: 7.2, oxygen: 5.8, turbidity: 5.2 },
  { name: 'Mar', ph: 7.1, oxygen: 5.9, turbidity: 5.1 },
  { name: 'Apr', ph: 7.3, oxygen: 5.7, turbidity: 5.3 },
  { name: 'May', ph: 7.2, oxygen: 5.8, turbidity: 5.2 },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Real Time Monitoring Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded">
            <p className="text-sm">LAST DATE OF DRONE FLIGHT</p>
            <p className="font-semibold">28/12/2024, 15:23</p>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <p className="text-sm">TODAY IS :</p>
            <p className="font-semibold">28/12/2024, 15:23</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Key Performance Indicator of Water Coverage</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded">
              <h3 className="text-sm font-medium">Current WH Coverage</h3>
              <p className="text-2xl font-bold">30%</p>
              <p className="text-sm text-gray-600">present coverage area</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-sm font-medium">Previous WH Coverage</h3>
              <p className="text-2xl font-bold">3.5%</p>
              <p className="text-sm text-gray-600">present coverage area</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="text-sm font-medium">Growth Rate - WH</h3>
              <p className="text-2xl font-bold">1.6%</p>
              <p className="text-sm text-gray-600">per week</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-red-50 p-4 rounded">
              <h3 className="text-sm font-medium">Water Quality Impact</h3>
              <p className="text-2xl font-bold text-red-600">-13%</p>
              <p className="text-sm text-gray-600">Decrease in water quality</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="text-sm font-medium">Predicted Coverage</h3>
              <p className="text-2xl font-bold">34%</p>
              <p className="text-sm text-gray-600">estimated next month</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h3 className="text-sm font-medium">Water Temperature</h3>
              <p className="text-2xl font-bold">23°C</p>
              <p className="text-sm text-gray-600">Current water temperature</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Data Insight from Drones</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Coverage</th>
                  <th className="p-2 text-left">Growth Rate</th>
                  <th className="p-2 text-left">Water Quality</th>
                  <th className="p-2 text-left">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="border-b">
                    <td className="p-2">10/0{row}/2024</td>
                    <td className="p-2">{30 + row}%</td>
                    <td className="p-2">1.{row}%</td>
                    <td className="p-2">{85 + row}%</td>
                    <td className="p-2">2{row}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Water Hyacinth Growth Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="coverage" stroke="#4CAF50" fill="#E8F5E9" />
                <Area type="monotone" dataKey="growthRate" stroke="#2196F3" fill="#E3F2FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Findings</h3>
            <div className="space-y-2">
              <div className="bg-blue-100 p-3 rounded">
                <p>15% increase in water hyacinth in the northern zone</p>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p>Decrease in dissolved oxygen levels near dense hyacinth patches</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded">
                <p>Increased nutrient levels detected in southern zone</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Action & Recommendations</h3>
            <div className="space-y-2">
              <div className="bg-red-100 p-3 rounded">
                <p>Deploy harvesters to remove hyacinth in the northern zone</p>
              </div>
              <div className="bg-orange-100 p-3 rounded">
                <p>Introduce biological control agents in areas with new hyacinth growth</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded">
                <p>Implement nutrient management strategies in the western zone</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 p-4">
        <h3 className="text-lg font-semibold mb-4">Water Quality Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waterQualityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ph" stroke="#4CAF50" />
              <Line type="monotone" dataKey="oxygen" stroke="#2196F3" />
              <Line type="monotone" dataKey="turbidity" stroke="#FFC107" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;