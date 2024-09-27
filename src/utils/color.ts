export type Color = [number, number, number, number?];
export type PaletteFunc = (iteration: number, maxIter: number) => Color;

export const Colors: Record<string, Color> = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  cyan: [0, 255, 255],
  yellow: [255, 255, 0],
  magenta: [255, 0, 255],
}

export function invertColor(color: Color): Color {
  return [255 - color[0], 255 - color[1], 255 - color[2]];
}

export function hslToRgb(h: number, s: number, l: number): Color {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));


  return [
    Math.round(255 * f(0)), // Red
    Math.round(255 * f(8)), // Green
    Math.round(255 * f(4))  // Blue
  ];
}

