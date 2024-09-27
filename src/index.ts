import './style.css'
import ui from "./mandelbrot/ui.ts";
import Mandelbrot from "./mandelbrot/Mandelbrot.ts";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const mandelbrot = new Mandelbrot(canvas);

ui(mandelbrot);

