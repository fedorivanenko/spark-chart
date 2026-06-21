"use client";

import type * as React from "react";
import { renderPolygonLayer } from "../core/render";
import type { DataKey, DomainValue } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";

export type BraillePolygonProps<TDatum = { x: DomainValue; y: number }> =
	React.HTMLAttributes<HTMLPreElement> & {
		data: TDatum[];
		x?: DataKey<TDatum, DomainValue>;
		y?: DataKey<TDatum, number>;
		fill?: boolean;
		stroke?: boolean;
		color?: string;
		label?: string;
	};

export function BraillePolygon<TDatum = { x: DomainValue; y: number }>({
	data,
	x,
	y,
	fill = true,
	stroke = true,
	color,
	label,
	className,
	style,
	...props
}: BraillePolygonProps<TDatum>) {
	const context = useChartContext();

	return (
		<pre
			aria-label={label}
			className={cn("braille-chart__layer", className)}
			role="img"
			style={{ color, ...style }}
			{...props}
		>
			{renderPolygonLayer(context, {
				data,
				fill,
				kind: "polygon",
				stroke,
				x,
				y,
			})}
		</pre>
	);
}
