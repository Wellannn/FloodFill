import { describe, it, expect } from 'vitest';
import { 
  generateGrid, 
  getGridDimensions, 
  getCellColor, 
  isValidPosition,
  setCellColor,
  cloneGrid,
  generateGridWithZones
} from './grid';

describe('Grid - Generation and utilities', () => {
  
  describe('generateGrid', () => {
    it('should generate a grid with correct dimensions', () => {
      const grid = generateGrid(5, 5);
      expect(grid.length).toBe(5);
      expect(grid[0].length).toBe(5);
    });

    it('should generate a grid with cells having valid hex colors', () => {
      const grid = generateGrid(3, 3);
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      
      grid.forEach(row => {
        row.forEach(color => {
          expect(color).toMatch(hexRegex);
        });
      });
    });

    it('should fill all cells (no undefined or null)', () => {
      const grid = generateGrid(4, 4);
      
      grid.forEach(row => {
        row.forEach(color => {
          expect(color).toBeDefined();
          expect(color).not.toBeNull();
          expect(typeof color).toBe('string');
        });
      });
    });

    it('should support grids of different sizes', () => {
      const grid1 = generateGrid(1, 1);
      const grid2 = generateGrid(10, 10);
      const grid3 = generateGrid(7, 5);

      expect(grid1.length).toBe(1);
      expect(grid1[0].length).toBe(1);
      
      expect(grid2.length).toBe(10);
      expect(grid2[0].length).toBe(10);
      
      expect(grid3.length).toBe(7);
      expect(grid3[0].length).toBe(5);
    });

    it('should return empty array for invalid dimensions', () => {
      expect(generateGrid(0, 5)).toEqual([]);
      expect(generateGrid(5, 0)).toEqual([]);
      expect(generateGrid(-1, 5)).toEqual([]);
    });
  });

  describe('getGridDimensions', () => {
    it('should return correct dimensions', () => {
      const grid = generateGrid(6, 8);
      const { rows, cols } = getGridDimensions(grid);
      
      expect(rows).toBe(6);
      expect(cols).toBe(8);
    });

    it('should return 0, 0 for empty grid', () => {
      const grid = [];
      const { rows, cols } = getGridDimensions(grid);
      
      expect(rows).toBe(0);
      expect(cols).toBe(0);
    });
  });

  describe('getCellColor', () => {
    it('should return cell color at correct coordinates', () => {
      const grid = [
        ['#FF0000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      
      expect(getCellColor(grid, 0, 0)).toBe('#FF0000');
      expect(getCellColor(grid, 0, 1)).toBe('#00FF00');
      expect(getCellColor(grid, 1, 0)).toBe('#0000FF');
      expect(getCellColor(grid, 1, 1)).toBe('#FFFF00');
    });

    it('should return undefined for out-of-bounds coordinates', () => {
      const grid = generateGrid(3, 3);
      
      expect(getCellColor(grid, -1, 0)).toBeUndefined();
      expect(getCellColor(grid, 0, -1)).toBeUndefined();
      expect(getCellColor(grid, 3, 0)).toBeUndefined();
      expect(getCellColor(grid, 0, 3)).toBeUndefined();
    });
  });

  describe('isValidPosition', () => {
    it('should validate positions inside the grid', () => {
      const grid = generateGrid(5, 5);
      
      expect(isValidPosition(grid, 0, 0)).toBe(true);
      expect(isValidPosition(grid, 2, 2)).toBe(true);
      expect(isValidPosition(grid, 4, 4)).toBe(true);
    });

    it('should invalidate out-of-bounds positions', () => {
      const grid = generateGrid(5, 5);
      
      expect(isValidPosition(grid, -1, 0)).toBe(false);
      expect(isValidPosition(grid, 0, -1)).toBe(false);
      expect(isValidPosition(grid, 5, 0)).toBe(false);
      expect(isValidPosition(grid, 0, 5)).toBe(false);
      expect(isValidPosition(grid, 10, 10)).toBe(false);
    });

    it('should handle empty grids', () => {
      const grid = [];
      
      expect(isValidPosition(grid, 0, 0)).toBe(false);
    });
  });

  describe('setCellColor', () => {
    it('should set cell color immutably', () => {
      const grid = [
        ['#FF0000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      
      const newGrid = setCellColor(grid, 0, 0, '#000000');
      
      expect(grid[0][0]).toBe('#FF0000');
      expect(newGrid[0][0]).toBe('#000000');
      expect(newGrid[0][1]).toBe('#00FF00');
      expect(newGrid[1][0]).toBe('#0000FF');
    });

    it('should return same grid for invalid position', () => {
      const grid = [['#FF0000']];
      const newGrid = setCellColor(grid, 5, 5, '#0000FF');
      
      expect(newGrid).toEqual(grid);
    });

    it('should not share references with original grid', () => {
      const grid = [['#FF0000', '#00FF00']];
      const newGrid = setCellColor(grid, 0, 0, '#0000FF');
      
      newGrid[0][1] = '#FFFFFF';
      expect(grid[0][1]).toBe('#00FF00');
    });
  });

  describe('cloneGrid', () => {
    it('should create deep copy of grid', () => {
      const grid = [
        ['#FF0000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      
      const cloned = cloneGrid(grid);
      
      expect(cloned).toEqual(grid);
      expect(cloned).not.toBe(grid);
      expect(cloned[0]).not.toBe(grid[0]);
    });

    it('should not share references', () => {
      const grid = [['#FF0000']];
      const cloned = cloneGrid(grid);
      
      cloned[0][0] = '#0000FF';
      expect(grid[0][0]).toBe('#FF0000');
    });
  });

  describe('generateGridWithZones', () => {
    it('should generate grid with correct dimensions', () => {
      const grid = generateGridWithZones(5, 5, 100);
      
      expect(grid.length).toBe(5);
      expect(grid[0].length).toBe(5);
    });

    it('should fill all cells', () => {
      const grid = generateGridWithZones(5, 5, 100);
      
      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeDefined();
          expect(cell).not.toBeNull();
          expect(typeof cell).toBe('string');
        });
      });
    });

    it('should generate random grid with organicness 0', () => {
      const grid = generateGridWithZones(3, 3, 0);
      
      const colors = new Set();
      grid.forEach(row => row.forEach(cell => colors.add(cell)));
      
      expect(colors.size).toBeGreaterThan(1);
    });

    it('should generate organic territories with organicness 100', () => {
      const grid = generateGridWithZones(10, 10, 100);
      
      expect(grid.length).toBe(10);
      expect(grid[0].length).toBe(10);
    });

    it('should return empty array for invalid dimensions', () => {
      expect(generateGridWithZones(0, 5, 100)).toEqual([]);
      expect(generateGridWithZones(5, 0, 100)).toEqual([]);
    });
  });
});
