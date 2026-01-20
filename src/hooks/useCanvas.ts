import { useState, useCallback } from 'react';
import { CanvasState, Layer, Shape } from '../types';

const initialState: CanvasState = {
  layers: [
    {
      id: 'layer-1',
      name: 'Layer 1',
      visible: true,
      locked: false,
      shapes: []
    }
  ],
  selectedLayerId: 'layer-1',
  selectedShapeIds: [],
  tool: 'select',
  scale: 1,
  position: { x: 0, y: 0 },
  isPanning: false,
  properties: {
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 1
  }
};

export function useCanvas() {
  const [state, setState] = useState<CanvasState>(initialState);

  const addLayer = useCallback(() => {
    setState(prev => {
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        name: `Layer ${prev.layers.length + 1}`,
        visible: true,
        locked: false,
        shapes: []
      };
      return {
        ...prev,
        layers: [...prev.layers, newLayer],
        selectedLayerId: newLayer.id
      };
    });
  }, []);

  const deleteLayer = useCallback((layerId: string) => {
    setState(prev => {
      if (prev.layers.length === 1) return prev;
      const newLayers = prev.layers.filter(l => l.id !== layerId);
      return {
        ...prev,
        layers: newLayers,
        selectedLayerId: newLayers[0]?.id || null
      };
    });
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    }));
  }, []);

  const reorderLayers = useCallback((fromIndex: number) => (toIndex: number) => {
    setState(prev => {
      const newLayers = [...prev.layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      return { ...prev, layers: newLayers };
    });
  }, []);

  const addShape = useCallback((shape: Shape) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === shape.layerId
          ? { ...layer, shapes: [...layer.shapes, shape] }
          : layer
      )
    }));
  }, []);

  const updateShape = useCallback((layerId: string, shapeId: string, updates: Partial<Shape>) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId
          ? {
              ...layer,
              shapes: layer.shapes.map(shape =>
                shape.id === shapeId ? { ...shape, ...updates } : shape
              )
            }
          : layer
      )
    }));
  }, []);

  const deleteShape = useCallback((layerId: string, shapeId: string) => {
    setState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId
          ? {
              ...layer,
              shapes: layer.shapes.filter(shape => shape.id !== shapeId)
            }
          : layer
      ),
      selectedShapeIds: prev.selectedShapeIds.filter(id => id !== shapeId)
    }));
  }, []);

  const setSelectedShapes = useCallback((shapeIds: string[]) => {
    setState(prev => ({ ...prev, selectedShapeIds: shapeIds }));
  }, []);

  const setTool = useCallback((tool: CanvasState['tool']) => {
    setState(prev => ({ ...prev, tool, selectedShapeIds: [] }));
  }, []);

  const setScale = useCallback((scale: number) => {
    setState(prev => ({ ...prev, scale }));
  }, []);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    setState(prev => ({ ...prev, position }));
  }, []);

  const setProperties = useCallback((properties: Partial<CanvasState['properties']>) => {
    setState(prev => ({
      ...prev,
      properties: { ...prev.properties, ...properties }
    }));
  }, []);

  return {
    state,
    addLayer,
    deleteLayer,
    updateLayer,
    reorderLayers,
    addShape,
    updateShape,
    deleteShape,
    setSelectedShapes,
    setTool,
    setScale,
    setPosition,
    setProperties,
    setSelectedLayerId: (layerId: string) => {
      setState(prev => ({ ...prev, selectedLayerId: layerId }));
    }
  };
}