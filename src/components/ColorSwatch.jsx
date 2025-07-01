import React from 'react';
import Color from 'colorjs.io';

const ColorSwatch = ({ color, className = 'w-10 h-10 md:w-12 md:h-12' }) => {
  const style = { backgroundColor: color instanceof Color ? color.toString() : 'transparent' };
  return <div className={`flex-shrink-0 rounded-lg border border-gray-300 dark:border-gray-700 shadow-inner ${className}`} style={style}></div>;
};

export default ColorSwatch;
