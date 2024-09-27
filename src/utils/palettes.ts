import {Colors, hslToRgb, PaletteFunc} from "./color.ts";

const palettes: Array<PaletteFunc> = [
  // Monochrome
  (iteration: number, maxIter: number) => {
    if (iteration === maxIter) {
      return Colors.black;
    }
    const color = (iteration / maxIter) * 255;
    return [color, color, color];  // Grayscale
  },
  // Rainbow
  (iteration: number, maxIter: number) => {
    const hue = (iteration / maxIter) * 360; // Full spectrum
    const saturation = 100;  // Full saturation
    const lightness = iteration < maxIter ? 50 : 0; // Lightness varies (0 means it's inside the set, black)
    return hslToRgb(hue, saturation, lightness);
  },
  // Double Rainbow
  (iteration: number, maxIter: number) => {
    const hue = (iteration / maxIter) * 720;
    const saturation = 100;
    const lightness = iteration < maxIter ? 50 : 0;
    return hslToRgb(hue, saturation, lightness);
  },
  //Ultra Rainbow
  (iteration: number, maxIter: number) => {
    const hue = (iteration / maxIter) * 3600;
    const saturation = 100;
    const lightness = iteration < maxIter ? 50 : 0;
    return hslToRgb(hue, saturation, lightness);
  },
  // Fire
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    let r, g, b;
    if (iteration === maxIter) {
      // Points inside the set are black
      r = 0;
      g = 0;
      b = 0;
    } else if (t < 0.3) {
      // Black to dark red
      r = Math.floor(255 * (t / 0.3));
      g = 0;
      b = 0;
    } else if (t < 0.6) {
      // Dark red to orange
      r = 255;
      g = Math.floor(128 * ((t - 0.3) / 0.3));
      b = 0;
    } else if (t < 0.9) {
      // Orange to yellow
      r = 255;
      g = Math.floor(255 * ((t - 0.6) / 0.3));
      b = 0;
    } else {
      // Yellow to white
      r = 255;
      g = 255;
      b = Math.floor(255 * ((t - 0.9) / 0.1));
    }
    return [r, g, b];
  },
  // Sine
  (iteration: number, maxIter: number) => {
    if (iteration === maxIter) {
      return Colors.black;
    }
    const t = iteration / maxIter;
    const r = Math.floor(127.5 * (1 + Math.sin(3 * Math.PI * t)));  // Red oscillates
    const g = Math.floor(127.5 * (1 + Math.sin(5 * Math.PI * t)));  // Green oscillates
    const b = Math.floor(127.5 * (1 + Math.sin(7 * Math.PI * t)));  // Blue oscillates
    return [r, g, b];
  },
  // Gray Twist
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    const intensity = Math.floor(255 * Math.exp(-5 * (1 - t)));  // Exponentially decay brightness
    return [intensity, intensity, intensity];  // Grayscale
  },
  // Smooth
  (iteration: number, maxIter: number) => {
    const smoothIter = iteration + 1 - Math.log(Math.log2(Math.sqrt(iteration + 1)));
    const t = smoothIter / maxIter;
    const r = Math.floor(255 * Math.pow(t, 0.5));  // Red scales with sqrt
    const g = Math.floor(255 * Math.pow(t, 0.75)); // Green scales with 3/4 power
    const b = Math.floor(255 * Math.pow(t, 1));    // Blue scales linearly
    return [r, g, b];
  },
  // Neon
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    const r = Math.floor(255 * Math.sin(2 * Math.PI * t)); // Bright neon red
    const g = Math.floor(255 * Math.sin(4 * Math.PI * t)); // Bright neon green
    const b = Math.floor(255 * Math.sin(6 * Math.PI * t)); // Bright neon blue
    return [Math.abs(r), Math.abs(g), Math.abs(b)];
  },
  // Neon II
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    const r = Math.floor(255 * Math.abs(Math.sin(3 * Math.PI * t)));
    const g = Math.floor(255 * Math.abs(Math.sin(4 * Math.PI * t)));
    const b = Math.floor(255 * Math.abs(Math.sin(5 * Math.PI * t)));
    return [r, g, b];
  },
  // Neon III
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    const r = Math.floor(255 * Math.sin(3 * Math.PI * t)); // Oscillating red
    const g = Math.floor(255 * Math.sin(5 * Math.PI * t)); // Oscillating green
    const b = Math.floor(255 * Math.sin(7 * Math.PI * t)); // Oscillating blue
    return [Math.abs(r), Math.abs(g), Math.abs(b)];
  },
  // Snowball
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    const r = Math.floor(255 * (0.8 + 0.2 * t)); // Soft pinkish-red tones
    const g = Math.floor(255 * (0.8 + 0.1 * t)); // Soft green tones
    const b = Math.floor(255 * (0.9 + 0.1 * t)); // Soft blue tones
    return [r, g, b];
  },
  // Test
  (iteration: number, maxIter: number) => {
    const t = iteration / maxIter;
    const r = Math.floor(64 * t);        // Soft reddish hues
    const g = Math.floor(128 * t);       // Muted greens
    const b = Math.floor(255 * t);       // Bright icy blues dominate
    return [r, g, b];
  }
];

export default palettes;