import React from 'react';
import { CanvasState } from '../types';

interface PropertiesPanelProps {
  properties: CanvasState['properties'];
  onPropertiesChange: (properties: Partial<CanvasState['properties']>) => void;
  selectedShapeIds: string[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  properties,
  onPropertiesChange,
  selectedShapeIds
}) => {
  const hasSelection = selectedShapeIds.length > 0;

  return (
    <div className="fixed left-4 top-20 w-64 bg-gray-900 rounded-lg shadow-xl p-4 z-40">
      <h3 className="text-white font-semibold mb-4">
        Properties {hasSelection && `(${selectedShapeIds.length} selected)`}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm block mb-1">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.fill}
              onChange={(e) => onPropertiesChange({ fill: e.target.value })}
              className="w-12 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.fill}
              onChange={(e) => onPropertiesChange({ fill: e.target.value })}
              className="flex-1 bg-gray-800 text-white px-2 py-1 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">Stroke Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.stroke}
              onChange={(e) => onPropertiesChange({ stroke: e.target.value })}
              className="w-12 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.stroke}
              onChange={(e) => onPropertiesChange({ stroke: e.target.value })}
              className="flex-1 bg-gray-800 text-white px-2 py-1 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Stroke Width: {properties.strokeWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={properties.strokeWidth}
            onChange={(e) => onPropertiesChange({ strokeWidth: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm block mb-1">
            Opacity: {Math.round(properties.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={properties.opacity}
            onChange={(e) => onPropertiesChange({ opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {hasSelection && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              {selectedShapeIds.length} shape{selectedShapeIds.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Changes will apply to selected shapes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};