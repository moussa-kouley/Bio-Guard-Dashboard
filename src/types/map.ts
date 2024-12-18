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

// Add Leaflet types
declare module 'leaflet.heat' {
  import * as L from 'leaflet';
  
  declare module 'leaflet' {
    namespace HeatLayer {
      interface HeatLayerOptions extends L.LayerOptions {
        minOpacity?: number;
        maxZoom?: number;
        max?: number;
        radius?: number;
        blur?: number;
        gradient?: { [key: number]: string };
      }
    }
    
    class HeatLayer extends L.Layer {
      constructor(latlngs: L.LatLngExpression[], options?: HeatLayer.HeatLayerOptions);
      setLatLngs(latlngs: L.LatLngExpression[]): this;
      addLatLng(latlng: L.LatLngExpression): this;
      setOptions(options: HeatLayer.HeatLayerOptions): this;
      redraw(): this;
    }
    
    function heatLayer(latlngs: L.LatLngExpression[], options?: HeatLayer.HeatLayerOptions): HeatLayer;
  }
}