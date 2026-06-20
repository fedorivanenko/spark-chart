"use client";

import type * as React from "react";
import { readDomainValue } from "../core/accessors";
import {
	categoryDomain,
	continuousDomain,
	isContinuousDomain,
	numberDomain,
	toNumber,
} from "../core/domain";
import { linearScale, pointScale } from "../core/scale";
import { categoryTicks, numericTicks } from "../core/ticks";
import type {
	Accessor,
	ChartDatum,
	ContinuousDomain,
	DomainValue,
	NumberAccessor,
} from "../core/types";
import { cn } from "../lib/utils";
import { ChartProvider } from "./chart-context";

export type BrailleViewport = {
	x?: DomainValue[] | ContinuousDomain;
	y?: ContinuousDomain;
};

export type BrailleResolution = {
	columns: number;
	rows: number;
};

export type BrailleChartProps<TDatum extends ChartDatum> =
	React.HTMLAttributes<HTMLDivElement> & {
		data: TDatum[];
		columns?: number;
		includeZero?: boolean;
		resolution?: Partial<BrailleResolution>;
		rows?: number;
		viewport?: BrailleViewport;
		x?: Accessor<TDatum, DomainValue>;
		xDomain?: DomainValue[] | ContinuousDomain;
		xTickCount?: number;
		xTickPeriod?: number;
		y?: NumberAccessor<TDatum>;
		yDomain?: ContinuousDomain;
		yTickCount?: number;
		yTickPeriod?: number;
	};

export function BrailleChart<TDatum extends ChartDatum>({
	data,
	columns,
	rows,
	includeZero = false,
	resolution,
	viewport,
	x,
	xDomain,
	xTickCount = 5,
	xTickPeriod,
	y,
	yDomain,
	yTickCount = 5,
	yTickPeriod,
	className,
	children,
	...props
}: BrailleChartProps<TDatum>) {
	const resolvedColumns = resolution?.columns ?? columns ?? 60;
	const resolvedRows = resolution?.rows ?? rows ?? 16;
	const explicitXDomain = viewport?.x ?? xDomain;
	const explicitYDomain = viewport?.y ?? yDomain;
	const dotWidth = Math.max(resolvedColumns * 2 - 1, 1);
	const dotHeight = Math.max(resolvedRows * 4 - 1, 1);
	const xValues = x
		? data.map((datum, index) => readDomainValue(datum, x, index))
		: [];
	const resolvedXDomain =
		explicitXDomain ??
		(x
			? isContinuousDomain(xValues)
				? continuousDomain(data, x)
				: categoryDomain(data, x)
			: undefined);
	const resolvedYDomain =
		explicitYDomain ?? (y ? numberDomain(data, y, { includeZero }) : undefined);
	const hasContinuousXDomain =
		resolvedXDomain?.length === 2 && isContinuousDomain(resolvedXDomain);
	const xScale = resolvedXDomain
		? hasContinuousXDomain
			? linearScale(
					[toNumber(resolvedXDomain[0]), toNumber(resolvedXDomain[1])],
					[0, dotWidth],
				)
			: pointScale(resolvedXDomain.map(String), [0, dotWidth])
		: undefined;
	const yScale = resolvedYDomain
		? linearScale(resolvedYDomain, [dotHeight, 0])
		: undefined;
	const xTicks = resolvedXDomain
		? hasContinuousXDomain
			? numericTicks(
					[toNumber(resolvedXDomain[0]), toNumber(resolvedXDomain[1])],
					xTickCount,
					xTickPeriod,
				)
			: categoryTicks(resolvedXDomain.map(String), xTickCount, xTickPeriod)
		: [];
	const yTicks = resolvedYDomain
		? numericTicks(resolvedYDomain, yTickCount, yTickPeriod)
		: [];

	return (
		<ChartProvider
			value={{
				columns: resolvedColumns,
				data,
				rows: resolvedRows,
				xDomain: resolvedXDomain,
				xScale,
				xTicks,
				yDomain: resolvedYDomain,
				yScale,
				yTicks,
			}}
		>
			<div className={cn("braille-chart", className)} {...props}>
				<div
					className="braille-chart__plot"
					style={{ minHeight: `${resolvedRows}lh` }}
				>
					{children}
				</div>
			</div>
		</ChartProvider>
	);
}
