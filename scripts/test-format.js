#!/usr/bin/env node
import Color from 'colorjs.io';
import { formatColor } from '../src/utils.js';

// Small manual test runner to quickly validate out-of-gamut handling.
const cases = [
  {
    name: 'in-gamut -> sRGB (rgb)',
    color: new Color('rgb(120 150 200)'),
    format: 'rgb'
  },
  {
    name: 'likely out-of-gamut -> sRGB (hex)',
    // high chroma OKLCH likely outside of sRGB / hex gamut
    color: new Color('oklch(70% 0.6 260)'),
    format: 'hex'
  }
];

for (const c of cases) {
  const output = formatColor(c.color, c.format);
  const containsNote = output && output.toLowerCase().includes('out of gamut');
  console.log(`\nCase: ${c.name}`);
  console.log(`  input: ${c.color.toString()}`);
  console.log(`  format: ${c.format}`);
  console.log(`  output: ${output}`);
  console.log(`  has out-of-gamut note: ${containsNote}`);
}

// Exit code: 0 always — this is a small manual check.
