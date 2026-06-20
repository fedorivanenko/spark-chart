import type { DomainValue, PlotPoint } from "./types";

export type WorldPoint = {
	x: DomainValue;
	y: number;
};

export type WorldSegment = {
	from: WorldPoint;
	to: WorldPoint;
};

export type WorldPolyline = {
	points: WorldPoint[];
};

export type WorldFunction = {
	xDomain: [number, number];
	y: (x: number) => number;
	samples?: number | "screen";
};

export type Projector = {
	projectPoint: (point: WorldPoint) => PlotPoint;
	projectY: (y: number) => number;
};
