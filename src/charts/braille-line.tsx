"use client";

import { gridToBraille } from "../core/braille";
import { createGrid, drawPolyline } from "../core/raster";
import type { ChartDatum } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";
import { type BasePlotProps, resolvePoints } from "./plot-utils";

export type BrailleLineProps<TDatum extends ChartDatum> = BasePlotProps<TDatum>;

export function BrailleLine<TDatum extends ChartDatum>({
	data,
	x,
	y,
	color,
	includeZero = false,
	label,
	className,
	style,
	...props
}: BrailleLineProps<TDatum>) {
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

	drawPolyline(grid, points);

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
