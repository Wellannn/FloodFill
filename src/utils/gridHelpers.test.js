import { describe, it, expect } from 'vitest';
import {
  calculateGridDimensions,
  determineFlipDirection,
  mergeGrids,
  createDisplayGrid
} from './gridHelpers';

describe('Grid Helpers - Utility functions', () => {

  describe('calculateGridDimensions', () => {
    it('should calculate correct grid dimensions', () => {
      const { rows, cols } = calculateGridDimensions(500, 300, 50);
      
      expect(cols).toBe(10);
      expect(rows).toBe(6);
    });

    it('should handle exact divisions', () => {
      const { rows, cols } = calculateGridDimensions(400, 400, 20);
      
      expect(cols).toBe(20);
      expect(rows).toBe(20);
    });

    it('should return at least 1 row and 1 col', () => {
      const { rows, cols } = calculateGridDimensions(10, 10, 50);
      
      expect(cols).toBeGreaterThanOrEqual(1);
      expect(rows).toBeGreaterThanOrEqual(1);
    });

    it('should handle very small spaces', () => {
      const { rows, cols } = calculateGridDimensions(5, 5, 100);
      
      expect(cols).toBe(1);
      expect(rows).toBe(1);
    });
  });

  describe('determineFlipDirection', () => {
    it('should return "up" for clicks above center', () => {
      const direction = determineFlipDirection(0, 2, 10, 5);
      expect(direction).toBe('up');
    });

    it('should return "down" for clicks below center', () => {
      const direction = determineFlipDirection(9, 2, 10, 5);
      expect(direction).toBe('down');
    });

    it('should return "left" for clicks left of center', () => {
      const direction = determineFlipDirection(5, 0, 10, 10);
      expect(direction).toBe('left');
    });

    it('should return "right" for clicks right of center', () => {
      const direction = determineFlipDirection(5, 9, 10, 10);
      expect(direction).toBe('right');
    });

    it('should return "center" for clicks at exact center', () => {
      const direction = determineFlipDirection(5, 5, 10, 10);
      expect(direction).toBe('center');
    });

    it('should handle odd-sized grids', () => {
      const directionUp = determineFlipDirection(0, 2, 5, 5);
      const directionDown = determineFlipDirection(4, 2, 5, 5);
      
      expect(directionUp).toBe('up');
      expect(directionDown).toBe('down');
    });
  });

  describe('mergeGrids', () => {
    it('should merge snapshot into base grid', () => {
      const baseGrid = [
        ['#FF0000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      const snapshot = [
        ['#000000', '#FFFFFF'],
        ['#123456', '#ABCDEF']
      ];
      
      const result = mergeGrids(baseGrid, snapshot);
      
      expect(result).toEqual(snapshot);
    });

    it('should not modify original grids', () => {
      const baseGrid = [['#FF0000']];
      const snapshot = [['#0000FF']];
      
      const result = mergeGrids(baseGrid, snapshot);
      result[0][0] = '#00FF00';
      
      expect(baseGrid[0][0]).toBe('#FF0000');
      expect(snapshot[0][0]).toBe('#0000FF');
    });
  });

  describe('createDisplayGrid', () => {
    it('should create display grid from base and snapshot', () => {
      const baseGrid = [
        ['#FF0000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      const snapshot = [
        ['#000000', '#00FF00'],
        ['#0000FF', '#FFFF00']
      ];
      
      const result = createDisplayGrid(baseGrid, snapshot);
      
      expect(result[0][0]).toBe('#000000');
      expect(result[0][1]).toBe('#00FF00');
    });

    it('should handle empty snapshots', () => {
      const baseGrid = [['#FF0000']];
      const snapshot = [[]];
      
      const result = createDisplayGrid(baseGrid, snapshot);
      
      expect(result[0][0]).toBe('#FF0000');
    });

    it('should not modify original grids', () => {
      const baseGrid = [['#FF0000']];
      const snapshot = [['#0000FF']];
      
      const result = createDisplayGrid(baseGrid, snapshot);
      result[0][0] = '#00FF00';
      
      expect(baseGrid[0][0]).toBe('#FF0000');
      expect(snapshot[0][0]).toBe('#0000FF');
    });
  });
});
