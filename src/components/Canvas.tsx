import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text as KonvaText } from 'react-konva';
import { CanvasState, Shape } from '../types';
import { shapeFactory } from '../utils/shapeFactory';

interface CanvasProps {
  state: CanvasState;
  onStateChange: (state: CanvasState) => void;
  onShapeAdd: (shape: Shape) => void;
  onShapeSelect: (shapeIds: string[]) => void;
  onStageReady?: (stage: any) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  state,
  onStateChange,
  onShapeAdd,
  onShapeSelect,
  onStageReady
}) => {
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [lastDist, setLastDist] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stage = stageRef.current?.getStage();
    if (stage) {
      onStageReady?.(stage);
      
      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const scaleBy = 1.1;
          const newScale = e.deltaY > 0 ? state.scale / scaleBy : state.scale * scaleBy;
          onStateChange({ ...state, scale: Math.max(0.1, Math.min(5, newScale)) });
        }
      };

      const container = stage.container();
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [state, onStateChange, onStageReady]);

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    setStartPos(pos);

    if (state.tool === 'select') {
      if (e.target === e.target.getStage()) {
        onShapeSelect([]);
      }
      return;
    }

    setIsDrawing(true);
    const layerId = state.selectedLayerId || 'layer-1';

    if (state.tool === 'pencil') {
      const shape = shapeFactory.createPencil(
        [pos.x, pos.y],
        state.properties,
        layerId
      );
      setCurrentShape(shape);
    } else if (state.tool === 'rectangle') {
      const shape = shapeFactory.createRectangle(
        pos.x,
        pos.y,
        0,
        0,
        state.properties,
        layerId
      );
      setCurrentShape(shape);
    } else if (state.tool === 'ellipse') {
      const shape = shapeFactory.createEllipse(
        pos.x,
        pos.y,
        0,
        state.properties,
        layerId
      );
      setCurrentShape(shape);
    } else if (state.tool === 'line') {
      const shape = shapeFactory.createLine(
        pos.x,
        pos.y,
        pos.x,
        pos.y,
        state.properties,
        layerId
      );
      setCurrentShape(shape);
    } else if (state.tool === 'text') {
      const text = prompt('Enter text:') || 'Text';
      const shape = shapeFactory.createText(
        pos.x,
        pos.y,
        text,
        state.properties,
        layerId
      );
      onShapeAdd(shape);
    }
  };

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    // Handle pinch zoom
    if (e.evt && e.evt.touches && e.evt.touches.length === 2) {
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const dist = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      if (lastDist > 0) {
        const scaleBy = 1.05;
        const newScale = dist > lastDist ? state.scale * scaleBy : state.scale / scaleBy;
        onStateChange({ ...state, scale: Math.max(0.1, Math.min(5, newScale)) });
      }
      setLastDist(dist);
      return;
    }

    if (state.isPanning) {
      onStateChange({
        ...state,
        position: {
          x: pos.x - startPos.x,
          y: pos.y - startPos.y
        }
      });
      return;
    }

    if (!isDrawing || !currentShape) return;

    if (state.tool === 'pencil') {
      const updatedShape = {
        ...currentShape,
        points: [...(currentShape.points || []), pos.x, pos.y]
      };
      setCurrentShape(updatedShape);
    } else if (state.tool === 'rectangle') {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      const updatedShape = {
        ...currentShape,
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(width),
        height: Math.abs(height)
      };
      setCurrentShape(updatedShape);
    } else if (state.tool === 'ellipse') {
      const radius = Math.max(5, Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      ));
      const updatedShape = {
        ...currentShape,
        radius: radius
      };
      setCurrentShape(updatedShape);
    } else if (state.tool === 'line') {
      const updatedShape = {
        ...currentShape,
        width: pos.x - startPos.x,
        height: pos.y - startPos.y
      };
      setCurrentShape(updatedShape);
    }
  };

  const handleMouseUp = () => {
    setLastDist(0);
    if (isDrawing && currentShape) {
      onShapeAdd(currentShape);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  const renderShape = (shape: Shape) => {
    const isSelected = state.selectedShapeIds.includes(shape.id);
    const commonProps = {
      key: shape.id,
      fill: shape.fill,
      stroke: isSelected ? '#3b82f6' : shape.stroke,
      strokeWidth: isSelected ? shape.strokeWidth + 2 : shape.strokeWidth,
      opacity: shape.opacity,
      visible: shape.visible,
      listening: !shape.locked,
      onClick: () => {
        if (state.tool === 'select') {
          onShapeSelect([shape.id]);
        }
      }
    };

    switch (shape.type) {
      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
          />
        );
      case 'ellipse':
        return (
          <Circle
            {...commonProps}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
          />
        );
      case 'line':
        return (
          <Line
            {...commonProps}
            points={[shape.x, shape.y, shape.x + (shape.width || 0), shape.y + (shape.height || 0)]}
            lineCap="round"
          />
        );
      case 'pencil':
        return (
          <Line
            {...commonProps}
            points={shape.points}
            lineCap="round"
            lineJoin="round"
          />
        );
      case 'text':
        return (
          <KonvaText
            {...commonProps}
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={16}
            fontFamily="Arial"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={dimensions.width}
      height={dimensions.height}
      scaleX={state.scale}
      scaleY={state.scale}
      x={state.position.x}
      y={state.position.y}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onWheel={(e) => {
        if (e.evt.ctrlKey) {
          e.evt.preventDefault();
          const scaleBy = 1.1;
          const newScale = e.evt.deltaY > 0 ? state.scale / scaleBy : state.scale * scaleBy;
          onStateChange({ ...state, scale: Math.max(0.1, Math.min(5, newScale)) });
        }
      }}
    >
      {state.layers.map((layer) => (
        <Layer key={layer.id} visible={layer.visible}>
          {layer.shapes.map(renderShape)}
          {currentShape && renderShape(currentShape)}
        </Layer>
      ))}
    </Stage>
  );
};