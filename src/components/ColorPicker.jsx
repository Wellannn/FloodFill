import { useState } from 'react';

export const ColorPicker = ({ onColorSelect, disabled }) => {
  const [selectedColor, setSelectedColor] = useState('#9911ff');

  const handleColorChange = (e) => {
    const color = e.target.value.toUpperCase();
    setSelectedColor(color);
    onColorSelect(color);
  };

  return (
    <div className="color-picker">
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        disabled={disabled}
        aria-label="Color picker"
      />
      <span className="color-value">{selectedColor}</span>
    </div>
  );
};

export default ColorPicker;
