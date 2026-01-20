import { useRef, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { LayersPanel } from './components/LayersPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useCanvas } from './hooks/useCanvas';
import { useHistory } from './hooks/useHistory';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { exportUtils } from './utils/exportUtils';
import { v4 as uuidv4 } from 'uuid';
import { Shape } from './types';

function App() {
  const canvas = useCanvas();
  const history = useHistory(canvas.state);
  const stageRef = useRef<any>(null);

  const handleStateChange = (_newState: typeof canvas.state) => {
    // State is managed internally by useCanvas hook
  };

  const handleStageReady = useCallback((stage: any) => {
    stageRef.current = stage;
  }, []);

  const handleShapeAdd = (shape: Shape) => {
    canvas.addShape(shape);
    history.push(canvas.state);
  };

  

  const handleDelete = () => {
    if (canvas.state.selectedShapeIds.length > 0) {
      const layerId = canvas.state.selectedLayerId || 'layer-1';
      canvas.state.selectedShapeIds.forEach(shapeId => {
        canvas.deleteShape(layerId, shapeId);
      });
      history.push(canvas.state);
    }
  };

  const handleDuplicate = () => {
    if (canvas.state.selectedShapeIds.length > 0) {
      const layerId = canvas.state.selectedLayerId || 'layer-1';
      const layer = canvas.state.layers.find(l => l.id === layerId);
      if (layer) {
        canvas.state.selectedShapeIds.forEach(shapeId => {
          const shape = layer.shapes.find(s => s.id === shapeId);
          if (shape) {
            const duplicatedShape = {
              ...shape,
              id: uuidv4(),
              x: shape.x + 20,
              y: shape.y + 20
            };
            canvas.addShape(duplicatedShape);
          }
        });
        history.push(canvas.state);
      }
    }
  };

  const handleSelectAll = () => {
    const layerId = canvas.state.selectedLayerId || 'layer-1';
    const layer = canvas.state.layers.find(l => l.id === layerId);
    if (layer) {
      const allShapeIds = layer.shapes.map(s => s.id);
      canvas.setSelectedShapes(allShapeIds);
    }
  };

  const handleExportPNG = () => {
    if (stageRef.current) {
      exportUtils.exportToPNG(stageRef.current);
    } else {
      console.warn('Stage not ready for export');
    }
  };

  const handleExportSVG = () => {
    if (stageRef.current) {
      exportUtils.exportToSVG(stageRef.current);
    } else {
      console.warn('Stage not ready for export');
    }
  };

  useKeyboardShortcuts({
    onUndo: history.undo,
    onRedo: history.redo,
    onDelete: handleDelete,
    onDuplicate: handleDuplicate,
    onSelectAll: handleSelectAll
  });

  

  return (
    <div className="w-full h-full bg-gray-950 overflow-hidden">
      <Toolbar
        tool={canvas.state.tool}
        onToolChange={canvas.setTool}
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
      />

      <Canvas
        state={canvas.state}
        onStateChange={handleStateChange}
        onShapeAdd={handleShapeAdd}
        onShapeSelect={canvas.setSelectedShapes}
        onStageReady={handleStageReady}
      />

      <LayersPanel
        layers={canvas.state.layers}
        selectedLayerId={canvas.state.selectedLayerId}
        onLayerSelect={(layerId) => canvas.setSelectedLayerId && canvas.setSelectedLayerId(layerId)}
        onLayerAdd={canvas.addLayer}
        onLayerDelete={canvas.deleteLayer}
        onLayerUpdate={canvas.updateLayer}
        onLayerReorder={canvas.reorderLayers}
      />

      <PropertiesPanel
        properties={canvas.state.properties}
        onPropertiesChange={canvas.setProperties}
        selectedShapeIds={canvas.state.selectedShapeIds}
      />
    </div>
  );
}

export default App;