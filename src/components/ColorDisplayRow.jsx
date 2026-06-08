import React, { useState } from 'react';
import { formatColor, formatColorVariants, copyToClipboard } from '../utils.js';
import ColorSwatch from './ColorSwatch.jsx';

const ColorDisplayRow = ({ title, colorObj, formats = ['oklch', 'p3', 'rgb', 'hwb'], gamutMode = 'space' }) => {
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
            const variants = formatColorVariants(colorObj, format) || { space: { value: formatColor(colorObj, format), outOfGamut: false }, perceptual: { value: formatColor(colorObj, format), outOfGamut: false } };
            const spaceValue = variants.space.value;
            const perceptualValue = variants.perceptual.value;

            const showSpace = gamutMode === 'space' || gamutMode === 'both';
            const showPerceptual = gamutMode === 'perceptual' || gamutMode === 'both';

            const spaceRaw = spaceValue ? spaceValue.split(' (out of gamut')[0].trim() : '';
            const spaceNote = spaceValue && spaceValue.includes('(out of gamut') ? spaceValue.slice(spaceValue.indexOf('(')) : null;

            const perceptualRaw = perceptualValue ? perceptualValue.split(' (out of gamut')[0].trim() : '';
            const perceptualNote = perceptualValue && perceptualValue.includes('(out of gamut') ? perceptualValue.slice(perceptualValue.indexOf('(')) : null;

            return (
              <div key={format} className="flex items-center justify-between">
                <div>
                  <div>
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">{format}: </span>
                    {showSpace && (
                      <div className="inline-block ml-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-300">{spaceRaw}</span>
                        {spaceNote && <div className="text-[10px] italic text-yellow-700 dark:text-yellow-300 mt-0.5">{spaceNote}</div>}
                      </div>
                    )}
                  </div>

                  {showPerceptual && gamutMode === 'both' && (
                    <div className="mt-1">
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-300">{perceptualRaw}</span>
                      {perceptualNote && <div className="text-[10px] italic text-yellow-700 dark:text-yellow-300 mt-0.5">{perceptualNote}</div>}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {showSpace && (
                    <button
                      onClick={() => handleCopy(spaceRaw)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-3 flex-shrink-0"
                      title={`Click to copy ${spaceRaw}`}
                    >
                      {copiedValue === spaceRaw ? 'Copied!' : 'Copy'}
                    </button>
                  )}

                  {showPerceptual && gamutMode === 'both' && (
                    <button
                      onClick={() => handleCopy(perceptualRaw)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-3 flex-shrink-0"
                      title={`Click to copy ${perceptualRaw}`}
                    >
                      {copiedValue === perceptualRaw ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorDisplayRow;
