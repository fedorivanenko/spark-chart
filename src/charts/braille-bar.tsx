"use client";

import { gridToBraille } from "../core/braille";
import { createGrid, drawVerticalBar } from "../core/raster";
import type { ChartDatum } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";
import { type BasePlotProps, resolvePoints } from "./plot-utils";

export type BrailleBarProps<TDatum extends ChartDatum> =
	BasePlotProps<TDatum> & {
		barWidth?: number;
	};

export function BrailleBar<TDatum extends ChartDatum>({
	barWidth = 1,
	data,
	x,
	y,
	color,
	includeZero = true,
	label,
	className,
	style,
	...props
}: BrailleBarProps<TDatum>) {
	const context = useChartContext<TDatum>();
	const chartData = data ?? context.data;
	const grid = createGrid(context.columns, context.rows);
	const { baseline, points } = resolvePoints({
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
		drawVerticalBar(grid, point.x, point.y, baseline, barWidth);
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
