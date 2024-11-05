import React from "react";
import { Card } from "@/components/ui/card";

const Education = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Water Hyacinth Education</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">About Water Hyacinth</h2>
          <div className="prose">
            <p className="text-gray-600 mb-4">
              Water hyacinth (Eichhornia crassipes) is an invasive aquatic plant that poses significant environmental and economic challenges to water bodies worldwide.
            </p>
            <h3 className="text-lg font-medium mt-4 mb-2">Key Characteristics</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Rapid growth and reproduction</li>
              <li>Forms dense floating mats</li>
              <li>Reduces water quality and oxygen levels</li>
              <li>Impacts local ecosystems and biodiversity</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Environmental Impact</h2>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Negative Effects</h3>
              <ul className="list-disc pl-6 space-y-2 text-red-600">
                <li>Blocks waterways and irrigation systems</li>
                <li>Reduces fish populations</li>
                <li>Increases water loss through evapotranspiration</li>
                <li>Creates breeding grounds for mosquitoes</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Control Methods</h3>
              <ul className="list-disc pl-6 space-y-2 text-green-600">
                <li>Mechanical removal</li>
                <li>Biological control agents</li>
                <li>Chemical treatment (when appropriate)</li>
                <li>Prevention through monitoring</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Resources & Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">For Researchers</h3>
              <ul className="list-disc pl-6 space-y-2 text-blue-600">
                <li>Research papers</li>
                <li>Data collection methods</li>
                <li>Analysis tools</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">For Practitioners</h3>
              <ul className="list-disc pl-6 space-y-2 text-purple-600">
                <li>Best practices</li>
                <li>Treatment guidelines</li>
                <li>Safety protocols</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-2">For Public</h3>
              <ul className="list-disc pl-6 space-y-2 text-orange-600">
                <li>Identification guide</li>
                <li>Reporting procedures</li>
                <li>Prevention tips</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Education;