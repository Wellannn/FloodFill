/**
 * Calculates grid dimensions that fit within available space
 * @param {number} availableWidth - Available width in pixels
 * @param {number} availableHeight - Available height in pixels
 * @param {number} cellSize - Size of each cell in pixels
 * @returns {{rows: number, cols: number}} Calculated dimensions
 */
export const calculateGridDimensions = (availableWidth, availableHeight, cellSize) => {
  const cols = Math.max(1, Math.floor(availableWidth / cellSize));
  const rows = Math.max(1, Math.floor(availableHeight / cellSize));
  return { rows, cols };
};

/**
 * Determines flip direction based on click position relative to grid center
 * @param {number} row - Clicked row index
 * @param {number} col - Clicked column index
 * @param {number} totalRows - Total grid rows
 * @param {number} totalCols - Total grid columns
 * @returns {string} Direction: 'up', 'down', 'left', 'right', or 'center'
 */
export const determineFlipDirection = (row, col, totalRows, totalCols) => {
  const gridCenterRow = Math.floor(totalRows / 2);
  const gridCenterCol = Math.floor(totalCols / 2);
  
  if (row < gridCenterRow) return 'up';
  if (row > gridCenterRow) return 'down';
  if (col < gridCenterCol) return 'left';
  if (col > gridCenterCol) return 'right';
  return 'center';
};

/**
 * Creates display grid by merging base with snapshot
 * @param {string[][]} baseGrid - Base grid state
 * @param {string[][]} snapshot - Current animation snapshot
 * @returns {string[][]} Display grid
 */
export const createDisplayGrid = (baseGrid, snapshot) => {
  const display = baseGrid.map(row => [...row]);
  
  snapshot.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (display[r] && display[r][c] !== undefined) {
        display[r][c] = cell;
      }
    });
  });
  
  return display;
};

/**
 * Merges snapshot into base grid (alias for createDisplayGrid)
 * @param {string[][]} baseGrid - Base grid state
 * @param {string[][]} snapshot - Snapshot to merge
 * @returns {string[][]} Merged grid
 */
export const mergeGrids = (baseGrid, snapshot) => createDisplayGrid(baseGrid, snapshot);
