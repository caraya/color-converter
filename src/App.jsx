import React, { useState, useEffect, useMemo } from 'react';
import Color from 'colorjs.io';

import DirectConversions from './components/DirectConversions.jsx';
import ColorScale from './components/ColorScale.jsx';
import ColorHarmonies from './components/ColorHarmonies.jsx';

export default function App() {
  const [colorInput, setColorInput] = useState('#639');
  const [colorObj, setColorObj] = useState(null);
  const [parseError, setParseError] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateMode = () => {
        setIsDark(mediaQuery.matches);
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
    };
    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    return () => mediaQuery.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    try {
      let processedInput = colorInput.trim();
      
      const newColor = new Color(processedInput);
      setColorObj(newColor);
      setParseError('');
    } catch (e) {
      setColorObj(null);
      setParseError('Invalid color format. Please use a supported CSS color string.');
    }
  }, [colorInput]);

  const appBgClass = 'bg-gray-100 dark:bg-gray-900';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${appBgClass}`}>
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Advanced Color Tool</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Enter any CSS color to see detailed conversions, scales, and harmonies.</p>
        </header>
        
        <div className="mb-6">
          <label htmlFor="color-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color Input
          </label>
          <input
            id="color-input"
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border text-base transition-all duration-200 ${
              parseError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            placeholder="e.g., oklch(65% 0.25 25)"
          />
          {parseError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{parseError}</p>}
        </div>

        {colorObj ? (
          <div className="space-y-8">
            <DirectConversions colorObj={colorObj} />
            <ColorScale colorObj={colorObj} />
            <ColorHarmonies colorObj={colorObj} />
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg">
            {!parseError && <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Enter a valid color to begin</h2>}
            <p className="text-gray-500 dark:text-gray-400 mt-2">Supports all CSS color formats, like names, hex, rgb, hsl, and oklch.</p>
          </div>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-xs text-gray-500 dark:text-gray-400">
        <p>Powered by React and color.js</p>
      </footer>
    </div>
  );
}