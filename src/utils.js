import Color from 'colorjs.io';

const mapFormatToSpace = (format) => {
  switch (format) {
    case 'hex':
    case 'rgb':
      return 'srgb';
    case 'p3':
      return 'p3';
    case 'hsl':
      return 'hsl';
    case 'hwb':
      return 'hwb';
    case 'oklch':
      return 'oklch';
    default:
      return null;
  }
};

/**
 * Find a perceptual (OKLCH-space) nearest-gamut color for `colorObj`
 * constrained to `targetSpaceId` using a lightweight search.
 * Returns a Color instance (from colorjs.io) corresponding to the nearest in-gamut value.
 *
 * Note: this is an approximation algorithm that tries small hue/lightness offsets
 * and binary-searches for maximal chroma that fits. It intentionally favors small
 * local changes and is tuned to be fast for interactive UIs.
 */
export const nearestGamutOKLCH = (colorObj, targetSpaceId) => {
  if (!colorObj) return null;

  // If the source is already in-gamut for the target, just return the color
  if (colorObj.inGamut(targetSpaceId, { epsilon: 1e-5 })) return colorObj;

  // Convert to OKLCH to work in a perceptual space
  const ok = colorObj.to('oklch');
  const L0 = ok.l; // 0..1
  const C0 = ok.c; // >=0
  const H0 = ok.h; // degrees (0..360)

  // Helper to construct an OKLCH string readable by Color
  const buildOKLCH = (L, C, H) => {
    // L expected as fraction -> percent string, C and H as their numeric forms
    const Lstr = `${(L * 100).toFixed(3)}%`;
    // C is often a small decimal, let toString be concise
    const Cstr = Number.isFinite(C) ? C.toFixed(6).replace(/\.0+$/, '') : C;
    const Hstr = Number.isFinite(H) ? Number(H).toFixed(3).replace(/\.0+$/, '') : H;
    return `oklch(${Lstr} ${Cstr} ${Hstr})`;
  };

  // quick short-circuit
  if (!Number.isFinite(C0) || C0 <= 1e-6) {
    // achromatic -> just clamp in target space
    return colorObj.to(targetSpaceId);
  }

  // search parameter grid (small local neighborhood)
  const hueOffsets = [0, -2.5, 2.5, -5, 5];
  const lightOffsets = [0, -0.03, 0.03, -0.06, 0.06];

  const candidates = [];

  // For each candidate (hue/lightness offset), binary search the maximum chroma
  // that still fits the target space. Use a fixed iteration budget for speed.
  const iterations = 28; // sufficient precision for chroma

  for (const dh of hueOffsets) {
    for (const dL of lightOffsets) {
      const h = (H0 + dh + 360) % 360;
      const L = Math.max(0, Math.min(1, L0 + dL));

      // binary search chroma in [0, C0]
      let lo = 0;
      let hi = C0;
      let best = 0;

      for (let i = 0; i < iterations; i++) {
        const mid = (lo + hi) / 2;
        const s = buildOKLCH(L, mid, h);
        try {
          const cand = new Color(s);
          if (cand.inGamut(targetSpaceId, { epsilon: 1e-7 })) {
            best = mid;
            lo = mid; // try larger chroma
          } else {
            hi = mid; // reduce
          }
        } catch (e) {
          // parsing error (shouldn't happen); shrink range
          hi = mid;
        }
      }

      // Only accept candidates with meaningful chroma
      if (best > 1e-7) {
        const s = buildOKLCH(L, best, h);
        try {
          candidates.push(new Color(s));
        } catch (e) {
          // ignore
        }
      }
    }
  }

  // If we found no candidates, fallback to a clamped version (converted color)
  if (candidates.length === 0) return colorObj.to(targetSpaceId);

  // Compute OKLab distances to the original and pick the best candidate.
  const origLab = colorObj.to('oklab');
  const origL = origLab.l;
  const origA = origLab.a;
  const origB = origLab.b;

  let bestCandidate = null;
  let bestDist = Infinity;

  for (const cand of candidates) {
    try {
      const cl = cand.to('oklab');
      const dl = cl.l - origL;
      const da = cl.a - origA;
      const db = cl.b - origB;
      const d = Math.sqrt(dl * dl + da * da + db * db);
      if (d < bestDist) {
        bestDist = d;
        bestCandidate = cand;
      }
    } catch (_) {
      // ignore
    }
  }

  return bestCandidate ? bestCandidate : colorObj.to(targetSpaceId);
};

/**
 * Returns a pair of formatted strings for a given color and format:
 * - space: serialization produced by direct conversion / clamping to the target space
 * - perceptual: serialization produced by nearestGamutOKLCH then converted/serialized to target
 * Each variant also includes a boolean flag indicating whether it was out-of-gamut.
 */
export const formatColorVariants = (colorObj, format) => {
  if (!colorObj) return null;

  const targetSpaceId = mapFormatToSpace(format);
  if (!targetSpaceId) return null;

  const sourceSpaceId = colorObj.space.id;
  const result = {
    space: { value: null, outOfGamut: false },
    perceptual: { value: null, outOfGamut: false }
  };

  try {
    // Space/clamped variant
    let outOfGamutSpace = false;
    if (sourceSpaceId !== targetSpaceId) {
      outOfGamutSpace = !colorObj.inGamut(targetSpaceId, { epsilon: 1e-5 });
    }
    const spaceConverted = colorObj.to(targetSpaceId);
    let spaceValue = spaceConverted.toString({ format: format, precision: 3 });
    if (format === 'oklch' && spaceValue.includes('none')) {
      spaceValue = spaceValue.replace(/oklch\(([^ ]+) ([^ ]+) none\)/, 'oklch($1 $2 0)');
    } else if (format === 'hsl' && spaceValue.includes('none')) {
      spaceValue = spaceValue.replace(/hsl\(none ([^ ]+) ([^ ]+)\)/, 'hsl(0 $1 $2)');
    }
    if (outOfGamutSpace) spaceValue = `${spaceValue} (out of gamut — clamped)`;
    result.space.value = spaceValue;
    result.space.outOfGamut = outOfGamutSpace;

    // Perceptual variant
    let outOfGamutPerceptual = false;
    if (sourceSpaceId !== targetSpaceId) {
      outOfGamutPerceptual = !colorObj.inGamut(targetSpaceId, { epsilon: 1e-5 });
    }

    // If already in-gamut, perceptual == space
    let perceptualColor;
    if (!outOfGamutPerceptual) {
      perceptualColor = spaceConverted;
    } else {
      perceptualColor = nearestGamutOKLCH(colorObj, targetSpaceId);
    }

    let perceptualValue = perceptualColor.toString({ format: format, precision: 3 });
    if (format === 'oklch' && perceptualValue.includes('none')) {
      perceptualValue = perceptualValue.replace(/oklch\(([^ ]+) ([^ ]+) none\)/, 'oklch($1 $2 0)');
    } else if (format === 'hsl' && perceptualValue.includes('none')) {
      perceptualValue = perceptualValue.replace(/hsl\(none ([^ ]+) ([^ ]+)\)/, 'hsl(0 $1 $2)');
    }
    if (outOfGamutPerceptual) perceptualValue = `${perceptualValue} (out of gamut — perceptual OKLCH)`;
    result.perceptual.value = perceptualValue;
    result.perceptual.outOfGamut = outOfGamutPerceptual;

    return result;
  } catch (e) {
    console.error('formatColorVariants error:', e);
    return null;
  }
};

// Keep the old function for backward compatibility (clamped behavior)
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
    let outOfGamut = false;
    if (sourceSpaceId !== targetSpaceId) {
      if (!colorObj.inGamut(targetSpaceId, { epsilon: 1e-5 })) {
        outOfGamut = true;
      }
    }

    // 3. Convert the color object to the correct target space.
    // Attempt the conversion regardless of in-gamut checks. Many color libs
    // will yield a clamped/closest representation when serializing; we'll
    // annotate the output when we detected an out-of-gamut case above.
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

    // Append an explicit note for out-of-gamut cases so the UI (and clipboard)
    // clearly communicate that this is an approximation.
    if (outOfGamut) {
      result = `${result} (out of gamut — closest approximation)`;
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
