"use client";

import type * as React from "react";
import { gridToBraille } from "../core/braille";
import {
	createGrid,
	drawHorizontalLine,
	drawVerticalLine,
} from "../core/raster";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";

export type BrailleGridProps = React.HTMLAttributes<HTMLPreElement> & {
	color?: string;
	xTicks?: number;
	yTicks?: number;
};

export function BrailleGrid({
	color = "hsl(var(--braille-chart-grid))",
	xTicks = 5,
	yTicks = 5,
	className,
	style,
	...props
}: BrailleGridProps) {
	const context = useChartContext();
	const grid = createGrid(context.columns, context.rows);
	const maxX = Math.max(context.columns * 2 - 1, 0);
	const maxY = Math.max(context.rows * 4 - 1, 0);

	if (context.xScale && context.xTicks.length > 0) {
		for (const tick of context.xTicks) {
			drawVerticalLine(grid, Math.round(context.xScale(tick.value)));
		}
	} else {
		for (let index = 0; index < xTicks; index += 1) {
			drawVerticalLine(
				grid,
				Math.round((maxX * index) / Math.max(xTicks - 1, 1)),
			);
		}
	}

	if (context.yScale && context.yTicks.length > 0) {
		for (const tick of context.yTicks) {
			drawHorizontalLine(grid, Math.round(context.yScale(Number(tick.value))));
		}
	} else {
		for (let index = 0; index < yTicks; index += 1) {
			drawHorizontalLine(
				grid,
				Math.round((maxY * index) / Math.max(yTicks - 1, 1)),
			);
		}
	}

	return (
		<pre
			aria-hidden="true"
			className={cn("braille-chart__layer", "braille-chart__grid", className)}
			style={{ color, ...style }}
			{...props}
		>
			{gridToBraille(grid)}
		</pre>
	);
}
