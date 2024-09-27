import {Color} from "./color.ts";


export default class CanvasDraw {
  private ctx?: CanvasRenderingContext2D | null;
  private imageData?: ImageData;
  private pixelData?: Uint8ClampedArray;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  begin() {
    this.imageData = this.ctx?.createImageData(this.width, this.height);
    this.pixelData = this.imageData?.data;
  }

  commit() {
    this.imageData && (this.ctx?.putImageData(this.imageData, 0, 0));
  }

  each(callback: (i: number) => void) {
    if (this.pixelData) {
      for (let i = 0; i < this.pixelData.length / 4; i++) {
        callback(i);
      }
    }
  }

  eachXY(callback: (x: number, y: number) => void) {
    if (this.pixelData) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(x, y);
        }
      }
    }
  }

  setPixel(i: number, color: Color) {
    if (this.pixelData) {
      const pos = i * 4
      this.pixelData[pos] = color[0];     // red
      this.pixelData[pos + 1] = color[1]; // green
      this.pixelData[pos + 2] = color[2]; // blue
      this.pixelData[pos + 3] = color[3] || 255; // alpha
    }
  }

  setPixelXY(x: number, y: number, color: Color) {
    const pos = (y * this.width) + x;
    this.setPixel(pos, color);
  }
}