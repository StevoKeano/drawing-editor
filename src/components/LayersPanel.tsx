import React, { useState } from 'react';
import { Layer } from '../types';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerAdd: () => void;
  onLayerDelete: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void;
  onLayerReorder: (fromIndex: number, toIndex: number) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerAdd,
  onLayerDelete,
  onLayerUpdate,
  onLayerReorder
}) => {
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragOverLayer, setDragOverLayer] = useState<string | null>(null);

  const handleDragStart = (layerId: string) => {
    setDraggedLayer(layerId);
  };

  const handleDragOver = (e: React.DragEvent, layerId: string) => {
    e.preventDefault();
    setDragOverLayer(layerId);
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    if (draggedLayer && draggedLayer !== targetLayerId) {
      const fromIndex = layers.findIndex(l => l.id === draggedLayer);
      const toIndex = layers.findIndex(l => l.id === targetLayerId);
      if (fromIndex !== -1 && toIndex !== -1) {
        onLayerReorder(fromIndex, toIndex);
      }
    }
    setDraggedLayer(null);
    setDragOverLayer(null);
  };

  const handleDragEnd = () => {
    setDraggedLayer(null);
    setDragOverLayer(null);
  };

  return (
    <div className="fixed right-4 top-20 w-64 bg-gray-900 rounded-lg shadow-xl p-4 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Layers</h3>
        <button
          onClick={onLayerAdd}
          className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title="Add Layer"
        >
          +
        </button>
      </div>

      <div className="space-y-2">
        {layers.slice().reverse().map((layer) => (
          <div
            key={layer.id}
            draggable
            onDragStart={() => handleDragStart(layer.id)}
            onDragOver={(e) => handleDragOver(e, layer.id)}
            onDrop={(e) => handleDrop(e, layer.id)}
            onDragEnd={handleDragEnd}
            className={`p-3 rounded-lg cursor-move transition-all ${
              selectedLayerId === layer.id
                ? 'bg-blue-600 bg-opacity-20 border border-blue-500'
                : 'bg-gray-800 hover:bg-gray-700'
            } ${dragOverLayer === layer.id ? 'border-t-2 border-blue-500' : ''}`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerUpdate(layer.id, { visible: !layer.visible });
                  }}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    layer.visible ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-400'
                  }`}
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.visible ? '👁' : '🚫'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerUpdate(layer.id, { locked: !layer.locked });
                  }}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    layer.locked ? 'bg-gray-700 text-yellow-400' : 'bg-gray-600 text-gray-400'
                  }`}
                  title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                >
                  {layer.locked ? '🔒' : '🔓'}
                </button>
                <span className="text-white text-sm">{layer.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-xs">{layer.shapes.length}</span>
                {layers.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                    title="Delete Layer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};