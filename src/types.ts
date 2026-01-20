export interface Shape {
  id: string;
  type: 'rectangle' | 'ellipse' | 'line' | 'pencil' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  layerId: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  shapes: Shape[];
}

export interface CanvasState {
  layers: Layer[];
  selectedLayerId: string | null;
  selectedShapeIds: string[];
  tool: 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'line' | 'text';
  scale: number;
  position: { x: number; y: number };
  isPanning: boolean;
  properties: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
  };
}