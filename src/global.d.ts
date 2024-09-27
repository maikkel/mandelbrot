declare module '*/mandelbrotWorker.ts' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}

declare module '*/mandelbrotWorkerBig.ts' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}