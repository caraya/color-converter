import Color from 'colorjs.io';

export const formatColor = (colorObj, format) => {
  if (!colorObj) return 'N/A';

  try {
    let targetSpaceId;
    switch (format) {
      case 'rgb':
      case 'hex':
      case 'hsl':
      case 'hwb':
        targetSpaceId = 'srgb';
        break;
      case 'p3':
        targetSpaceId = 'p3';
        break;
      default:
        targetSpaceId = null;
    }

    // If a format maps to a specific gamut (like srgb for rgb/hex),
    // and the color is outside that gamut, it cannot be represented.
    if (targetSpaceId && !colorObj.inGamut(targetSpaceId)) {
      return 'N/A';
    }

    // If the gamut check passes, we can proceed with the conversion.
    let colorToFormat = colorObj;
    let stringOptions = { precision: 3 };

    if (format === 'hex') {
        // For hex, we must be in srgb space.
        colorToFormat = colorObj.to('srgb');
        stringOptions.format = 'hex';
    } else if (['rgb', 'hsl', 'hwb', 'p3', 'oklch'].includes(format)) {
        // For other functional notations, convert to the format's space.
        colorToFormat = colorObj.to(format);
    }
    
    let result = colorToFormat.toString(stringOptions);

    // Post-process for oklch and hsl hue 'none' for achromatic colors
    if (format === 'oklch' && result.includes('none')) {
      result = result.replace(/oklch\(([^ ]+) ([^ ]+) none\)/, 'oklch($1 $2 0)');
    } else if (format === 'hsl' && result.includes('none')) {
      result = result.replace(/hsl\(none ([^ ]+) ([^ ]+)\)/, 'hsl(0 $1 $2)');
    }

    return result;
  } catch (e) {
    // Fallback for any other conversion errors.
    console.error(`Error formatting color for ${format}:`, e);
    return 'N/A';
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};
