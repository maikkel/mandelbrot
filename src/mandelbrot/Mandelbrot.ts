class Mandelbrot {
  canvas: HTMLCanvasElement | undefined;
  ctx: CanvasRenderingContext2D | null;

  isDragging = false;
  startX: number = 0;
  startY: number = 0;
  zoom = 1;
  zoomFactor = 1.2;
  centerX = -0.5;
  centerY = 0.0;
  rendering = false;
  workersDone = 0;
  workers: Array<Worker> = [];
  numWorkers = window.navigator.hardwareConcurrency;

  #maxIter = 1000;
  get maxIter(): number {
    return this.#maxIter;
  }

  set maxIter(value: number) {
    this.#maxIter = value;
    this.mandelbrot();
  }


  #size = 1024;
  get size() {
    return this.#size
  }

  set size(value: number) {
    this.#size = value
    this.resize();
    this.resizeCanvas();
    this.setup();
    this.mandelbrot();
  }

  #canvasZoom = 1;
  get canvasZoom() {
    return this.#canvasZoom;
  }

  set canvasZoom(value: number) {
    this.#canvasZoom = value;
    this.resizeCanvas();
  }

  #paletteIndex = 5;
  get paletteIndex() {
    return this.#paletteIndex;
  }

  set paletteIndex(value: number) {
    this.#paletteIndex = value;
    this.mandelbrot();
  }

  #paletteInvert = false;
  get paletteInvert() {
    return this.#paletteInvert;
  }

  set paletteInvert(value) {
    console.log('inv', value)
    this.#paletteInvert = value;
    this.mandelbrot();
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx!.imageSmoothingEnabled = false;

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();

      const mouseX = e.offsetX / this.canvasZoom;
      const mouseY = e.offsetY / this.canvasZoom;

      const xMouse = this.centerX + (mouseX / this.size) * (3.5 / this.zoom) - (1.75 / this.zoom);
      const yMouse = this.centerY + (mouseY / this.size) * (3.5 / this.zoom) - (1.75 / this.zoom);

      const oldZoom = this.zoom; // Store the old zoom value

      if (e.deltaY < 0) {
        // Zoom in
        this.zoom *= this.zoomFactor;
      } else {
        // Zoom out
        this.zoom /= this.zoomFactor;
      }

      const zoomRatio = oldZoom / this.zoom;
      this.centerX = xMouse - (xMouse - this.centerX) * zoomRatio;
      this.centerY = yMouse - (yMouse - this.centerY) * zoomRatio;

      this.mandelbrot();
    })

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });

    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.offsetX / this.canvasZoom;
      this.startY = e.offsetY / this.canvasZoom;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.offsetX / this.canvasZoom - this.startX;
        const deltaY = e.offsetY / this.canvasZoom - this.startY;

        this.centerX -= (deltaX / this.size) * (3.5 / this.zoom);
        this.centerY -= (deltaY / this.size) * (3.5 / this.zoom);

        this.mandelbrot();

        this.startX = e.offsetX / this.canvasZoom;
        this.startY = e.offsetY / this.canvasZoom;
      }
    });

    this.resize();
    this.resizeCanvas();
    this.setup();
    this.mandelbrot();
  }


  setup() {
    this.rendering = false;
    this.workers.forEach((worker) => {
      worker.terminate();
    })

    for (let i = 0; i < this.numWorkers; i++) {
      this.workers[i] = new Worker(new URL('./mandelbrotWorker.ts', import.meta.url), {type: 'module'});
    }

    this.workers.forEach((worker) => {
      worker.onmessage = (e: MessageEvent) => {
        const {imageData, startY, endY} = e.data;
        const image = new ImageData(new Uint8ClampedArray(imageData), this.size, endY - startY);

        // Draw the section returned by the worker
        this.ctx!.putImageData(image, 0, startY);

        this.workersDone++;

        if (this.workersDone >= this.numWorkers) {
          this.workersDone = 0;
          this.rendering = false;
          // console.timeEnd('mandelbrot')
        }
      };
    });
  }

  resize() {
    this.canvas!.width = this.size;
    this.canvas!.height = this.size;
  }

  resizeCanvas() {
    this.canvas!.style.width = this.canvasZoom * this.size + 'px';
    this.canvas!.style.height = this.canvasZoom * this.size + 'px';
  }

  mandelbrot() {
    if (!this.rendering) {
      this.rendering = true;
      // console.time('mandelbrot')
      const rowsPerWorker = Math.ceil(this.size / this.numWorkers);
      this.workers.forEach((worker, index) => {
        const startY = index * rowsPerWorker;
        const endY = Math.min(startY + rowsPerWorker, this.size);
        worker.postMessage({
          width: this.size,
          height: this.size,
          zoom: this.zoom,
          centerX: this.centerX,
          centerY: this.centerY,
          startY,
          endY,
          paletteIndex: this.paletteIndex,
          maxIter: this.maxIter,
          invert: this.paletteInvert,
        });
      })
    }
  }

  save() {
    const image = this.canvas!.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    const anchor = document.createElement('a');
    anchor.setAttribute('download', 'mandelbrot.png');
    anchor.setAttribute('href', image);
    anchor.click();
  }
}


export default Mandelbrot;