import { useState, useEffect, useRef } from 'react';
import { createDisplayGrid } from '../utils/gridHelpers';

/**
 * Custom hook to manage flood fill animation state
 * Handles animation timing, snapshots, and state transitions
 * @param {string[][]} baseGrid - The base grid state
 * @param {number} animationSpeed - Speed of animation in milliseconds
 * @param {Function} onAnimationComplete - Callback when animation finishes with final grid
 * @returns {Object} Animation state and control functions
 */
export const useFloodFillAnimation = (baseGrid, animationSpeed, onAnimationComplete) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [snapshots, setSnapshots] = useState([]);
  const [flipDirection, setFlipDirection] = useState(null);
  const [currentGrid, setCurrentGrid] = useState(baseGrid);
  
  const animationTimeoutRef = useRef(null);

  const startAnimation = (newSnapshots, direction) => {
    setFlipDirection(direction);
    setSnapshots(newSnapshots);
    setAnimationStep(0);
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setIsAnimating(false);
    setAnimationStep(0);
    setSnapshots([]);
    setFlipDirection(null);
  };

  useEffect(() => {
    if (!isAnimating) {
      setCurrentGrid(baseGrid);
    }
  }, [baseGrid]);

  useEffect(() => {
    if (!isAnimating || snapshots.length === 0) {
      return;
    }

    if (animationStep >= snapshots.length - 1) {
      if (onAnimationComplete && snapshots.length > 0) {
        const finalGrid = snapshots[snapshots.length - 1];
        onAnimationComplete(finalGrid);
      }
      stopAnimation();
      return;
    }

    animationTimeoutRef.current = setTimeout(() => {
      setAnimationStep(prev => prev + 1);
    }, animationSpeed);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isAnimating, animationStep, snapshots, animationSpeed, onAnimationComplete]);

  useEffect(() => {
    if (isAnimating && snapshots.length > 0 && animationStep < snapshots.length) {
      setCurrentGrid(prev => createDisplayGrid(baseGrid, snapshots[animationStep]));
    }
  }, [isAnimating, animationStep, snapshots, baseGrid]);

  return {
    isAnimating,
    currentGrid,
    flipDirection,
    animationStep,
    totalSteps: snapshots.length,
    startAnimation,
    stopAnimation
  };
};
