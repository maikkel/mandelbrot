# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server with hot reload
yarn build      # production build (TypeScript compile + Vite bundle)
yarn preview    # serve the production build locally
```

No test framework is configured.

## Architecture

This is a browser-based Mandelbrot set visualizer built with TypeScript and Vite.

**Rendering pipeline:** The main thread (`Mandelbrot.ts`) divides the canvas into horizontal strips and distributes them across N persistent Web Workers (`mandelbrotWorker.ts`, one per `navigator.hardwareConcurrency` core). Each worker computes pixel colors via the escape-time algorithm and returns a `Uint8ClampedArray`; the main thread assembles results with `putImageData()`. A `rendering` flag prevents overlapping render calls while workers are active.

**State management:** `Mandelbrot.ts` owns all view state (`zoom`, `centerX`, `centerY`, `maxIter`, `paletteIndex`, `paletteInvert`, `size`). Private fields use `#` prefix; setters trigger a re-render. Mouse wheel zoom recalculates `centerX`/`centerY` so the cursor stays fixed under the pointer.

**Color system:** `color.ts` defines the `Color` (RGBA tuple) and `PaletteFunc` (iteration count → color) types. `palettes.ts` exports 13 named palette functions. The active palette is selected by index and optionally inverted before being passed to workers.

**UI:** `ui.ts` wires Tweakpane v4 panels to `Mandelbrot` properties. The Info folder displays read-only center coordinates and zoom level; the Actions folder has a PNG export button.

**Entry point:** `src/index.ts` creates the canvas, instantiates `Mandelbrot`, and calls `ui.ts`.

**`decimal.js-light`** is listed as a dependency but is not currently used — it was tried for deep-zoom precision but was unusably slow. The planned approach is a renderer-switcher architecture with a second GPU-based renderer (WebGL/WebGPU) for deep zoom.
