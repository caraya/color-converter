import React, { useState } from 'react';
import { formatColor, copyToClipboard } from '../utils.js';
import ColorSwatch from './ColorSwatch.jsx';

const ColorDisplayRow = ({ title, colorObj, formats = ['oklch', 'p3', 'rgb'] }) => {
  if (!colorObj) return null;

  const [copiedValue, setCopiedValue] = useState(null);

  const handleCopy = (value) => {
    copyToClipboard(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 1500);
  };

  return (
    <div className="flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
      <ColorSwatch color={colorObj} />
      <div className="flex-grow">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mt-2">
          {formats.map(format => {
            const value = formatColor(colorObj, format);
            return (
              <div key={format} className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">{format}: </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-300">{value}</span>
                </div>
                <button
                  onClick={() => handleCopy(value)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-3 flex-shrink-0"
                  title={`Click to copy ${value}`}
                >
                  {copiedValue === value ? 'Copied!' : 'Copy'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorDisplayRow;
