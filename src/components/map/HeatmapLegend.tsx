import React from 'react';
import { Card } from "@/components/ui/card";
import type { TimeframeType } from '@/types/map';
import { getLegendLabels } from '@/utils/heatmapUtils';

interface HeatmapLegendProps {
  timeframe: TimeframeType;
}

const HeatmapLegend = ({ timeframe }: HeatmapLegendProps) => {
  const labels = getLegendLabels(timeframe);

  return (
    <Card className="absolute bottom-4 right-4 bg-white p-4 z-[1000] shadow-lg">
      <h3 className="font-semibold mb-2">{labels.title}</h3>
      <div className="space-y-2">
        {labels.levels.map((level, index) => (
          <div key={level} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: index === 0 ? '#00ff00' :
                               index === 1 ? '#ffff00' :
                               index === 2 ? '#ff9900' :
                                           '#ff0000'
              }}
            />
            <span className="text-sm">{level}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HeatmapLegend;