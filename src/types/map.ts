export type TimeframeType = "current" | "12h" | "1d" | "3d" | "1w";

export interface GpsData {
  latitude: number;
  longitude: number;
  altitude: number;
  hdop: number;
  temperature: number;
  ph: number;
  dissolvedsolids: number;
  timestamp: string;
}