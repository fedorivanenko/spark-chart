"use client";

import type * as React from "react";
import { renderFunctionLayer } from "../core/render";
import type { ContinuousDomain } from "../core/types";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";

export type BrailleFunctionProps = React.HTMLAttributes<HTMLPreElement> & {
	color?: string;
	label?: string;
	samples?: number | "screen";
	xDomain?: ContinuousDomain;
	y: (x: number) => number;
	yDomain?: ContinuousDomain;
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

	return (
		<pre
			aria-label={label}
			className={cn("braille-chart__layer", className)}
			role="img"
			style={{ color, ...style }}
			{...props}
		>
			{renderFunctionLayer(context, {
				kind: "function",
				samples,
				xDomain,
				y,
				yDomain,
			})}
		</pre>
	);
}
