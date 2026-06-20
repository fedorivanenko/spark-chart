"use client";

import type * as React from "react";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";

export type BrailleAxisProps = React.HTMLAttributes<HTMLDivElement> & {
	axis: "x" | "y";
	label?: string;
	min?: React.ReactNode;
	max?: React.ReactNode;
};

export function BrailleAxis({
	axis,
	label,
	min,
	max,
	className,
	...props
}: BrailleAxisProps) {
	const context = useChartContext();
	const ticks = axis === "x" ? context.xTicks : context.yTicks;
	const shouldUseManualLabels = min !== undefined || max !== undefined;
	const hasScale = axis === "x" ? context.xScale : context.yScale;

	return (
		<div
			className={cn(
				"braille-chart__axis",
				axis === "x" && "braille-chart__axis--x",
				axis === "y" && "braille-chart__axis--y",
				className,
			)}
			style={{ height: `${context.rows}lh`, width: `${context.columns}ch` }}
			{...props}
		>
			{shouldUseManualLabels || !hasScale ? (
				<>
					<span>{min}</span>
					{label ? <span>{label}</span> : null}
					<span>{max}</span>
				</>
			) : (
				<>
					{label ? (
						<span
							className="braille-chart__axis-label"
							style={
								axis === "x"
									? {
											left: `${context.columns + 1}ch`,
											top: `${context.rows + 1}lh`,
										}
									: { left: "-8ch", top: "-1lh" }
							}
						>
							{axis === "x" ? `→ (${label})` : `(${label}) ↑`}
						</span>
					) : null}
					{ticks.map((tick) => (
						<span
							className="braille-chart__tick-label"
							key={`${axis}-${tick.label}`}
							style={
								axis === "x"
									? {
											left: `${(context.xScale?.(tick.value) ?? 0) / 2}ch`,
											top: `${context.rows + 1}lh`,
										}
									: {
											left: "-8ch",
											top: `${(context.yScale?.(Number(tick.value)) ?? 0) / 4}lh`,
										}
							}
						>
							{tick.label}
						</span>
					))}
				</>
			)}
		</div>
	);
}
