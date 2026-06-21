"use client";

import type * as React from "react";
import { readDomainValue, readNumber } from "../core/accessors";
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
	BrailleResolution,
	BrailleSeriesConfig,
	ChartDatum,
	ContinuousDomain,
	DataKey,
	DomainValue,
} from "../core/types";
import { cn } from "../lib/utils";
import { type ChartContextValue, ChartProvider } from "./chart-context";

export type BrailleViewport = {
	x?: DomainValue[] | ContinuousDomain;
	y?: ContinuousDomain;
};

export type BrailleChartProps<TDatum extends ChartDatum> =
	React.HTMLAttributes<HTMLDivElement> & {
		data?: TDatum[];
		series?: BrailleSeriesConfig<TDatum>[];
		xKey?: DataKey<TDatum, DomainValue>;
		columns?: number;
		includeZero?: boolean;
		resolution?: Partial<BrailleResolution>;
		rows?: number;
		viewport?: BrailleViewport;
		xDomain?: DomainValue[] | ContinuousDomain;
		xTickCount?: number;
		xTickPeriod?: number;
		yDomain?: ContinuousDomain;
		yTickCount?: number;
		yTickPeriod?: number;
	};

function seriesData<TDatum extends ChartDatum>(
	chartData: TDatum[],
	series: BrailleSeriesConfig<TDatum>,
): TDatum[] {
	return series.data ?? chartData;
}

function collectXValues<TDatum extends ChartDatum>(
	chartData: TDatum[],
	series: BrailleSeriesConfig<TDatum>[],
	xKey?: DataKey<TDatum, DomainValue>,
): DomainValue[] {
	return series.flatMap((item) => {
		const resolvedXKey = item.xKey ?? xKey;

		if (!resolvedXKey) {
			return [];
		}

		return seriesData(chartData, item).map((datum, index) =>
			readDomainValue(datum, resolvedXKey, index),
		);
	});
}

function collectYValues<TDatum extends ChartDatum>(
	chartData: TDatum[],
	series: BrailleSeriesConfig<TDatum>[],
): number[] {
	return series.flatMap((item) =>
		seriesData(chartData, item).map((datum, index) =>
			readNumber(datum, item.dataKey, index),
		),
	);
}

export function BrailleChart<TDatum extends ChartDatum>({
	data = [],
	series = [],
	xKey,
	columns,
	rows,
	includeZero = false,
	resolution,
	viewport,
	xDomain,
	xTickCount = 5,
	xTickPeriod,
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
	const xValues = collectXValues(data, series, xKey);
	const yValues = collectYValues(data, series);
	const resolvedXDomain =
		explicitXDomain ??
		(xValues.length > 0
			? isContinuousDomain(xValues)
				? continuousDomain(
						xValues.map((value) => ({ value })),
						"value",
					)
				: categoryDomain(
						xValues.map((value) => ({ value })),
						"value",
					)
			: undefined);
	const resolvedYDomain =
		explicitYDomain ??
		(yValues.length > 0
			? numberDomain(
					yValues.map((value) => ({ value })),
					"value",
					{ includeZero },
				)
			: undefined);
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

	const contextValue = {
		columns: resolvedColumns,
		data,
		rows: resolvedRows,
		series,
		xDomain: resolvedXDomain,
		xKey,
		xScale,
		xTicks,
		yDomain: resolvedYDomain,
		yScale,
		yTicks,
	} as ChartContextValue;

	return (
		<ChartProvider value={contextValue}>
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
