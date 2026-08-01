export interface TraceStroke {
  path: string;
  checkpoints: number[];
}

export interface TraceLetter {
  letter: string;
  hint: string;
  hint2?: string[];
  strokes: TraceStroke[];
}

export type Point = {
  x: number;
  y: number;
};

export type Bounds = {
  width: number;
  height: number;
};

export type NearestPathPoint = Point & {
  distance: number;
  length: number;
};

