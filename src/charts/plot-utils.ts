import { readDomainValue, readNumber } from "../core/accessors";
import { gridToBraille } from "../core/braille";
import { projectPolyline, toWorldPoint } from "../core/project";
import { createGrid } from "../core/raster";
import { linearScale } from "../core/scale";
import type { Projector, WorldPoint } from "../core/shapes";
import type { ChartDatum, ContinuousDomain, PlotPoint } from "../core/types";
import type { ChartContextValue } from "./chart-context";

export function resolveSeries<TDatum extends ChartDatum>(
	context: ChartContextValue<TDatum>,
	seriesId: string,
) {
	const series = context.series.find((item) => item.id === seriesId);

	if (!series) {
		throw new Error(`Unknown BrailleChart series: ${seriesId}`);
	}

	return series;
}

export function resolveSeriesPoints<TDatum extends ChartDatum>(
	context: ChartContextValue<TDatum>,
	seriesId: string,
): { points: PlotPoint[]; baseline: number } {
	const series = resolveSeries(context, seriesId);
	const xKey = series.xKey ?? context.xKey;

	if (!xKey) {
		throw new Error(
			`BrailleChart series "${seriesId}" requires xKey on the series or chart.`,
		);
	}

	if (!context.xScale || !context.yScale) {
		return { baseline: 0, points: [] };
	}

	const data = series.data ?? context.data;
	const worldPoints: WorldPoint[] = data.map((datum, index) =>
		toWorldPoint(
			readDomainValue(datum, xKey, index),
			readNumber(datum, series.dataKey, index),
		),
	);
	const points = projectPolyline(worldPoints, {
		projectPoint: (point) => ({
			x: context.xScale?.(point.x) ?? 0,
			y: context.yScale?.(point.y) ?? 0,
		}),
		projectY: (value) => context.yScale?.(value) ?? 0,
	});

	return { baseline: context.yScale(0), points };
}

export function createDomainProjector({
	columns,
	rows,
	xDomain,
	yDomain,
}: {
	columns: number;
	rows: number;
	xDomain: ContinuousDomain;
	yDomain: ContinuousDomain;
}): Projector {
	const dotWidth = Math.max(columns * 2 - 1, 1);
	const dotHeight = Math.max(rows * 4 - 1, 1);
	const xScale = linearScale(xDomain, [0, dotWidth]);
	const yScale = linearScale(yDomain, [dotHeight, 0]);

	return {
		projectPoint: (point) => ({ x: xScale(point.x), y: yScale(point.y) }),
		projectY: (value) => yScale(value),
	};
}

export function emptyBraille(columns: number, rows: number): string {
	return gridToBraille(createGrid(columns, rows));
}
