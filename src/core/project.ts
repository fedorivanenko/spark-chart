import type { Projector, WorldFunction, WorldPoint } from "./shapes";
import type { DomainValue, PlotPoint } from "./types";

export function projectPolyline(
	points: WorldPoint[],
	projector: Projector,
): PlotPoint[] {
	return points.map((point) => projector.projectPoint(point));
}

export function sampleFunction(
	shape: WorldFunction,
	dotColumns: number,
): WorldPoint[] {
	const [minX, maxX] = shape.xDomain;
	const samples =
		shape.samples === "screen" || shape.samples === undefined
			? dotColumns
			: shape.samples;
	const count = Math.max(samples, 2);

	return Array.from({ length: count }, (_, index) => {
		const ratio = index / (count - 1);
		const x = minX + ratio * (maxX - minX);

		return { x, y: shape.y(x) };
	});
}

export function toWorldPoint(x: DomainValue, y: number): WorldPoint {
	return { x, y };
}
