"use client";

import type * as React from "react";
import { cn } from "../lib/utils";

export type BrailleLegendItem = {
	id: string;
	label: React.ReactNode;
	color?: string;
	marker?: React.ReactNode;
};

export type BrailleLegendProps = React.HTMLAttributes<HTMLUListElement> & {
	items: BrailleLegendItem[];
};

export function BrailleLegend({
	items,
	className,
	...props
}: BrailleLegendProps) {
	return (
		<ul className={cn("braille-chart__legend", className)} {...props}>
			{items.map((item) => (
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
