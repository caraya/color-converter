import React, { useState } from 'react';
import { formatColor, formatColorVariants, copyToClipboard } from '../utils.js';
import ColorSwatch from './ColorSwatch.jsx';

/**
 * A component to display a single color conversion row.
 * It manages its own "copied" state.
 */
const ConversionRow = ({ colorObj, format, mode = 'space' }) => {
  const variants = formatColorVariants(colorObj, format) || { space: { value: formatColor(colorObj, format), outOfGamut: false }, perceptual: { value: formatColor(colorObj, format), outOfGamut: false } };
  const spaceValue = variants.space.value;
  const perceptualValue = variants.perceptual.value;

  const showSpace = mode === 'space' || mode === 'both';
  const showPerceptual = mode === 'perceptual' || mode === 'both';
  // useState is now correctly at the top level of this component.
  const [copied, setCopied] = useState(false);

  const handleCopy = (v) => {
    // copy only the underlying color value, not the appended note
    copyToClipboard(v);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-4">
        <ColorSwatch color={colorObj} className="w-8 h-8" />
        <div>
          <span className="font-semibold text-sm uppercase text-gray-800 dark:text-gray-200">{format}</span>
          {showSpace && (
            <div>
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{spaceValue.split(' (out of gamut')[0]}</p>
              {spaceValue.includes('(out of gamut') && <div className="text-[11px] italic text-yellow-700 dark:text-yellow-300 mt-0.5">{spaceValue.slice(spaceValue.indexOf('('))}</div>}
            </div>
          )}
          {showPerceptual && mode === 'both' && (
            <div className="mt-1">
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{perceptualValue.split(' (out of gamut')[0]}</p>
              {perceptualValue.includes('(out of gamut') && <div className="text-[11px] italic text-yellow-700 dark:text-yellow-300 mt-0.5">{perceptualValue.slice(perceptualValue.indexOf('('))}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {showSpace && (
          <button onClick={() => handleCopy(spaceValue.split(' (out of gamut')[0])} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{copied ? 'Copied!' : 'Copy'}</button>
        )}
        {showPerceptual && mode === 'both' && (
          <button onClick={() => handleCopy(perceptualValue.split(' (out of gamut')[0])} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{copied ? 'Copied!' : 'Copy'}</button>
        )}
      </div>
    </div>
  );
};

export default ConversionRow;
