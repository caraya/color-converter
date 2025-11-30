import React, { useState } from 'react';
import { formatColor, copyToClipboard } from '../utils.js';
import ColorSwatch from './ColorSwatch.jsx';

/**
 * A component to display a single color conversion row.
 * It manages its own "copied" state.
 */
const ConversionRow = ({ colorObj, format }) => {
  const rawValue = formatColor(colorObj, format);
  const outOfGamutMarker = ' (out of gamut';
  const hasNote = rawValue && rawValue.includes(outOfGamutMarker);
  const value = hasNote ? rawValue.split(outOfGamutMarker)[0].trim() : rawValue;
  const note = hasNote ? rawValue.slice(rawValue.indexOf('(')).trim() : null;
  // useState is now correctly at the top level of this component.
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // copy only the underlying color value, not the appended note
    copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-4">
        <ColorSwatch color={colorObj} className="w-8 h-8" />
        <div>
          <span className="font-semibold text-sm uppercase text-gray-800 dark:text-gray-200">{format}</span>
          <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{value}</p>
          {note && <div className="text-[11px] italic text-yellow-700 dark:text-yellow-300 mt-0.5">{note}</div>}
        </div>
      </div>
      <button onClick={handleCopy} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default ConversionRow;
