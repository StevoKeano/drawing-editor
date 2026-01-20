import { useEffect } from 'react';
import { keyboardShortcuts } from '../utils/exportUtils';

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onSelectAll
}: {
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelectAll: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyboardShortcuts.isUndo(e)) {
        e.preventDefault();
        onUndo();
      } else if (keyboardShortcuts.isRedo(e)) {
        e.preventDefault();
        onRedo();
      } else if (keyboardShortcuts.isDelete(e)) {
        e.preventDefault();
        onDelete();
      } else if (keyboardShortcuts.isDuplicate(e)) {
        e.preventDefault();
        onDuplicate();
      } else if (keyboardShortcuts.isSelectAll(e)) {
        e.preventDefault();
        onSelectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onDelete, onDuplicate, onSelectAll]);
};