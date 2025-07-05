import React, { useState } from 'react';
import { formatColor, copyToClipboard } from '../utils.js';
import ColorSwatch from './ColorSwatch.jsx';

const DirectConversions = ({ colorObj }) => {
  if (!colorObj) return null;

  const hasAlpha = colorObj.alpha < 1;
  // Added 'hwb' to the list of direct color conversions.
  const allFormats = ['oklch', 'hsl', 'hwb', 'p3', 'rgb', 'hex'];
  
  const formatsToShow = hasAlpha 
    ? allFormats.filter(f => f !== 'hex')
    : allFormats;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Direct Conversions</h3>
      {formatsToShow.map(format => {
        const value = formatColor(colorObj, format);
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
          copyToClipboard(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        };
        
        return (
          <div key={format} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <ColorSwatch color={colorObj} className="w-8 h-8"/>
              <div>
                <span className="font-semibold text-sm uppercase text-gray-800 dark:text-gray-200">{format}</span>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{value}</p>
              </div>
            </div>
            <button onClick={handleCopy} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DirectConversions;
