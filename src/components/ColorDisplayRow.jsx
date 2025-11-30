import React, { useState } from 'react';
import { formatColor, copyToClipboard } from '../utils.js';
import ColorSwatch from './ColorSwatch.jsx';

const ColorDisplayRow = ({ title, colorObj, formats = ['oklch', 'p3', 'rgb', 'hwb'] }) => {
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
            // If formatColor appended an out-of-gamut note, split it out so
            // we can style the note and only copy the actual color string.
            const outOfGamutMarker = ' (out of gamut';
            const hasNote = value && value.includes(outOfGamutMarker);
            const baseValue = hasNote ? value.split(outOfGamutMarker)[0].trim() : value;
            const note = hasNote ? value.slice(value.indexOf('(')).trim() : null;
            return (
              <div key={format} className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">{format}: </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-300">{baseValue}</span>
                  {note && (
                    <div className="text-[10px] italic text-yellow-700 dark:text-yellow-300 mt-0.5">{note}</div>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(baseValue)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-3 flex-shrink-0"
                  title={`Click to copy ${value}`}
                >
                  {copiedValue === baseValue ? 'Copied!' : 'Copy'}
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
