import {Color, invertColor} from "../utils/color.ts";
import palettes from "../utils/palettes.ts";

interface DrawData {
  data: {
    width: number;
    height: number;
    zoom: number;
    centerX: number;
    centerY: number;
    startY: number;
    endY: number;
    paletteIndex: number;
    maxIter?: number;
    invert?: boolean;
    refOrbitZr: Float64Array;
    refOrbitZi: Float64Array;
    refOrbitLength: number;
  }
}

self.onmessage = function (e: DrawData) {
  const {
    width, height, zoom, centerX, centerY, startY, endY,
    paletteIndex, maxIter = 500, invert = false,
    refOrbitZr, refOrbitZi, refOrbitLength,
  } = e.data;

  const imageData = new Uint8ClampedArray(width * (endY - startY) * 4);
  const zoomFactor = 1 / zoom;
  const xRange = 3.5 * zoomFactor;
  const yRange = 3.5 * zoomFactor;
  const xMin = centerX - 1.75 * zoomFactor;
  const yMin = centerY - 1.75 * zoomFactor;
  const palette = palettes[paletteIndex];
  const usePerturbation = refOrbitZr != null && refOrbitLength > 1;

  for (let py = startY; py < endY; py++) {
    const y0 = yMin + yRange * (py / height);

    for (let px = 0; px < width; px++) {
      const x0 = xMin + xRange * (px / width);

      const iteration = usePerturbation
        ? perturbationIterate(x0, y0, centerX, centerY, refOrbitZr, refOrbitZi, refOrbitLength, maxIter)
        : standardIterate(x0, y0, maxIter);

      const color: Color = palette(iteration, maxIter);
      const [r, g, b] = invert ? invertColor(color) : color;
      const pixelIndex = (px + (py - startY) * width) * 4;

      imageData[pixelIndex]     = r;
      imageData[pixelIndex + 1] = g;
      imageData[pixelIndex + 2] = b;
      imageData[pixelIndex + 3] = 255;
    }
  }

  self.postMessage({imageData, startY, endY});
};

function standardIterate(x0: number, y0: number, maxIter: number): number {
  let x = 0, y = 0, xSq = 0, ySq = 0, iteration = 0;
  while (xSq + ySq <= 4 && iteration < maxIter) {
    y = 2 * x * y + y0;
    x = xSq - ySq + x0;
    xSq = x * x;
    ySq = y * y;
    iteration++;
  }
  return iteration;
}

function perturbationIterate(
  x0: number, y0: number,
  centerX: number, centerY: number,
  Zr: Float64Array, Zi: Float64Array,
  refLength: number, maxIter: number
): number {
  // ε = offset of this pixel from the reference center in the complex plane
  const er = x0 - centerX;
  const ei = y0 - centerY;

  // δ_n: perturbation from the reference orbit, starting at 0
  let dr = 0, di = 0;

  for (let n = 0; n < refLength - 1; n++) {
    // δ_{n+1} = 2·Z_n·δ_n + δ_n² + ε
    const newDr = 2 * (Zr[n] * dr - Zi[n] * di) + (dr * dr - di * di) + er;
    const newDi = 2 * (Zr[n] * di + Zi[n] * dr) + 2 * dr * di + ei;
    dr = newDr;
    di = newDi;

    // Glitch detection: if |δ| grows larger than |Z|, the approximation breaks down.
    // Fall back to standard iteration for this pixel.
    if (dr * dr + di * di > Zr[n + 1] * Zr[n + 1] + Zi[n + 1] * Zi[n + 1]) {
      return standardIterate(x0, y0, maxIter);
    }

    // Full iterate z_{n+1} = Z_{n+1} + δ_{n+1}
    const zr = Zr[n + 1] + dr;
    const zi = Zi[n + 1] + di;

    if (zr * zr + zi * zi > 4) {
      return n + 1;
    }
  }

  // Reference orbit exhausted before pixel escaped.
  // If the reference itself escaped early (center outside the set), fall back.
  if (refLength < maxIter) {
    return standardIterate(x0, y0, maxIter);
  }

  return maxIter;
}
