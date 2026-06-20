import type * as React from "react";
import { readDomainValue, readNumber } from "../core/accessors";
import { gridToBraille } from "../core/braille";
import {
	categoryDomain,
	continuousDomain,
	isContinuousDomain,
	numberDomain,
	toNumber,
} from "../core/domain";
import { projectPolyline, toWorldPoint } from "../core/project";
import { createGrid } from "../core/raster";
import { linearScale, pointScale } from "../core/scale";
import type { Projector, WorldPoint } from "../core/shapes";
import type {
	Accessor,
	ChartDatum,
	ContinuousDomain,
	DomainValue,
	NumberAccessor,
	PlotPoint,
} from "../core/types";

export type BasePlotProps<TDatum extends ChartDatum> =
	React.HTMLAttributes<HTMLPreElement> & {
		data?: TDatum[];
		x: Accessor<TDatum, DomainValue>;
		y: NumberAccessor<TDatum>;
		color?: string;
		includeZero?: boolean;
		label?: string;
	};

export function createProjector<TDatum extends ChartDatum>({
	columns,
	data,
	includeZero,
	rows,
	x,
	xDomain,
	y,
	yDomain,
}: {
	data: TDatum[];
	columns: number;
	rows: number;
	x: Accessor<TDatum, DomainValue>;
	y: NumberAccessor<TDatum>;
	includeZero: boolean;
	xDomain?: DomainValue[] | ContinuousDomain;
	yDomain?: ContinuousDomain;
}): { baseline: number; projector: Projector; worldPoints: WorldPoint[] } {
	const dotWidth = Math.max(columns * 2 - 1, 1);
	const dotHeight = Math.max(rows * 4 - 1, 1);
	const xValues = data.map((datum, index) => readDomainValue(datum, x, index));
	const resolvedXDomain =
		xDomain ??
		(isContinuousDomain(xValues)
			? continuousDomain(data, x)
			: categoryDomain(data, x));
	const resolvedYDomain = yDomain ?? numberDomain(data, y, { includeZero });
	const hasContinuousXDomain =
		resolvedXDomain.length === 2 && isContinuousDomain(resolvedXDomain);
	const xScale = hasContinuousXDomain
		? linearScale(
				[toNumber(resolvedXDomain[0]), toNumber(resolvedXDomain[1])],
				[0, dotWidth],
			)
		: pointScale(resolvedXDomain.map(String), [0, dotWidth]);
	const yScale = linearScale(resolvedYDomain, [dotHeight, 0]);
	const projector: Projector = {
		projectPoint: (point) => ({ x: xScale(point.x), y: yScale(point.y) }),
		projectY: (value) => yScale(value),
	};

	return {
		baseline: projector.projectY(0),
		projector,
		worldPoints: data.map((datum, index) =>
			toWorldPoint(
				readDomainValue(datum, x, index),
				readNumber(datum, y, index),
			),
		),
	};
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

export function resolvePoints<TDatum extends ChartDatum>(options: {
	data: TDatum[];
	columns: number;
	rows: number;
	x: Accessor<TDatum, DomainValue>;
	y: NumberAccessor<TDatum>;
	includeZero: boolean;
	xDomain?: DomainValue[] | ContinuousDomain;
	yDomain?: ContinuousDomain;
}): { points: PlotPoint[]; baseline: number } {
	const { baseline, projector, worldPoints } = createProjector(options);

	return { baseline, points: projectPolyline(worldPoints, projector) };
}

export function emptyBraille(columns: number, rows: number): string {
	return gridToBraille(createGrid(columns, rows));
}
