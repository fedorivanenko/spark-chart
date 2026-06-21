"use client";

import type * as React from "react";
import {
	createTerminalFrame,
	renderBrailleChart,
	type TerminalChartLayer,
	type TerminalViewport,
} from "../core/render";
import type {
	BrailleResolution,
	ContinuousDomain,
	DomainValue,
} from "../core/types";
import { cn } from "../lib/utils";
import { ChartProvider } from "./chart-context";

export type BrailleViewport = TerminalViewport;

export type BrailleChartProps = React.HTMLAttributes<HTMLDivElement> & {
	columns?: number;
	resolution?: Partial<BrailleResolution>;
	rows?: number;
	viewport?: BrailleViewport;
	xDomain?: DomainValue[] | ContinuousDomain;
	yDomain?: ContinuousDomain;
	layers?: TerminalChartLayer[];
};

export function BrailleChart({
	columns,
	rows,
	resolution,
	viewport,
	xDomain,
	yDomain,
	layers,
	className,
	children,
	...props
}: BrailleChartProps) {
	const frame = createTerminalFrame({
		columns,
		resolution,
		rows,
		viewport,
		xDomain,
		yDomain,
	});

	return (
		<ChartProvider value={frame}>
			<div className={cn("braille-chart", className)} {...props}>
				<div
					className="braille-chart__plot"
					style={{ minHeight: `${frame.rows}lh` }}
				>
					{layers ? (
						<pre className="braille-chart__layer">
							{renderBrailleChart({
								columns,
								layers,
								resolution,
								rows,
								viewport,
								xDomain,
								yDomain,
							})}
						</pre>
					) : (
						children
					)}
				</div>
			</div>
		</ChartProvider>
	);
}
