"use client";

import type * as React from "react";
import { cn } from "../lib/utils";
import { useChartContext } from "./chart-context";

export type BrailleLegendItem = {
	id: string;
	label: React.ReactNode;
	color?: string;
	marker?: React.ReactNode;
};

export type BrailleLegendProps = React.HTMLAttributes<HTMLUListElement> & {
	items?: BrailleLegendItem[];
	series?: string[];
};

export function BrailleLegend({
	items,
	series,
	className,
	...props
}: BrailleLegendProps) {
	const context = useChartContext();
	const resolvedItems =
		items ??
		context.series
			.filter((item) => !series || series.includes(item.id))
			.map((item) => ({
				id: item.id,
				label: item.label ?? item.id,
				color: item.color,
				marker: item.marker,
			}));

	return (
		<ul className={cn("braille-chart__legend", className)} {...props}>
			{resolvedItems.map((item) => (
				<li className="braille-chart__legend-item" key={item.id}>
					<span
						aria-hidden="true"
						className="braille-chart__legend-marker"
						style={{ color: item.color }}
					>
						{item.marker ?? "⠿"}
					</span>
					<span>{item.label}</span>
				</li>
			))}
		</ul>
	);
}
