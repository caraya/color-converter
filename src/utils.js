import Color from 'colorjs.io';

export const formatColor = (colorObj, format) => {
  if (!colorObj) return 'N/A';

  try {
    // 1. Correctly map the format string to its corresponding color space ID.
    let targetSpaceId;
    switch (format) {
        case 'hex':
        case 'rgb':
            targetSpaceId = 'srgb';
            break;
        case 'p3':
            targetSpaceId = 'p3';
            break;
        case 'hsl':
            targetSpaceId = 'hsl';
            break;
        case 'hwb':
            targetSpaceId = 'hwb';
            break;
        case 'oklch':
            targetSpaceId = 'oklch';
            break;
        default:
            // This case should not be reached with the current list of formats.
            console.error(`Unknown format: ${format}`);
            return 'N/A';
    }

    const sourceSpaceId = colorObj.space.id;

    // 2. Only perform a gamut check if we are converting *from a different* color space.
    //    This avoids false negatives from floating-point errors when checking a color
    //    that is already within the target space.
    if (sourceSpaceId !== targetSpaceId) {
        if (!colorObj.inGamut(targetSpaceId, { epsilon: 1e-5 })) {
            return 'N/A';
        }
    }

    // 3. Convert the color object to the correct target space.
    const convertedColor = colorObj.to(targetSpaceId);

    // 4. Serialize that converted color into the desired string format.
    let result = convertedColor.toString({
      format: format,
      precision: 3
    });
    
    // 5. Post-process for 'none' hue in achromatic colors for better readability.
    if (format === 'oklch' && result.includes('none')) {
      result = result.replace(/oklch\(([^ ]+) ([^ ]+) none\)/, 'oklch($1 $2 0)');
    } else if (format === 'hsl' && result.includes('none')) {
      result = result.replace(/hsl\(none ([^ ]+) ([^ ]+)\)/, 'hsl(0 $1 $2)');
    }

    return result;
  } catch (e) {
    // Fallback for any other unexpected errors.
    console.error(`Error formatting color for ${format}:`, e);
    return 'N/A';
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};
