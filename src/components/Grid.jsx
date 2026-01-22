import { useEffect, useState } from 'react';
import Cell from './Cell';

/**
 * Grid component - Renders the game grid and tracks cell flip animations
 * @param {Object} props - Component props
 * @param {string[][]} props.grid - 2D array of hex colors
 * @param {Function} props.onCellClick - Click handler for cells
 * @param {boolean} props.isAnimating - Whether animation is in progress
 * @param {number} props.cellSize - Size of each cell in pixels
 * @param {string|null} props.flipDirection - Direction of flip animation
 */
export const Grid = ({ 
  grid, 
  onCellClick, 
  isAnimating, 
  cellSize = 15, 
  flipDirection = null
}) => {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  const [flippingCells, setFlippingCells] = useState(new Set());
  const [prevGrid, setPrevGrid] = useState(grid);

  useEffect(() => {
    if (!isAnimating || !flipDirection) {
      setFlippingCells(new Set());
      return;
    }

    setPrevGrid(prevPrev => {
      const newFlippingCells = new Set(flippingCells);
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (prevPrev[r] && prevPrev[r][c] !== grid[r][c]) {
            newFlippingCells.add(`${r}-${c}`);
          }
        }
      }

      if (newFlippingCells.size > flippingCells.size) {
        setFlippingCells(newFlippingCells);
      }

      return grid;
    });
  }, [grid, isAnimating, flipDirection, rows, cols, flippingCells]);

  return (
    <div
      className="grid-container"
      style={{
        '--grid-rows': rows,
        '--grid-cols': cols,
        '--cell-size': `${cellSize}px`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((color, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          const isFlipping = flippingCells.has(cellKey);
          
          return (
            <Cell
              key={cellKey}
              color={color}
              onClick={() => onCellClick(rowIndex, colIndex)}
              isAnimating={isAnimating}
              flipDirection={isFlipping ? flipDirection : null}
              isFlipping={isFlipping}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;