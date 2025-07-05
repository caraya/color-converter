import Color from 'colorjs.io';

export const formatColor = (colorObj, format) => {
  if (!colorObj) return 'N/A';
  try {
    let convertedColor = colorObj;
    let stringOptions = { precision: 3 };

    // Added 'hwb' to the list of formats that require explicit conversion.
    if (['oklch', 'hsl', 'hwb', 'p3'].includes(format)) {
      // Explicitly convert to the target color space before stringifying
      convertedColor = colorObj.to(format);
    } else {
      // For rgb and hex, directly use the format option in toString()
      stringOptions.format = format;
    }

    let result = convertedColor.toString(stringOptions);

    // Post-process for oklch and hsl hue 'none' for achromatic colors
    if (format === 'oklch' && result.includes('none')) {
      result = result.replace(/oklch\(([^ ]+) ([^ ]+) none\)/, 'oklch($1 $2 0)');
    } else if (format === 'hsl' && result.includes('none')) {
      result = result.replace(/hsl\(none ([^ ]+) ([^ ]+)\)/, 'hsl(0 $1 $2)');
    }

    return result;
  } catch (e) {
    // If an error occurs during conversion, return 'N/A'.
    console.error(`Error formatting color for ${format}:`, e);
    return 'N/A';
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};
