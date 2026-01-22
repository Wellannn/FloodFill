import { useState, useEffect } from 'react';
import Grid from './components/Grid';
import ColorPicker from './components/ColorPicker';
import { generateGridWithZones } from './core/grid';
import { floodFill } from './core/floodFill';
import { useGridDimensions } from './hooks/useGridDimensions';
import { useFloodFillAnimation } from './hooks/useFloodFillAnimation';
import { determineFlipDirection } from './utils/gridHelpers';
import './App.css';

const PRESET_COLORS = ['#FF006E', '#3A86FF', '#06FFA5'];

/**
 * Main application component
 * Manages game state and coordinates between UI controls and grid
 */
function App() {
  // UI Configuration State
  const [cellSize, setCellSize] = useState(40);
  const [organicness, setOrganicness] = useState(100);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Color Selection State
  const [selectedColor, setSelectedColor] = useState('#FF006E');
  const [isColorPickerMode, setIsColorPickerMode] = useState(false);
  
  // Calculate grid dimensions based on available space
  const { rows, cols, containerRef } = useGridDimensions(cellSize);
  
  // Grid State
  const [baseGrid, setBaseGrid] = useState(() => 
    generateGridWithZones(rows, cols, organicness)
  );
  
  /**
   * Handles animation completion
   * Updates base grid with final result
   * @param {string[][]} finalGrid - Final grid state after animation
   */
  const handleAnimationComplete = (finalGrid) => {
    setBaseGrid(finalGrid);
  };
  
  // Animation State
  const {
    isAnimating,
    currentGrid,
    flipDirection,
    animationStep,
    totalSteps,
    startAnimation,
    stopAnimation
  } = useFloodFillAnimation(baseGrid, animationSpeed, handleAnimationComplete);

  /**
   * Handles cell click events
   * Either picks color or starts flood fill animation
   * @param {number} row - Clicked row index
   * @param {number} col - Clicked column index
   */
  const handleCellClick = (row, col) => {
    if (isAnimating) return;
    
    if (isColorPickerMode) {
      const cellColor = currentGrid[row][col];
      setSelectedColor(cellColor);
      setIsColorPickerMode(false);
      return;
    }

    const direction = determineFlipDirection(row, col, rows, cols);

    const result = floodFill(currentGrid, row, col, selectedColor);
    
    startAnimation(result.snapshots, direction);
  };

  /**
   * Handles color selection from palette
   * Pure function interface
   * @param {string} color - Selected hex color
   */
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  /**
   * Resets grid to new random state
   * Stops any ongoing animation
   */
  const handleResetGrid = () => {
    stopAnimation();
    const newGrid = generateGridWithZones(rows, cols, organicness);
    setBaseGrid(newGrid);
  };

  /**
   * Handles animation speed slider change
   * @param {Event} e - Change event
   */
  const handleSpeedChange = (e) => {
    setAnimationSpeed(parseInt(e.target.value, 10));
  };

  /**
   * Handles organicness slider change
   * @param {Event} e - Change event
   */
  const handleOrganicnessChange = (e) => {
    setOrganicness(parseInt(e.target.value, 10));
  };

  /**
   * Handles cell size slider change
   * Stops animation on size change
   * @param {Event} e - Change event
   */
  const handleCellSizeChange = (e) => {
    setCellSize(parseInt(e.target.value, 10));
    stopAnimation();
  };

  useEffect(() => {
    if (rows > 0 && cols > 0) {
      const newGrid = generateGridWithZones(rows, cols, organicness);
      setBaseGrid(newGrid);
      stopAnimation();
    }
  }, [rows, cols, organicness]);

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button 
          className="burger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Close menu" : "Open menu"}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="controls">
          <ColorPicker 
            onColorSelect={handleColorSelect} 
            disabled={isAnimating}
          />

          <button 
            className={`color-picker-btn ${isColorPickerMode ? 'active' : ''}`}
            onClick={() => setIsColorPickerMode(!isColorPickerMode)}
            disabled={isAnimating}
            title="Pick color from grid"
          >
            🔭 Pick
          </button>

          <div className="current-color">
            <div 
              className="color-swatch"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="color-info">
              <span className="color-label">Current</span>
              <span className="color-code">{selectedColor}</span>
            </div>
          </div>

          <div className="preset-colors">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className="preset-btn"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                disabled={isAnimating}
                title={color}
              />
            ))}
          </div>

          <div className="cell-size-control">
            <label htmlFor="cell-size-slider">Cell Size: {cellSize}px</label>
            <input
              id="cell-size-slider"
              type="range"
              min="20"
              max="80"
              step="5"
              value={cellSize}
              onChange={handleCellSizeChange}
              disabled={isAnimating}
              aria-label="Cell size slider"
            />
          </div>

          <div className="organicness-control">
            <label htmlFor="organicness-slider">Organic: {organicness}%</label>
            <input
              id="organicness-slider"
              type="range"
              min="0"
              max="100"
              step="10"
              value={organicness}
              onChange={handleOrganicnessChange}
              disabled={isAnimating}
              aria-label="Organicness slider"
            />
          </div>

          <div className="speed-control">
            <label htmlFor="speed-slider">Speed: {animationSpeed}ms</label>
            <input
              id="speed-slider"
              type="range"
              min="30"
              max="300"
              step="10"
              value={animationSpeed}
              onChange={handleSpeedChange}
              disabled={isAnimating}
              aria-label="Animation speed slider"
            />
          </div>

          <button 
            className="reset-button"
            onClick={handleResetGrid}
            disabled={isAnimating}
          >
            Reset
          </button>
        </div>
      </aside>

      <main className="main-content" ref={containerRef}>
        <Grid 
          grid={currentGrid} 
          onCellClick={handleCellClick}
          isAnimating={isAnimating}
          cellSize={cellSize}
          flipDirection={flipDirection}
          animationStep={animationStep}
          totalSteps={totalSteps}
        />
      </main>
    </div>
  );
}

export default App;