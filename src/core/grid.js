const CYBERPUNK_PALETTE = [
  '#FF006E',
  '#FB5607',
  '#FFBE0B',
  '#8338EC',
  '#3A86FF',
  '#06FFA5',
  '#00D9FF',
  '#FF10F0',
  '#00F5FF',
];

/**
 * Simplified Perlin-like noise for organic generation
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {number} Noise value between 0 and 1
 */
const simplex = (x, y) => {
  return Math.sin(x * 12.9898 + y * 78.233) * Math.sin(x * 39.346 + y * 14.234) * 43758.5453;
};

/**
 * Perlin noise function for smooth terrain-like generation
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} scale - Scale factor for noise (default 1)
 * @returns {number} Interpolated noise value between 0 and 1
 */
const perlinNoise = (x, y, scale = 1) => {
  const xi = Math.floor(x / scale);
  const yi = Math.floor(y / scale);
  
  const n00 = simplex(xi, yi);
  const n10 = simplex(xi + 1, yi);
  const n01 = simplex(xi, yi + 1);
  const n11 = simplex(xi + 1, yi + 1);
  
  const u = (x % scale) / scale;
  const v = (y % scale) / scale;
  
  const uu = u * u * (3 - 2 * u);
  const vv = v * v * (3 - 2 * v);
  
  const n0 = n00 * (1 - uu) + n10 * uu;
  const n1 = n01 * (1 - uu) + n11 * uu;
  
  return (n0 * (1 - vv) + n1 * vv) % 1;
};

/**
 * Returns a random color from the cyberpunk palette
 * @returns {string} Hex color string
 */
const randomCyberpunkColor = () => {
  return CYBERPUNK_PALETTE[Math.floor(Math.random() * CYBERPUNK_PALETTE.length)];
};

/**
 * Calculates number of territories based on organicness
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @param {number} organicness - Organicness value (0-100)
 * @returns {number} Number of territories to create
 */
const calculateTerritoryCount = (rows, cols, organicness) => {
  const baseNumTerritories = rows * cols;
  const minTerritories = Math.max(2, Math.floor(Math.sqrt(rows * cols) / 2));
  return Math.floor(
    minTerritories + (baseNumTerritories - minTerritories) * ((100 - organicness) / 100)
  );
};

/**
 * Creates initial territory seeds
 * @param {number} numTerritories - Number of territories to create
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @returns {Array<Object>} Array of territory objects with color, cells, and frontier
 */
const createTerritorySeeds = (numTerritories, rows, cols) => {
  return Array.from({ length: numTerritories }, () => {
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
    const color = randomCyberpunkColor();
    
    return {
      color,
      cells: [[startRow, startCol]],
      frontier: new Set([`${startRow},${startCol}`])
    };
  });
};

/**
 * Calculates growth probability for a cell
 * @param {number} row - Cell row
 * @param {number} col - Cell column
 * @param {number} seed - Random seed
 * @param {number} organicness - Organicness value (0-100)
 * @returns {number} Growth probability between 0 and 1
 */
const calculateGrowthProbability = (row, col, seed, organicness) => {
  const noise = Math.abs(perlinNoise(row + seed, col + seed, 2));
  const baseGrowth = 0.3 + noise * 0.4;
  return baseGrowth + (organicness / 100) * 0.4;
};

/**
 * Gets valid neighbors that are null (unfilled)
 * @param {string[][]} grid - Current grid state
 * @param {number} rows - Total rows
 * @param {number} cols - Total columns
 * @param {number} r - Current row
 * @param {number} c - Current column
 * @returns {Array<[number, number]>} Array of valid unfilled neighbor positions
 */
const getUnfilledNeighbors = (grid, rows, cols, r, c) => {
  const neighbors = [
    [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
  ];
  return neighbors.filter(([nr, nc]) => 
    nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === null
  );
};

/**
 * Attempts to grow a territory from one frontier cell
 * @param {string[][]} grid - Current grid state
 * @param {string} cellStr - Frontier cell position string "r,c"
 * @param {number} rows - Total rows
 * @param {number} cols - Total columns
 * @param {number} seed - Random seed
 * @param {number} organicness - Organicness value (0-100)
 * @returns {Array<[number, number]>} Array of newly grown cell positions
 */
const growFromCell = (grid, cellStr, rows, cols, seed, organicness) => {
  const [r, c] = cellStr.split(',').map(Number);
  const neighbors = getUnfilledNeighbors(grid, rows, cols, r, c);
  
  return neighbors.filter(([nr, nc]) => {
    const growthChance = calculateGrowthProbability(nr, nc, seed, organicness);
    return Math.random() < growthChance;
  });
};

/**
 * Grows all territories by one iteration
 * @param {string[][]} grid - Current grid state
 * @param {Array<Object>} territories - Current territories
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @param {number} seed - Random seed
 * @param {number} organicness - Organicness value (0-100)
 * @returns {{grid: string[][], territories: Array<Object>, activeCount: number}}
 */
const growTerritoriesIteration = (grid, territories, rows, cols, seed, organicness) => {
  let newGrid = grid.map(row => [...row]);
  let activeCount = 0;
  
  const newTerritories = territories.map(territory => {
    const newFrontier = new Set();
    const newCells = [...territory.cells];
    
    for (const cellStr of territory.frontier) {
      const grownCells = growFromCell(newGrid, cellStr, rows, cols, seed, organicness);
      
      grownCells.forEach(([nr, nc]) => {
        newGrid[nr][nc] = territory.color;
        newCells.push([nr, nc]);
        newFrontier.add(`${nr},${nc}`);
      });
    }
    
    if (newFrontier.size > 0) activeCount++;
    
    return {
      ...territory,
      cells: newCells,
      frontier: newFrontier
    };
  });
  
  return { grid: newGrid, territories: newTerritories, activeCount };
};

/**
 * Finds closest colored neighbor for a cell
 * @param {string[][]} grid - Current grid state
 * @param {number} row - Cell row
 * @param {number} col - Cell column
 * @param {number} rows - Total rows
 * @param {number} cols - Total columns
 * @returns {string|null} Color of closest neighbor or null
 */
const findClosestColoredNeighbor = (grid, row, col, rows, cols) => {
  let closest = null;
  let minDist = Infinity;
  
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const nr = row + dr;
      const nc = col + dc;
      
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== null) {
        const dist = Math.abs(dr) + Math.abs(dc);
        if (dist < minDist) {
          minDist = dist;
          closest = grid[nr][nc];
        }
      }
    }
  }
  
  return closest;
};

/**
 * Fills remaining null cells with nearest neighbor colors
 * @param {string[][]} grid - Grid with some null cells
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @returns {string[][]} Grid with all cells filled
 */
const fillRemainingCells = (grid, rows, cols) => {
  return grid.map((row, r) => 
    row.map((cell, c) => {
      if (cell !== null) return cell;
      return findClosestColoredNeighbor(grid, r, c, rows, cols) || randomCyberpunkColor();
    })
  );
};

/**
 * Generates a grid with organic territories
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {number} organicness - From 0 (random pixels) to 100 (large territories) - default 100
 * @returns {string[][]} 2D grid with organic territories
 */
export const generateGridWithZones = (rows, cols, organicness = 100) => {
  if (rows <= 0 || cols <= 0) {
    return [];
  }

  const seed = Math.random() * 10000;
  let grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  
  if (organicness === 0) {
    return grid.map(row => row.map(() => randomCyberpunkColor()));
  }
  
  const numTerritories = calculateTerritoryCount(rows, cols, organicness);
  let territories = createTerritorySeeds(numTerritories, rows, cols);
  
  territories.forEach(territory => {
    const [startRow, startCol] = territory.cells[0];
    grid[startRow][startCol] = territory.color;
  });
  
  const maxIterations = rows * cols;
  let activeCount = territories.length;
  
  for (let iteration = 0; iteration < maxIterations && activeCount > 0; iteration++) {
    const result = growTerritoriesIteration(grid, territories, rows, cols, seed, organicness);
    grid = result.grid;
    territories = result.territories;
    activeCount = result.activeCount;
  }
  
  return fillRemainingCells(grid, rows, cols);
};

/**
 * Generates a grid of cells with random colors
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {string[][]} 2D grid where each cell is a hex color
 */
export const generateGrid = (rows, cols) => {
  if (rows <= 0 || cols <= 0) {
    return [];
  }

  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => randomCyberpunkColor())
  );
};

/**
 * Gets the dimensions of a grid
 * @param {string[][]} grid - 2D grid
 * @returns {{rows: number, cols: number}} Grid dimensions
 */
export const getGridDimensions = (grid) => {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  return { rows, cols };
};

/**
 * Gets the color of a cell
 * @param {string[][]} grid - 2D grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {string|undefined} Hex color or undefined if out of bounds
 */
export const getCellColor = (grid, row, col) => {
  if (!isValidPosition(grid, row, col)) {
    return undefined;
  }

  return grid[row][col];
};

/**
 * Validates if a position is within grid bounds
 * @param {string[][]} grid - 2D grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if position is valid
 */
export const isValidPosition = (grid, row, col) => {
  if (grid.length === 0) {
    return false;
  }

  const rows = grid.length;
  const cols = grid[0].length;

  return row >= 0 && row < rows && col >= 0 && col < cols;
};

/**
 * Sets the color of a cell immutably
 * @param {string[][]} grid - Original 2D grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {string} color - New hex color
 * @returns {string[][]} New grid with modified cell
 */
export const setCellColor = (grid, row, col, color) => {
  if (!isValidPosition(grid, row, col)) {
    return grid;
  }

  return grid.map((gridRow, r) =>
    r === row
      ? gridRow.map((cellColor, c) => (c === col ? color : cellColor))
      : gridRow
  );
};

/**
 * Creates a deep copy of a grid
 * @param {string[][]} grid - 2D grid to copy
 * @returns {string[][]} New grid (copy)
 */
export const cloneGrid = (grid) => {
  return grid.map(row => [...row]);
};
