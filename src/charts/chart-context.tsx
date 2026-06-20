"use client";

import * as React from "react";
import type { Scale } from "../core/scale";
import type { ChartTick } from "../core/ticks";
import type { ChartDatum, ContinuousDomain, DomainValue } from "../core/types";

export type ChartContextValue<TDatum extends ChartDatum = ChartDatum> = {
	data: TDatum[];
	columns: number;
	rows: number;
	xDomain?: DomainValue[] | ContinuousDomain;
	yDomain?: ContinuousDomain;
	xScale?: Scale;
	yScale?: Scale<number>;
	xTicks: ChartTick[];
	yTicks: ChartTick[];
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

export const ChartProvider = ChartContext.Provider;

export function useChartContext<TDatum extends ChartDatum>() {
	const context = React.useContext(ChartContext);

	if (!context) {
		throw new Error(
			"Braille chart components must be rendered inside <BrailleChart>.",
		);
	}

	return context as ChartContextValue<TDatum>;
}
