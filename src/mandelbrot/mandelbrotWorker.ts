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
  }
}

self.onmessage = function (e: DrawData) {
  const {width, height, zoom, centerX, centerY, startY, endY, paletteIndex, maxIter = 500, invert = false} = e.data;
  const imageData = new Uint8ClampedArray(width * (endY - startY) * 4);

  const zoomFactor = 1 / zoom;

  // Precompute range for x and y coordinates
  const xRange = (1.75 * 2) * zoomFactor;
  const yRange = (1.75 * 2) * zoomFactor;

  const xMin = centerX - 1.75 * zoomFactor;
  const yMin = centerY - 1.75 * zoomFactor;

  // Access the palette function only once, outside the loop
  const palette = palettes[paletteIndex];

  // Reduce function call overhead and repeated calculations in the loops
  for (let py = startY; py < endY; py++) {
    const y0 = yMin + yRange * (py / height);

    for (let px = 0; px < width; px++) {
      const x0 = xMin + xRange * (px / width);

      let x = 0;
      let y = 0;
      let iteration = 0;

      let xSquare = 0;
      let ySquare = 0;

      // Mandelbrot iteration loop
      while (xSquare + ySquare <= 4 && iteration < maxIter) {
        y = 2 * x * y + y0;
        x = xSquare - ySquare + x0;

        xSquare = x * x;
        ySquare = y * y;

        iteration++;
      }

      const color: Color = palette(iteration, maxIter);

      // Use the palette function to get the RGB values
      const [r, g, b] = invert ? invertColor(color) : color;

      // Calculate pixel index once
      const pixelIndex = (px + (py - startY) * width) * 4;

      // Store the pixel data (you can remove the color multiplier if not needed)
      imageData[pixelIndex] = r;       // Red
      imageData[pixelIndex + 1] = g;   // Green
      imageData[pixelIndex + 2] = b;   // Blue
      imageData[pixelIndex + 3] = 255; // Alpha (opaque)
    }
  }

  // Send the computed image data back to the main thread
  self.postMessage({imageData, startY, endY});
};