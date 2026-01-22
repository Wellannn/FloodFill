import { useState, useEffect, useRef } from 'react';
import { calculateGridDimensions } from '../utils/gridHelpers';

/**
 * Custom hook to calculate and track grid dimensions based on available space
 * @param {number} cellSize - Size of each cell in pixels
 * @param {number} margins - Total margins to subtract from available space
 * @returns {{rows: number, cols: number, containerRef: RefObject}} Grid dimensions and container ref
 */
export const useGridDimensions = (cellSize, margins = 22) => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(10);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const measureAndRecalculate = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableWidth = rect.width - margins;
        const availableHeight = rect.height - margins;
        
        const { rows: newRows, cols: newCols } = calculateGridDimensions(
          availableWidth,
          availableHeight,
          cellSize
        );
        
        setRows(newRows);
        setCols(newCols);
      }
    };
    
    const resizeObserver = new ResizeObserver(measureAndRecalculate);
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }
    
    measureAndRecalculate();
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [cellSize, margins]);
  
  return { rows, cols, containerRef };
};
