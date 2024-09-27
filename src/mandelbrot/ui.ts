import {Pane} from "tweakpane";
import Mandelbrot from "./Mandelbrot.ts";


const pane = new Pane();

const ui = (mandelbrot: Mandelbrot) => {
  const canvasFolder = pane.addFolder({
    title: 'Canvas',
    expanded: true,
  });

  canvasFolder.addBinding(mandelbrot, 'size', {min: 256, max: 2048, step: 256});
  canvasFolder.addBinding(mandelbrot, 'canvasZoom', {min: 1, max: 8, step: 1});

  const mandelbrotFolder = pane.addFolder({
    title: 'Mandelbrot',
    expanded: true,
  });

  mandelbrotFolder.addBinding(
    mandelbrot, 'paletteIndex',
    {
      options: {
        Monochrome: 0,
        Rainbow: 1,
        DoubleRainbow: 2,
        UltraRainbow: 3,
        Fire: 4,
        Sine: 5,
        GrayTwist: 6,
        Smooth: 7,
        Neon: 8,
        Neon2: 9,
        Neon3: 10,
        Snowball: 11,
        Test: 12,
      },
      label: 'Palette'
    }
  );
  mandelbrotFolder.addBinding(mandelbrot, 'paletteInvert', {label: 'Invert'})
  mandelbrotFolder.addBinding(mandelbrot, 'maxIter', {label: 'Iterations', min: 2, max: 10000, step: 1})

  const infoFolder = pane.addFolder({
    title: 'Info',
    expanded: true,
  });

  infoFolder.addBinding(mandelbrot, 'centerX', {
    readonly: true,
    format: (v) => v.toFixed(16),
  });

  infoFolder.addBinding(mandelbrot, 'centerY', {
    readonly: true,
    format: (v) => v.toFixed(16),
  });

  infoFolder.addBinding(mandelbrot, 'zoom', {
    readonly: true,
  });


  infoFolder.addBinding(mandelbrot, 'numWorkers', {
    readonly: true,
    label: 'Workers',
    format: (v) => v.toFixed(0),
  });


  const actionFolder = pane.addFolder({
    title: 'Actions',
    expanded: true,
  });

  const saveBtn = actionFolder.addButton({title: 'Save Image'});

  saveBtn.on('click', () => {
    mandelbrot.save();
  });
}

export default ui;


