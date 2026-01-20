import { v4 as uuidv4 } from 'uuid';
import { Shape } from '../types';

export const shapeFactory = {
  createRectangle: (x: number, y: number, width: number, height: number, properties: any, layerId: string): Shape => ({
    id: uuidv4(),
    type: 'rectangle',
    x,
    y,
    width: Math.max(1, width),
    height: Math.max(1, height),
    fill: properties.fill || '#3b82f6',
    stroke: properties.stroke || '#1e40af',
    strokeWidth: Math.max(1, properties.strokeWidth || 2),
    opacity: properties.opacity || 1,
    visible: true,
    locked: false,
    layerId
  }),

  createEllipse: (x: number, y: number, radius: number, properties: any, layerId: string): Shape => ({
    id: uuidv4(),
    type: 'ellipse',
    x,
    y,
    radius: Math.max(5, radius),
    fill: properties.fill || '#3b82f6',
    stroke: properties.stroke || '#1e40af',
    strokeWidth: Math.max(1, properties.strokeWidth || 2),
    opacity: properties.opacity || 1,
    visible: true,
    locked: false,
    layerId
  }),

  createLine: (x1: number, y1: number, x2: number, y2: number, properties: any, layerId: string): Shape => ({
    id: uuidv4(),
    type: 'line',
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
    fill: 'transparent',
    stroke: properties.stroke || '#1e40af',
    strokeWidth: Math.max(1, properties.strokeWidth || 2),
    opacity: properties.opacity || 1,
    visible: true,
    locked: false,
    layerId
  }),

  createPencil: (points: number[], properties: any, layerId: string): Shape => ({
    id: uuidv4(),
    type: 'pencil',
    x: points[0],
    y: points[1],
    points,
    fill: 'transparent',
    stroke: properties.stroke || '#1e40af',
    strokeWidth: Math.max(1, properties.strokeWidth || 2),
    opacity: properties.opacity || 1,
    visible: true,
    locked: false,
    layerId
  }),

  createText: (x: number, y: number, text: string, properties: any, layerId: string): Shape => ({
    id: uuidv4(),
    type: 'text',
    x,
    y,
    text,
    fill: properties.fill || '#3b82f6',
    stroke: 'transparent',
    strokeWidth: 0,
    opacity: properties.opacity || 1,
    visible: true,
    locked: false,
    layerId
  })
};