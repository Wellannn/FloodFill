import { describe, it, expect } from 'vitest';
import { floodFill, getNeighbors } from './floodFill';

describe('Flood Fill - Fill Algorithm', () => {

  describe('getNeighbors', () => {
    it('should return 4 neighbors (up, down, left, right) for a center position', () => {
      const neighbors = getNeighbors(5, 5, 2, 2);
      
      expect(neighbors).toEqual([
        { row: 1, col: 2 },
        { row: 3, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 3 }
      ]);
    });

    it('should filter out-of-bounds neighbors (top-left corner)', () => {
      const neighbors = getNeighbors(5, 5, 0, 0);
      
      expect(neighbors).toEqual([
        { row: 1, col: 0 },
        { row: 0, col: 1 }
      ]);
    });

    it('should filter out-of-bounds neighbors (bottom-right corner)', () => {
      const neighbors = getNeighbors(5, 5, 4, 4);
      
      expect(neighbors).toEqual([
        { row: 3, col: 4 },
        { row: 4, col: 3 }
      ]);
    });

    it('should handle edges', () => {
      const neighbors = getNeighbors(5, 5, 0, 2);
      
      expect(neighbors).toEqual([
        { row: 1, col: 2 },
        { row: 0, col: 1 },
        { row: 0, col: 3 }
      ]);
    });
  });

  describe('floodFill', () => {
    
    it('should fill a single cell with a new color', () => {
      const grid = [['#FF0000']];
      const result = floodFill(grid, 0, 0, '#0000FF');
      
      expect(result.snapshots.length).toBeGreaterThan(0);
      expect(result.snapshots[result.snapshots.length - 1][0][0]).toBe('#0000FF');
    });

    it('should fill a region of same color (simple horizontal case)', () => {
      const grid = [['#FF0000', '#FF0000', '#00FF00']];
      const result = floodFill(grid, 0, 0, '#0000FF');
      
      const finalGrid = result.snapshots[result.snapshots.length - 1];
      
      expect(finalGrid[0][0]).toBe('#0000FF');
      expect(finalGrid[0][1]).toBe('#0000FF');
      expect(finalGrid[0][2]).toBe('#00FF00');
    });

    it('should fill a cross-shaped region (4 directions)', () => {
      const grid = [
        ['#00FF00', '#FF0000', '#00FF00'],
        ['#FF0000', '#FF0000', '#FF0000'],
        ['#00FF00', '#FF0000', '#00FF00']
      ];
      
      const result = floodFill(grid, 1, 1, '#0000FF');
      const finalGrid = result.snapshots[result.snapshots.length - 1];
      
      expect(finalGrid[0][1]).toBe('#0000FF');
      expect(finalGrid[1][0]).toBe('#0000FF');
      expect(finalGrid[1][1]).toBe('#0000FF');
      expect(finalGrid[1][2]).toBe('#0000FF');
      expect(finalGrid[2][1]).toBe('#0000FF');
      
      expect(finalGrid[0][0]).toBe('#00FF00');
      expect(finalGrid[0][2]).toBe('#00FF00');
      expect(finalGrid[2][0]).toBe('#00FF00');
      expect(finalGrid[2][2]).toBe('#00FF00');
    });

    it('should generate multiple snapshots to visualize progression', () => {
      const grid = [
        ['#FF0000', '#FF0000'],
        ['#FF0000', '#FF0000']
      ];
      
      const result = floodFill(grid, 0, 0, '#0000FF');
      
      expect(result.snapshots.length).toBeGreaterThanOrEqual(2);
    });

    it('should return unchanged grid if target color is identical', () => {
      const grid = [
        ['#FF0000', '#FF0000'],
        ['#FF0000', '#FF0000']
      ];
      
      const result = floodFill(grid, 0, 0, '#FF0000');
      
      expect(result.snapshots.length).toBeGreaterThan(0);
      expect(result.snapshots[0][0][0]).toBe('#FF0000');
    });

    it('should never modify the original grid', () => {
      const originalGrid = [
        ['#FF0000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      const gridCopy = originalGrid.map(row => [...row]);
      
      floodFill(originalGrid, 0, 0, '#000000');
      
      expect(originalGrid).toEqual(gridCopy);
    });

    it('should handle a 1x1 grid', () => {
      const grid = [['#FF0000']];
      const result = floodFill(grid, 0, 0, '#0000FF');
      
      expect(result.snapshots[result.snapshots.length - 1][0][0]).toBe('#0000FF');
    });

    it('should handle a grid entirely of the same color', () => {
      const grid = [
        ['#FF0000', '#FF0000'],
        ['#FF0000', '#FF0000']
      ];
      
      const result = floodFill(grid, 1, 1, '#0000FF');
      const finalGrid = result.snapshots[result.snapshots.length - 1];
      
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          expect(finalGrid[r][c]).toBe('#0000FF');
        }
      }
    });

    it('should place initial snapshot first', () => {
      const grid = [
        ['#FF0000', '#FF0000'],
        ['#FF0000', '#FF0000']
      ];
      
      const result = floodFill(grid, 0, 0, '#0000FF');
      const firstSnapshot = result.snapshots[0];
      
      expect(firstSnapshot[0][0]).toBe('#FF0000');
    });

    it('should return object with correct structure', () => {
      const grid = [['#FF0000']];
      const result = floodFill(grid, 0, 0, '#0000FF');
      
      expect(result).toHaveProperty('snapshots');
      expect(Array.isArray(result.snapshots)).toBe(true);
      expect(result.snapshots.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases and recursion', () => {

    it('should handle an L-shaped region', () => {
      const grid = [
        ['#FF0000', '#00FF00'],
        ['#FF0000', '#00FF00'],
        ['#FF0000', '#00FF00']
      ];
      
      const result = floodFill(grid, 0, 0, '#0000FF');
      const finalGrid = result.snapshots[result.snapshots.length - 1];
      
      expect(finalGrid[0][0]).toBe('#0000FF');
      expect(finalGrid[1][0]).toBe('#0000FF');
      expect(finalGrid[2][0]).toBe('#0000FF');
      
      expect(finalGrid[0][1]).toBe('#00FF00');
      expect(finalGrid[1][1]).toBe('#00FF00');
      expect(finalGrid[2][1]).toBe('#00FF00');
    });

    it('should handle a complex region (spiral)', () => {
      const grid = [
        ['#FF0000', '#FF0000', '#FF0000'],
        ['#00FF00', '#00FF00', '#FF0000'],
        ['#00FF00', '#00FF00', '#FF0000']
      ];
      
      const result = floodFill(grid, 0, 0, '#0000FF');
      const finalGrid = result.snapshots[result.snapshots.length - 1];
      
      expect(finalGrid[0][0]).toBe('#0000FF');
      expect(finalGrid[0][1]).toBe('#0000FF');
      expect(finalGrid[0][2]).toBe('#0000FF');
      
      expect(finalGrid[1][2]).toBe('#0000FF');
      expect(finalGrid[2][2]).toBe('#0000FF');
      
      expect(finalGrid[1][0]).toBe('#00FF00');
      expect(finalGrid[1][1]).toBe('#00FF00');
      expect(finalGrid[2][0]).toBe('#00FF00');
      expect(finalGrid[2][1]).toBe('#00FF00');
    });

    it('should handle click on invalid position', () => {
      const grid = [['#FF0000']];
      
      expect(() => {
        floodFill(grid, -1, 0, '#0000FF');
      }).not.toThrow();
    });

    it('should handle click on out of bounds position', () => {
      const grid = [['#FF0000']];
      const result = floodFill(grid, 5, 5, '#0000FF');
      
      expect(result.snapshots.length).toBe(1);
      expect(result.snapshots[0][0][0]).toBe('#FF0000');
    });

    it('should handle empty grid', () => {
      const grid = [];
      const result = floodFill(grid, 0, 0, '#0000FF');
      
      expect(result.snapshots.length).toBe(1);
      expect(result.snapshots[0]).toEqual([]);
    });
  });
});
