"use client";

import type * as React from "react";
import { renderRulerLayer, type TerminalRulerLayer } from "../core/render";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";

export type BrailleRulerEdge = NonNullable<TerminalRulerLayer["edge"]>;

export type BrailleRulerProps = React.HTMLAttributes<HTMLPreElement> &
	Omit<TerminalRulerLayer, "kind">;

function transformForEdge({
	edge,
	labelWidth,
	rows,
}: {
	edge: BrailleRulerEdge;
	labelWidth: number;
	rows: number;
}): string {
	if (edge === "bottom") {
		return `translateY(${rows}lh)`;
	}

	if (edge === "top") {
		return "translateY(-2lh)";
	}

	if (edge === "left") {
		return `translateX(-${labelWidth + 2}ch)`;
	}

	return "translateX(100%)";
}

export function BrailleRuler({
	axis,
	edge,
	every,
	format,
	label,
	labelWidth = 9,
	precision,
	showLine,
	showTicks,
	className,
	style,
	...props
}: BrailleRulerProps) {
	const context = useChartContext();
	const resolvedEdge = edge ?? (axis === "x" ? "bottom" : "left");

	return (
		<pre
			aria-hidden="true"
			className={cn("braille-chart__layer", "braille-chart__ruler", className)}
			style={{
				transform: transformForEdge({
					edge: resolvedEdge,
					labelWidth,
					rows: context.rows,
				}),
				...style,
			}}
			{...props}
		>
			{renderRulerLayer(context, {
				axis,
				edge,
				every,
				format,
				kind: "ruler",
				label,
				labelWidth,
				precision,
				showLine,
				showTicks,
			})}
		</pre>
	);
}
