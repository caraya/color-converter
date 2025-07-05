import React from 'react';
// Import the new ConversionRow component
import ConversionRow from './ConversionRow.jsx';

const DirectConversions = ({ colorObj }) => {
  if (!colorObj) return null;

  const hasAlpha = colorObj.alpha < 1;
  const allFormats = ['oklch', 'hsl', 'hwb', 'p3', 'rgb', 'hex'];

  const formatsToShow = hasAlpha
    ? allFormats.filter(f => f !== 'hex')
    : allFormats;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Direct Conversions</h3>
      {/* Map over the formats and render a ConversionRow for each */}
      {formatsToShow.map(format => (
        <ConversionRow key={format} colorObj={colorObj} format={format} />
      ))}
    </div>
  );
};

export default DirectConversions;
