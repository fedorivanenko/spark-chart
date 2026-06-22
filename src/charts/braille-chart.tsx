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
import {
	useBrailleResolution,
	type UseBrailleResolutionOptions,
} from "./use-braille-resolution";

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

export type ResponsiveBrailleChartProps = Omit<
	BrailleChartProps,
	"columns" | "resolution" | "rows"
> &
	UseBrailleResolutionOptions & {
		containerClassName?: string;
		containerStyle?: React.CSSProperties;
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

export function ResponsiveBrailleChart({
	aspectRatio,
	initialResolution,
	maxColumns,
	maxRows,
	minColumns,
	minRows,
	observeHeight,
	containerClassName,
	containerStyle,
	...props
}: ResponsiveBrailleChartProps) {
	const { ref, resolution } = useBrailleResolution({
		aspectRatio,
		initialResolution,
		maxColumns,
		maxRows,
		minColumns,
		minRows,
		observeHeight,
	});

	return (
		<div
			className={cn("braille-chart-responsive", containerClassName)}
			ref={ref}
			style={containerStyle}
		>
			<BrailleChart {...props} resolution={resolution} />
		</div>
	);
}
