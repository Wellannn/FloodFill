[![CI](https://github.com/Wellannn/FloodFill/actions/workflows/ci.yml/badge.svg)](https://github.com/Wellannn/FloodFill/actions/workflows/ci.yml)

# Flood Fill Visualization

Interactive React application implementing the flood fill algorithm with functional programming principles and comprehensive test coverage.

## Overview

This project implements a flood fill algorithm with:

- Recursive BFS implementation for wave-like propagation
- Pure functional programming with immutable data structures
- 56 unit tests covering all core functionality
- React UI with responsive design and 3D animations
- Organic territory generation using Perlin noise

## Installation

```bash
npm install
npm run dev
```

Application runs on http://localhost:5173

## Project Structure

```
src/
├── core/
│   ├── floodFill.js              Recursive flood fill algorithm
│   ├── floodFill.test.js         19 algorithm tests
│   ├── grid.js                   Grid generation and utilities
│   └── grid.test.js              24 grid tests
├── components/
│   ├── Cell.jsx                  Grid cell with 3D animation
│   ├── Grid.jsx                  Grid container
│   └── ColorPicker.jsx           Color selection UI
├── hooks/
│   ├── useFloodFillAnimation.js  Animation state management
│   └── useGridDimensions.js      Responsive sizing
├── utils/
│   ├── gridHelpers.js            Helper utilities
│   └── gridHelpers.test.js       13 utility tests
└── App.jsx                       Main application component
```

## Features

**Algorithm**
- Recursive breadth-first search flood fill
- Generates animation snapshots with each frame
- Pure functional implementation with no side effects
- Handles all edge cases and boundaries

**UI**
- Color picker with preset palette
- Cell size adjustment (20-80px)
- Animation speed control (30-300ms)
- Organic territory density slider
- Color picker mode for grid sampling
- Responsive mobile/tablet/desktop support

**Animation**
- 3D post-it flip effect in 4 directions
- Direction based on click position
- Elastic easing for natural motion
- Wind-like cascading effect

## Testing

```bash
npm test
```

56 tests passing:
- Flood fill algorithm: 19 tests
- Grid utilities: 24 tests
- Helper functions: 13 tests

Tests verify algorithm correctness, immutability, and edge cases.

## Build and Run

```bash
npm run dev
npm run build
npm run preview
```
