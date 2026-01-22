/**
 * Cell Component - Represents a single grid cell
 * @param {Object} props - Component props
 * @param {string} props.color - Hex color of the cell
 * @param {Function} props.onClick - Click handler callback
 * @param {boolean} props.isAnimating - Whether parent grid is animating
 * @param {string|null} props.flipDirection - Direction to flip ('up'|'down'|'left'|'right'|'center'|null)
 * @param {boolean} props.isFlipping - Whether this specific cell should flip now
 */
export const Cell = ({ 
  color, 
  onClick, 
  isAnimating, 
  flipDirection = null, 
  isFlipping = false 
}) => {
  const getFlipClass = () => {
    if (!isFlipping || !flipDirection || flipDirection === 'center') {
      return '';
    }
    return `flip-${flipDirection}`;
  };

  const flipClass = getFlipClass();

  return (
    <div
      className={`cell ${isAnimating ? 'animating' : ''} ${flipClass}`}
      style={{ 
        backgroundColor: color,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Cell with color ${color}`}
    />
  );
};

export default Cell;