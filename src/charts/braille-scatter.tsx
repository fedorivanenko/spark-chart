"use client";

import { gridToBraille } from "../core/braille";
import { createGrid, drawPoint } from "../core/raster";
import type { ChartDatum } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";
import { type BasePlotProps, resolvePoints } from "./plot-utils";

export type BrailleScatterProps<TDatum extends ChartDatum> =
	BasePlotProps<TDatum>;

export function BrailleScatter<TDatum extends ChartDatum>({
	data,
	x,
	y,
	color,
	includeZero = false,
	label,
	className,
	style,
	...props
}: BrailleScatterProps<TDatum>) {
	const context = useChartContext<TDatum>();
	const chartData = data ?? context.data;
	const grid = createGrid(context.columns, context.rows);
	const { points } = resolvePoints({
		columns: context.columns,
		data: chartData,
		includeZero,
		rows: context.rows,
		x,
		xDomain: context.xDomain,
		y,
		yDomain: context.yDomain,
	});

	for (const point of points) {
		drawPoint(grid, point);
	}

	return (
		<pre
			aria-label={label}
			className={cn("braille-chart__layer", className)}
			role="img"
			style={{ color, ...style }}
			{...props}
		>
			{gridToBraille(grid)}
		</pre>
	);
}
