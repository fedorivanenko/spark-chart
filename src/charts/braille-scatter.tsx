"use client";

import type * as React from "react";
import { gridToBraille } from "../core/braille";
import { createGrid, drawPoint } from "../core/raster";
import type { ChartDatum } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";
import { resolveSeries, resolveSeriesPoints } from "./plot-utils";

export type BrailleScatterProps = React.HTMLAttributes<HTMLPreElement> & {
	series: string;
	color?: string;
	label?: string;
};

export function BrailleScatter({
	series: seriesId,
	color,
	label,
	className,
	style,
	...props
}: BrailleScatterProps) {
	const context = useChartContext<ChartDatum>();
	const series = resolveSeries(context, seriesId);
	const grid = createGrid(context.columns, context.rows);
	const { points } = resolveSeriesPoints(context, seriesId);

	for (const point of points) {
		drawPoint(grid, point);
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
