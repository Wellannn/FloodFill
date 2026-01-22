import { isValidPosition, setCellColor, cloneGrid, getCellColor, getGridDimensions } from './grid';

/**
 * Gets valid neighbors (up, down, left, right) for a given position
 * @param {number} totalRows - Total number of rows in the grid
 * @param {number} totalCols - Total number of columns in the grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Array<{row: number, col: number}>} Array of valid neighbor positions
 */
export const getNeighbors = (totalRows, totalCols, row, col) => {
  const directions = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 }
  ];

  return directions.filter(({ row: r, col: c }) => 
    r >= 0 && r < totalRows && c >= 0 && c < totalCols
  );
};

/**
 * Creates a position key for use in Set/Map
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {string} Position key in format "row,col"
 */
const createPositionKey = (row, col) => `${row},${col}`;

/**
 * Checks if cell should be processed in flood fill
 * @param {string[][]} grid - 2D grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {string} originalColor - Color to match
 * @returns {boolean} True if cell has the original color
 */
const shouldProcessCell = (grid, row, col, originalColor) => 
  getCellColor(grid, row, col) === originalColor;

/**
 * Processes cells at current level and returns updated grid
 * @param {string[][]} grid - Current grid state
 * @param {Array<[number, number]>} cells - Array of [row, col] positions to process
 * @param {string} targetColor - Color to apply
 * @returns {string[][]} New grid with colors applied
 */
const processCellsAtLevel = (grid, cells, targetColor) => 
  cells.reduce((currentGrid, [r, c]) => 
    setCellColor(currentGrid, r, c, targetColor), 
    grid
  );

/**
 * Gets unvisited neighbors for a cell
 * @param {number} rows - Total rows
 * @param {number} cols - Total columns
 * @param {number} row - Current row
 * @param {number} col - Current column
 * @param {Set<string>} visited - Set of visited position keys
 * @returns {Array<[number, number]>} Array of unvisited neighbor positions
 */
const getUnvisitedNeighbors = (rows, cols, row, col, visited) => {
  const neighbors = getNeighbors(rows, cols, row, col);
  return neighbors
    .map(({ row: nr, col: nc }) => [nr, nc])
    .filter(([nr, nc]) => !visited.has(createPositionKey(nr, nc)));
};

/**
 * Recursive helper function for flood fill
 * @param {string[][]} grid - Current grid state
 * @param {Array<[number, number]>} currentLevel - Cells to process at this level
 * @param {string} originalColor - Original color to match
 * @param {string} targetColor - New color to apply
 * @param {Set<string>} visited - Set of visited position keys
 * @param {number} rows - Total rows
 * @param {number} cols - Total columns
 * @param {Array<string[][]>} snapshots - Accumulated snapshots
 * @returns {Array<string[][]>} Updated snapshots array
 */
const floodFillRecursive = (grid, currentLevel, originalColor, targetColor, visited, rows, cols, snapshots) => {
  if (currentLevel.length === 0) {
    return snapshots;
  }

  const cellsToProcess = currentLevel.filter(([r, c]) => 
    shouldProcessCell(grid, r, c, originalColor)
  );

  if (cellsToProcess.length === 0) {
    return snapshots;
  }

  const newGrid = processCellsAtLevel(grid, cellsToProcess, targetColor);
  const newSnapshots = [...snapshots, cloneGrid(newGrid)];

  const nextLevel = cellsToProcess.flatMap(([r, c]) => {
    const neighbors = getUnvisitedNeighbors(rows, cols, r, c, visited);
    neighbors.forEach(([nr, nc]) => visited.add(createPositionKey(nr, nc)));
    return neighbors;
  });

  return floodFillRecursive(newGrid, nextLevel, originalColor, targetColor, visited, rows, cols, newSnapshots);
};

/**
 * Performs flood fill algorithm using recursive approach
 * @param {string[][]} grid - 2D grid
 * @param {number} row - Row index of clicked cell
 * @param {number} col - Column index of clicked cell
 * @param {string} targetColor - New hex color to apply
 * @returns {Object} { snapshots: Array<string[][]> } List of successive states
 */
export const floodFill = (grid, row, col, targetColor) => {
  if (!isValidPosition(grid, row, col)) {
    return { snapshots: [cloneGrid(grid)] };
  }

  const originalColor = getCellColor(grid, row, col);

  if (originalColor === targetColor) {
    return { snapshots: [cloneGrid(grid)] };
  }

  const { rows, cols } = getGridDimensions(grid);
  const initialSnapshots = [cloneGrid(grid)];
  const visited = new Set([createPositionKey(row, col)]);
  const startingLevel = [[row, col]];

  const snapshots = floodFillRecursive(
    grid,
    startingLevel,
    originalColor,
    targetColor,
    visited,
    rows,
    cols,
    initialSnapshots
  );

  return { snapshots };
};
