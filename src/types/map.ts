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
  f_port?: number;
}

// Extend the window interface to include HeatLayer
declare global {
  interface Window {
    L: typeof import('leaflet');
  }
}

// Extend Leaflet types
declare module 'leaflet' {
  export interface HeatLayerOptions extends L.LayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  export class HeatLayer extends Layer {
    constructor(latlngs: LatLngExpression[], options?: HeatLayerOptions);
    setLatLngs(latlngs: LatLngExpression[]): this;
    addLatLng(latlng: LatLngExpression): this;
    setOptions(options: HeatLayerOptions): this;
    redraw(): this;
  }

  export function heatLayer(
    latlngs: LatLngExpression[],
    options?: HeatLayerOptions
  ): HeatLayer;
}