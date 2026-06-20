"use client";

import type * as React from "react";
import { gridToBraille } from "../core/braille";
import { projectPolyline, sampleFunction } from "../core/project";
import { createGrid, drawPolyline } from "../core/raster";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";
import { createDomainProjector } from "./plot-utils";

export type BrailleFunctionProps = React.HTMLAttributes<HTMLPreElement> & {
	color?: string;
	label?: string;
	samples?: number | "screen";
	xDomain?: [number, number];
	y: (x: number) => number;
	yDomain?: [number, number];
};

export function BrailleFunction({
	color,
	label,
	samples = "screen",
	xDomain,
	y,
	yDomain,
	className,
	style,
	...props
}: BrailleFunctionProps) {
	const context = useChartContext();
	const contextXDomain = context.xDomain;
	const resolvedXDomain =
		xDomain ??
		(contextXDomain?.length === 2 &&
		typeof contextXDomain[0] === "number" &&
		typeof contextXDomain[1] === "number"
			? ([contextXDomain[0], contextXDomain[1]] as [number, number])
			: undefined);
	const resolvedYDomain = yDomain ?? context.yDomain ?? [-1, 1];

	if (!resolvedXDomain) {
		throw new Error(
			"BrailleFunction requires xDomain or BrailleChart viewport.x with numeric domain.",
		);
	}

	const grid = createGrid(context.columns, context.rows);
	const projector = createDomainProjector({
		columns: context.columns,
		rows: context.rows,
		xDomain: resolvedXDomain,
		yDomain: resolvedYDomain,
	});
	const worldPoints = sampleFunction(
		{ samples, xDomain: resolvedXDomain, y },
		Math.max(context.columns * 2, 2),
	);
	const points = projectPolyline(worldPoints, projector);

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
