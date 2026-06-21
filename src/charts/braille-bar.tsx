"use client";

import type * as React from "react";
import { gridToBraille } from "../core/braille";
import { createGrid, drawVerticalBar } from "../core/raster";
import type { ChartDatum } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";
import { resolveSeries, resolveSeriesPoints } from "./plot-utils";

export type BrailleBarProps = React.HTMLAttributes<HTMLPreElement> & {
	series: string;
	barWidth?: number;
	color?: string;
	label?: string;
};

export function BrailleBar({
	series: seriesId,
	barWidth = 1,
	color,
	label,
	className,
	style,
	...props
}: BrailleBarProps) {
	const context = useChartContext<ChartDatum>();
	const series = resolveSeries(context, seriesId);
	const grid = createGrid(context.columns, context.rows);
	const { baseline, points } = resolveSeriesPoints(context, seriesId);

	for (const point of points) {
		drawVerticalBar(grid, point.x, point.y, baseline, barWidth);
	}

	return (
		<pre
			aria-label={
				label ??
				series.ariaLabel ??
				(typeof series.label === "string" ? series.label : series.id)
			}
			className={cn("braille-chart__layer", className)}
			role="img"
			style={{ color: color ?? series.color, ...style }}
			{...props}
		>
			{gridToBraille(grid)}
		</pre>
	);
}
