import React from 'react';
import { CanvasState } from '../types';

interface ToolbarProps {
  tool: CanvasState['tool'];
  onToolChange: (tool: CanvasState['tool']) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportPNG: () => void;
  onExportSVG: () => void;
}

const tools = [
  { id: 'select', icon: '↖', label: 'Select' },
  { id: 'pencil', icon: '✏', label: 'Pencil' },
  { id: 'rectangle', icon: '▭', label: 'Rectangle' },
  { id: 'ellipse', icon: '○', label: 'Ellipse' },
  { id: 'line', icon: '╱', label: 'Line' },
  { id: 'text', icon: 'T', label: 'Text' }
] as const;

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportPNG,
  onExportSVG
}) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-lg shadow-xl p-2 flex items-center gap-2 z-50 max-w-[95vw] overflow-x-auto">
      <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => onToolChange(t.id as CanvasState['tool'])}
            className={`w-12 h-12 flex items-center justify-center rounded transition-colors ${
              tool === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            title={t.label}
          >
            <span className="text-xl">{t.icon}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`w-12 h-12 flex items-center justify-center rounded transition-colors ${
            canUndo
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <span className="text-xl">↶</span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`w-12 h-12 flex items-center justify-center rounded transition-colors ${
            canRedo
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <span className="text-xl">↷</span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onExportPNG}
          className="w-12 h-12 flex items-center justify-center rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          title="Export as PNG"
        >
          <span className="text-xl">🖼</span>
        </button>
        <button
          onClick={onExportSVG}
          className="w-12 h-12 flex items-center justify-center rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          title="Export as SVG"
        >
          <span className="text-xl">📄</span>
        </button>
      </div>
    </div>
  );
};