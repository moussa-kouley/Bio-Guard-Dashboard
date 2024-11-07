import { Card } from "@/components/ui/card";

interface MapFiltersProps {
  selectedRegion: string;
  selectedSeverity: string;
  onRegionChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
}

export const MapFilters = ({
  selectedRegion,
  selectedSeverity,
  onRegionChange,
  onSeverityChange,
}: MapFiltersProps) => {
  return (
    <div className="flex gap-4">
      <select 
        className="border rounded-md p-2" 
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
      >
        <option value="">All Regions</option>
        <option value="region1">Region 1</option>
        <option value="region2">Region 2</option>
      </select>
      <select 
        className="border rounded-md p-2" 
        value={selectedSeverity}
        onChange={(e) => onSeverityChange(e.target.value)}
      >
        <option value="">All Severities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
};