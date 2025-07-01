import Color from 'colorjs.io';

export const formatColor = (colorObj, format) => {
  if (!colorObj) return 'N/A';
  try {
    return colorObj.toString({ format, precision: 3 });
  } catch (e) {
    console.error(`Error formatting color:`, e);
    return 'Invalid';
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};