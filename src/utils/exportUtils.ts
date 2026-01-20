import { saveAs } from 'file-saver';
import { Stage } from 'konva/lib/Stage';

export const exportUtils = {
  exportToPNG: (stage: Stage, filename: string = 'drawing.png') => {
    const dataURL = stage.toDataURL({
      pixelRatio: 2,
      mimeType: 'image/png'
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToSVG: (stage: Stage, filename: string = 'drawing.svg') => {
    // Get the canvas content as SVG using Konva's internal method
    const svgString = stage.toDataURL({
      mimeType: 'image/svg+xml'
    });
    
    // Convert data URL to blob
    const parts = svgString.split(',');
    const svgContent = atob(parts[1]);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    saveAs(blob, filename);
  }
};

export const keyboardShortcuts = {
  isUndo: (e: KeyboardEvent) => e.ctrlKey && e.key === 'z' && !e.shiftKey,
  isRedo: (e: KeyboardEvent) => e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey)),
  isDelete: (e: KeyboardEvent) => e.key === 'Delete',
  isDuplicate: (e: KeyboardEvent) => e.ctrlKey && e.key === 'd',
  isSelectAll: (e: KeyboardEvent) => e.ctrlKey && e.key === 'a'
};