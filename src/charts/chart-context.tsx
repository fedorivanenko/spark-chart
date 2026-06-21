"use client";

import * as React from "react";
import type { TerminalChartFrame } from "../core/render";

export type ChartContextValue = TerminalChartFrame;

const ChartContext = React.createContext<ChartContextValue | null>(null);

export const ChartProvider = ChartContext.Provider;

export function useChartContext() {
	const context = React.useContext(ChartContext);

	if (!context) {
		throw new Error(
			"Braille chart components must be rendered inside <BrailleChart>.",
		);
	}

	return context;
}
